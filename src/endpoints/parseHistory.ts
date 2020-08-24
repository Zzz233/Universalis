/**
 * @name Market History
 * @url /api/history/:world/:item
 * @param world string | number The world or DC to retrieve data from.
 * @param item number The item to retrieve data for.
 */

import fs from "fs";
import path from "path";
import * as R from "remeda";

import {
	makeStackSizeHistograms,
	tryGetDcName,
	tryGetEntriesToReturn,
	tryGetWorldId,
} from "../util";

import { ParameterizedContext } from "koa";

import { aql } from "arangojs";
import { HTTP_STATUS } from "../data/HTTP_STATUS";
import { Database } from "../db";
import { HydratedMinimizedTransactionRecord } from "../models/HydratedMinimizedTransactionRecord";
import { HydratedMinimizedTransactionSet } from "../models/HydratedMinimizedTransactionSet";
import { MinimizedTransactionRecord } from "../models/MinimizedTransactionRecord";
import { MinimizedTransactionSet } from "../models/MinimizedTransactionSet";
import { ServerDirectory } from "../service";

const marketableItemIds = JSON.parse(
	fs.readFileSync(path.join(__dirname, "..", "..", "public", "json", "item.json")).toString(),
);

export async function parseHistory(ctx: ParameterizedContext) {
	const entriesToReturn = tryGetEntriesToReturn(ctx);

	const itemIds: number[] = (ctx.params.item as string).split(",").map((id, index) => {
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

	const processedItems: HydratedMinimizedTransactionSet[] = [];
	for (const itemId of itemIds) {
		let data: MinimizedTransactionSet;
		if (worldId != null) {
			// World ID is more specific than DC so we prioritize that
			data = await getMinimizedTransactionsForWorld(itemId, worldId);
		} else {
			data = await getMinimizedTransactionsForDataCenter(itemId, dcName);
		}

		const hydratedData = hydrate(data);

		processedItems.push(hydratedData);
	}

	const resolvedItems = processedItems.map((item) => item.itemID);
	const unresolvedItems = R.difference(itemIds, resolvedItems);

	const multipleItemResponse: {
		itemIDs: number[];
		items: any[];
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
		const unresolvedItemData: HydratedMinimizedTransactionSet = {
			itemID: item,
			worldID: worldId,
			worldName: ServerDirectory.getWorldNameById(worldId),
			dcName,
			lastUploadTime: 0,
			entries: [],
			stackSizeHistogram: null,
			stackSizeHistogramNQ: null,
			stackSizeHistogramHQ: null,
		};
		multipleItemResponse.items.push(unresolvedItemData);
	}

	// If only one item is requested we just turn the whole thing into the one item.
	if (itemIds.length === 1) {
		ctx.body = multipleItemResponse.items[0];
	} else {
		ctx.body = multipleItemResponse;
	}
}

function hydrate(record: MinimizedTransactionSet): HydratedMinimizedTransactionSet {
	const nqItems = record.entries.filter((entry) => !entry.hq);
	const hqItems = record.entries.filter((entry) => entry.hq);
	return R.pipe(
		record,
		R.merge({ worldName: ServerDirectory.getWorldNameById(record.worldID) }),
		R.merge({
			entries: record.entries.map((r) =>
				R.merge(r, {
					worldName: ServerDirectory.getWorldNameById(r.worldID),
				}),
			),
		}),
		R.merge(makeStackSizeHistograms(record.entries, nqItems, hqItems)),
	);
}

async function getMinimizedTransactionsForWorld(
	itemId: number,
	worldId: number,
): Promise<MinimizedTransactionSet> {
	const data = await Database.query(aql`
		FOR record IN MinimizedTransactionRecords
			FILTER record.worldID == ${worldId}
			FILTER record.itemID == ${itemId}
			SORT record.uploadTime DESC
			LIMIT 1200
			RETURN record
	`);
	const records: MinimizedTransactionRecord[] = await data.all();
	return {
		itemID: itemId,
		lastUploadTime: Math.max(...records.map((r) => r.uploadTime)),
		worldID: worldId,
		dcName: ServerDirectory.getDataCenterForWorldId(worldId),
		entries: records,
	};
}

async function getMinimizedTransactionsForDataCenter(
	itemId: number,
	dcName: string,
): Promise<MinimizedTransactionSet> {
	const data = await Database.query(aql`
		FOR record IN MinimizedTransactionRecords
			FILTER record.dcName == ${dcName}
			FILTER record.itemID == ${itemId}
			SORT record.uploadTime DESC
			LIMIT 1200
			RETURN record
	`);
	const records: MinimizedTransactionRecord[] = await data.all();
	return {
		itemID: itemId,
		lastUploadTime: Math.max(...records.map((r) => r.uploadTime)),
		worldID: null,
		dcName,
		entries: records,
	};
}
