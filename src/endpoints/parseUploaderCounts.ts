/**
 * @name Uploader Application Counts
 * @url /api/extra/stats/uploader-upload-counts
 * @returns  [{sourceName:string;uploadCount:number;}] An array of uploader source names and their respective total upload counts.
 */

import { aql } from "arangojs";
import { ParameterizedContext } from "koa";
import { Database } from "../db";
import { TrustedSource } from "../models/TrustedSource";

export async function parseUploaderCounts(ctx: ParameterizedContext): Promise<any> {
	const tsdb = await Database.collection<TrustedSource>("trustedSources");
	const response = await Database.query(aql`
		FOR document IN ${tsdb}
			RETURN {
				"sourceName": document.sourceName,
				"uploadCount": document.uploadCount
			}
	`);
	const data = ((await response.map((o) => {
		return { sourceName: o.sourceName, uploadCount: o.uploadCount };
	})) as unknown) as TrustedSource[];
	ctx.body = data;
}
