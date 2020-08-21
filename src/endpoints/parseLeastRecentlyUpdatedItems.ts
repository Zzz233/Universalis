/**
 * @name Least-Recently-Updated Items
 * @url /api/extra/stats/least-recently-updated
 * @param world string | number The world or DC to retrieve data from.
 * @param entries number The number of entries to return.
 * @returns items object[] An array of world-item pairs for the least-recently-updated items.
 */

import { aql } from "arangojs";
import { ParameterizedContext } from "koa";
import { Database } from "../db";
import { ServerDirectory } from "../service";
import { tryGetDcName, tryGetEntriesToReturn, tryGetWorldId } from "../util";

export async function parseLeastRecentlyUpdatedItems(ctx: ParameterizedContext) {
	let worldId = tryGetWorldId(ctx);
	let dcName = tryGetDcName(ctx);

	if (worldId && dcName && worldId !== 0) {
		dcName = null;
	} else if (worldId && dcName && worldId === 0) {
		worldId = null;
	}

	const entriesToReturn = tryGetEntriesToReturn(ctx) || 50;

	// TODO: populate CurrentData with actual objects that have lastUploadTime: 0
	const data = await Database.query(aql`
		FOR currentDataEntry in CurrentData
			SORT currentDataEntry.timestamp ASC
			LIMIT ${entriesToReturn}
			RETURN {
				itemID: currentDataEntry.itemID,
				worldID: currentDataEntry.worldID,
				lastUploadTime: currentDataEntry.lastUploadTime
			}
	`);

	ctx.body = {
		items: ((await data.all()) as Array<{
			itemID: number;
			worldID: number;
			lastUploadTime: number;
		}>).map((o) => {
			return {
				itemID: o.itemID,
				worldID: o.worldID,
				lastUploadTime: o.lastUploadTime,
				worldName: ServerDirectory.getWorldNameById(o.worldID),
			};
		}),
	};
}
