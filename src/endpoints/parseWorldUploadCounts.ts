/**
 * @name Upload Counts By-World
 * @url /api/extra/stats/world-upload-counts
 * @returns  {count:number;proportion:number;} The total uploads and the proportion of that to the total uploads on the website, per world.
 */

import { aql } from "arangojs";
import { ParameterizedContext } from "koa";
import { Database } from "../db";
import { ServerDirectory } from "../service";

export async function parseWorldUploadCounts(ctx: ParameterizedContext) {
	const data = await Database.query(aql`
		FOR record in UploadHistory
			COLLECT worldId = record.worldID WITH COUNT INTO uploadsPerWorld
			RETURN {
				worldId,
				uploadsPerWorld
			}
	`);

	const worldUploadCounts = (await data.all()) as Array<{
		worldId: number;
		uploadsPerWorld: number;
	}>;

	const mergedEntries = {};

	let sum = 0;

	worldUploadCounts.forEach((worldUploadCount) => {
		sum += worldUploadCount.uploadsPerWorld;
	});

	worldUploadCounts.forEach((worldUploadCount) => {
		mergedEntries[ServerDirectory.getWorldNameById(worldUploadCount.worldId)] = {
			count: worldUploadCount.uploadsPerWorld,
			proportion: worldUploadCount.uploadsPerWorld / sum,
		};
	});

	ctx.body = mergedEntries;
}
