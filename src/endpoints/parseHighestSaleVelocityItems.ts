/**
 * @name Highest Sale Velocity Items
 * @url /api/extra/highest-sale-velocity
 * @param world string | number The world to retrieve data from.
 * @experimental
 */

import { ParameterizedContext } from "koa";

import { aql } from "arangojs";
import { Database } from "../db";
import { tryGetEntriesToReturn, tryGetWorldId } from "../util";

const MS_PER_WEEK = 604800000;

export async function parseHighestSaleVelocityItems(ctx: ParameterizedContext) {
	const worldId = tryGetWorldId(ctx);
	if (!worldId) return ctx.throw(404, "Invalid World");

	const entriesToReturn = tryGetEntriesToReturn(ctx) || 50;

	const data = await Database.query(aql`
		FOR record IN TransactionRecords
			FILTER record.worldID == ${worldId}
			FILTER record.timestamp * 1000 > ${Date.now() - MS_PER_WEEK}
			COLLECT itemID = record.itemID WITH COUNT IN n
			AGGREGATE saleVelocity = n / 7
			SORT saleVelocity DESC
			LIMIT ${entriesToReturn}
			RETURN {
				itemID,
				worldID: ${worldId},
				saleVelocity,
			}
	`);

	ctx.body = {
		items: await data.all(),
	};
}
