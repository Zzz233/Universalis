/**
 * @name Recently-Updated Items
 * @url /api/extra/stats/recently-updated
 * @param entries number The number of entries to return.
 * @returns items RecentlyUpdated The most-recently-updated items, up to "entries".
 */

import { aql } from "arangojs";
import { ParameterizedContext } from "koa";
import { Database } from "../db";
import { tryGetEntriesToReturn } from "../util";

export async function parseRecentlyUpdatedItems(ctx: ParameterizedContext) {
	const entriesToReturn = tryGetEntriesToReturn(ctx) || 50;

	const data = await Database.query(aql`
		FOR record in UploadHistory
			FILTER record.itemID != null
			SORT record.timestamp DESC
			LIMIT ${entriesToReturn}
			RETURN record.itemID
	`);

	ctx.body = {
		items: await data.all(),
	};
}
