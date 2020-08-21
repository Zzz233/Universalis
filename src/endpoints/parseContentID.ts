/**
 * @name Content IDs
 * @url /api/extra/content/:contentID
 * @param contentID string The content ID of the content you wish to retrieve from the content database.
 * @returns contentID string The content ID of the object retrieved.
 * @returns contentType string The category of the object retrieved.
 * @experimental
 */

import { ParameterizedContext } from "koa";
import { HTTP_STATUS } from "../data";
import { Database } from "../db";
import { Content } from "../models/Content";

export async function parseContentID(ctx: ParameterizedContext) {
	if (!ctx.params.contentID) {
		ctx.throw(HTTP_STATUS.NOT_FOUND);
	}

	const collection = await Database.collection("Content");
	const content = await collection.document(ctx.params.contentID);

	if (!content) {
		ctx.body = {
			contentID: null,
			contentType: null,
			content: null,
		} as Content;
		return;
	}

	ctx.body = content;
}
