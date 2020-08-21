/**
 * @name Uploader Application Counts
 * @url /api/extra/stats/uploader-upload-counts
 * @returns  [{sourceName:string;uploadCount:number;}] An array of uploader source names and their respective total upload counts.
 */

import { aql } from "arangojs";
import { ParameterizedContext } from "koa";
import { Database } from "../db";
import { TrustedSourcePublic } from "../models/TrustedSourcePublic";

export async function parseUploaderCounts(ctx: ParameterizedContext): Promise<any> {
	const response = await Database.query(aql`
		FOR document IN TrustedSources
			RETURN {
				"sourceName": document.sourceName,
				"uploadCount": document.uploadCount
			}
	`);
	const data: TrustedSourcePublic = await response.all();
	ctx.body = data;
}
