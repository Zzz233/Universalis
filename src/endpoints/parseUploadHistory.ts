/**
 * @name Upload History Count
 * @url /api/extra/stats/upload-history
 * @param entries number The number of entries to return.
 * @returns uploadCountByDay number[] An (<code>entries</code> or 30)-index long array containing upload tallies for each of the past (<code>entries</code> or 30) days.
 */

import { aql } from "arangojs";
import { ParameterizedContext } from "koa";
import { Database } from "../db";
import { tryGetEntriesToReturn } from "../util";

const MS_PER_DAY = 86400000;

export async function parseUploadHistory(ctx: ParameterizedContext) {
	const daysToReturn = tryGetEntriesToReturn(ctx) || 30;

	const data = await Database.query(aql`
		FOR record in UploadHistory
			FILTER d.timestamp * 1000 > ${daysToReturn * MS_PER_DAY}
			COLLECT timestamp = FLOOR(d.timestamp / ${MS_PER_DAY}) * ${MS_PER_DAY}
				WITH COUNT INTO uploadsPerDay
			SORT timestamp DESC
			RETURN uploadsPerDay
	`);

	ctx.body = {
		uploadCountByDay: await data.all(),
	};
}
