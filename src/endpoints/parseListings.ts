/**
 * @name Market Listings
 * @url /api/:world/:item
 * @param world string | number The world or DC to retrieve data from.
 * @param item number The item to retrieve data for.
 */

import fs from "fs";
import path from "path";
import * as R from "remeda";

import { aql } from "arangojs";
import { ParameterizedContext } from "koa";
import { CITY, HTTP_STATUS } from "../data";
import { Database } from "../db";
import { CurrentMarketData } from "../models/CurrentMarketData";
import { HydratedCurrentMarketData } from "../models/HydratedCurrentMarketData";
import { ServerDirectory } from "../service";
import {
	calculateAveragePrices,
	calculateSaleVelocities,
	makeStackSizeHistograms,
	tryGetDcName,
	tryGetWorldId,
} from "../util";

const marketableItemIds = JSON.parse(
	fs.readFileSync(path.join(__dirname, "..", "..", "public", "json", "item.json")).toString(),
);

export async function parseListings(ctx: ParameterizedContext) {
	const itemIds = (ctx.params.item as string).split(",").map((id, index) => {
		if (index > 100) return;
		return parseInt(id);
	});

	if (itemIds.length === 1) {
		if (!marketableItemIds.includes(itemIds[0])) {
			ctx.throw(HTTP_STATUS.NOT_FOUND);
		}
	}

	const worldId = tryGetWorldId(ctx);
	let dcName = tryGetDcName(ctx);
	if (worldId == null && dcName == null) ctx.throw("Invalid World or Data Center");
	if (dcName == null) dcName = ServerDirectory.getDataCenterForWorldId(worldId);

	const processedItems: HydratedCurrentMarketData[] = [];
	for (const itemId of itemIds) {
		let data: CurrentMarketData;
		if (worldId != null) {
			// World ID is more specific than DC so we prioritize that
			data = await getMarketDataForWorld(itemId, worldId);
		} else {
			const datums = await getMarketDataForDataCenter(itemId, dcName);
			data = datums[0];
			data.lastUploadTime = Math.max(...datums.map((d) => d.lastUploadTime));
			data.listings = datums
				.map((d) => d.listings)
				.reduce((aggregatedListings, nextListings) => aggregatedListings.concat(nextListings))
				.sort((l1, l2) => l2.pricePerUnit - l1.pricePerUnit);
			data.recentHistory = datums
				.map((d) => d.recentHistory)
				.reduce((aggregatedRecords, nextRecords) => aggregatedRecords.concat(nextRecords))
				.sort((l1, l2) => l2.timestamp - l1.timestamp);
		}

		const hydratedData = hydrate(data);

		delete hydratedData.uploadApplication;
		delete hydratedData.uploaderID;

		processedItems.push(hydratedData);
	}

	const resolvedItems = processedItems.map((item) => item.itemID);
	const unresolvedItems = R.difference(itemIds, resolvedItems);

	const multipleItemResponse: {
		itemIDs: number[];
		items: HydratedCurrentMarketData[];
		worldID: number;
		dcName: string;
		unresolvedItems: number[];
	} = {
		itemIDs: itemIds,
		items: processedItems,
		worldID: worldId,
		dcName,
		unresolvedItems,
	};

	multipleItemResponse.unresolvedItems = unresolvedItems;

	for (const item of unresolvedItems) {
		const unresolvedItemData: HydratedCurrentMarketData = {
			itemID: item,
			worldID: worldId,
			worldName: ServerDirectory.getWorldNameById(worldId),
			dcName,
			lastUploadTime: 0,
			listings: [],
			recentHistory: [],
			averagePrice: null,
			averagePriceNQ: null,
			averagePriceHQ: null,
			regularSaleVelocity: null,
			nqSaleVelocity: null,
			hqSaleVelocity: null,
			stackSizeHistogram: null,
			stackSizeHistogramNQ: null,
			stackSizeHistogramHQ: null,
			uploaderID: null,
			uploadApplication: null,
		};
		delete unresolvedItemData.uploadApplication;
		delete unresolvedItemData.uploaderID;
		multipleItemResponse.items.push(unresolvedItemData);
	}

	// If only one item is requested we just turn the whole thing into the one item.
	if (itemIds.length === 1) {
		ctx.body = multipleItemResponse.items[0];
	} else {
		ctx.body = multipleItemResponse;
	}
}

function hydrate(o: CurrentMarketData): HydratedCurrentMarketData {
	const nqItems = o.recentHistory.filter((entry) => !entry.hq);
	const hqItems = o.recentHistory.filter((entry) => entry.hq);
	return R.pipe(
		o,
		R.merge({ worldName: ServerDirectory.getWorldNameById(o.worldID) }),
		R.merge({
			listings: o.listings.map((l) =>
				R.merge(l, {
					worldName: ServerDirectory.getWorldNameById(l.worldID),
					itemName: "placeholder", // TODO: build local mapping
					retainerCityName: CITY[l.retainerCity],
				}),
			),
			recentHistory: o.recentHistory.map((r) =>
				R.merge(r, {
					worldName: ServerDirectory.getWorldNameById(r.worldID),
					itemName: "placeholder", // TODO: build local mapping
				}),
			),
		}),
		R.merge(calculateSaleVelocities(o.recentHistory, nqItems, hqItems)),
		R.merge(calculateAveragePrices(o.recentHistory, nqItems, hqItems)),
		R.merge(makeStackSizeHistograms(o.recentHistory, nqItems, hqItems)),
	);
}

async function getMarketDataForWorld(itemId: number, worldId: number): Promise<CurrentMarketData> {
	// The SORT-LIMIT is for the event that there are multiple documents for an itemId-worldId combo.
	// It shouldn't happen, but we don't want to explode if it does.
	const data = await Database.query(aql`
		FOR currentDataEntry IN CurrentData
			FILTER currentDataEntry.worldID == ${worldId}
			FILTER currentDataEntry.itemID == ${itemId}
			SORT currentDataEntry.lastUploadTime DESC
			LIMIT 1
			RETURN currentDataEntry
	`);
	return await data.all()[0];
}

async function getMarketDataForDataCenter(
	itemId: number,
	dcName: string,
): Promise<CurrentMarketData[]> {
	const data = await Database.query(aql`
		FOR currentDataEntry IN CurrentData
			FILTER currentDataEntry.dcName == ${dcName}
			FILTER currentDataEntry.itemID == ${itemId}
			COLLECT worldId = currentDataEntry.worldID INTO world
			RETURN {
				worldId,
				marketData: (FOR entry IN world
								SORT entry.lastUploadTime DESC
								LIMIT 1
								RETURN entry.currentDataEntry)
			}
	`);
	return await data.all();
}
