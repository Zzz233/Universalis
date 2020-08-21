/**
 * @name Upload History Count
 * @url /api/extra/stats/upload-history
 * @param entries number The number of entries to return.
 * @returns uploadCountByDay DailyUploadStatistics A 30-index long array containing upload tallies for each of the past 30 days.
 */

import { ParameterizedContext } from "koa";

export async function parseUploadHistory(ctx: ParameterizedContext) {
	let daysToReturn: any = ctx.queryParams.entries;
	if (daysToReturn) daysToReturn = parseInt(daysToReturn.replace(/[^0-9]/g, ""));

	const data: DailyUploadStatistics = await extraDataManager.getDailyUploads(daysToReturn);

	if (!data) {
		ctx.body = {
			uploadCountByDay: [],
		} as DailyUploadStatistics;
		return;
	}

	ctx.body = data;
}
