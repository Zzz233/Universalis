/**
 * @name Marketable Items
 * @url /api/marketable
 * @returns  number[] The entire list of marketable items.
 */

import fs from "fs";
import path from "path";

import { ParameterizedContext } from "koa";

const marketableItemIds = JSON.parse(
	fs.readFileSync(path.join(__dirname, "..", "..", "public", "json", "item.json")).toString(),
);

export async function serveItemIdJson(ctx: ParameterizedContext): Promise<any> {
	ctx.body = marketableItemIds;
}
