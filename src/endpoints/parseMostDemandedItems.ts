/**
 * @name Most Demanded Items
 * @url /api/extra/most-demanded
 * @param world string | number The world to retrieve data from.
 * @experimental
 * @disabled
 */

import { aql } from "arangojs";
import { ParameterizedContext } from "koa";
import { Database } from "../db";
import { tryGetEntriesToReturn, tryGetWorldId } from "../util";

const MS_PER_DAY = 86400000;

export async function parseMostDemandedItems(ctx: ParameterizedContext) {
	const worldId = tryGetWorldId(ctx);
	if (worldId == null) ctx.throw(404, "Invalid World");

	const entriesToReturn = tryGetEntriesToReturn(ctx) || 50;

	// Get items updated today with the highest gil trade volume
	const data = await Database.query(aql`
		FOR record IN TransactionRecords
			FILTER record.worldID == ${worldId}
			FILTER record.timestamp * 1000 > ${Date.now() - MS_PER_DAY}
			COLLECT itemID = record.itemID
			AGGREGATE gilTradeVolumeByDay = SUM(record.pricePerUnit * record.quantity)
			SORT gilTradeVolumeByDay DESC
			LIMIT ${entriesToReturn}
			RETURN {
				itemID,
				worldID: ${worldId},
				gilTradeVolumeByDay
			}
	`);

	ctx.body = {
		items: await data.all(),
	};
}
