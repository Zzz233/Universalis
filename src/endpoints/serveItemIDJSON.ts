/**
 * @name Marketable Items
 * @url /api/marketable
 * @returns  number[] The entire list of marketable items.
 */

import { ParameterizedContext } from "koa";

export async function serveItemIdJSON(ctx: ParameterizedContext): Promise<any> {
	ctx.body = await rdm.getMarketableItemIDs();
}
