import fs from "fs";
import path from "path";

import { Context } from "koa";
import { HTTP_STATUS } from "../data";
import { GenericUpload } from "../models/GenericUpload";
import { Logger } from "../service";
import { hasHtmlTags } from "./hasHtmlTags";
import {
	areHistoryEntriesValid,
	areListingsValid,
	areValidTaxRates,
	isValidName,
	isValidWorld,
} from "./isValidTypes";

const marketableItemIds = JSON.parse(
	fs.readFileSync(path.join(__dirname, "..", "..", "public", "json", "item.json")).toString(),
);

export function validateUploadDataPreCast(ctx: Context): void | never {
	if (!ctx.params.apiKey) {
		ctx.throw(HTTP_STATUS.UNAUTHENTICATED);
	}

	if (!ctx.is("json") || hasHtmlTags(JSON.stringify(ctx.request.body))) {
		ctx.throw(HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE);
	}
}

export async function validateUploadData(
	ctx: Context,
	uploadData: GenericUpload,
): Promise<void | never> {
	// Check blacklisted uploaders (people who upload fake data)
	if (
		uploadData.uploaderID == null ||
		(await blacklistManager.has(uploadData.uploaderID as string))
	) {
		ctx.throw(HTTP_STATUS.FORBIDDEN);
	}

	// You can't upload data for these worlds because you can't scrape it.
	// This does include Korean worlds for the time being.
	if (
		(uploadData.listings || uploadData.entries || uploadData.marketTaxRates) &&
		!isValidWorld(uploadData.worldID)
	) {
		Logger.warn(`Data received for unsupported world ${uploadData.worldID}, rejecting.`);
		ctx.body = "Unsupported World";
		ctx.throw(HTTP_STATUS.NOT_FOUND);
	}

	// Filter out junk item IDs.
	if (uploadData.itemID) {
		if (!marketableItemIds.includes(uploadData.itemID)) {
			Logger.warn(`Data received for unsupported item ${uploadData.itemID}, rejecting.`);
			ctx.body = "Unsupported Item";
			ctx.throw(HTTP_STATUS.NOT_FOUND);
		}
	}

	// Listings
	if (uploadData.listings) {
		if (!areListingsValid(uploadData.listings)) {
			ctx.throw(HTTP_STATUS.UNPROCESSABLE_ENTITY, "Bad Listing Data");
		}
	}

	// History entries
	if (uploadData.entries) {
		if (!areHistoryEntriesValid(uploadData.entries)) {
			ctx.throw(HTTP_STATUS.UNPROCESSABLE_ENTITY, "Bad History Data");
		}
	}

	// Market tax rates
	if (uploadData.marketTaxRates) {
		if (!areValidTaxRates(uploadData.marketTaxRates)) {
			ctx.throw(HTTP_STATUS.UNPROCESSABLE_ENTITY, "Bad Market Tax Rate Data");
		}
	}

	// Crafter data
	if (uploadData.contentID && !isValidName(uploadData.characterName)) {
		Logger.warn("Recieved invalid character name, rejecting.");
		ctx.throw(HTTP_STATUS.UNPROCESSABLE_ENTITY);
	}

	// General filters
	if (
		!uploadData.worldID &&
		!uploadData.itemID &&
		!uploadData.itemIDs &&
		!uploadData.marketTaxRates &&
		!uploadData.contentID &&
		!uploadData.op
	) {
		ctx.throw(HTTP_STATUS.UNPROCESSABLE_ENTITY);
	}

	if (
		!uploadData.listings &&
		!uploadData.entries &&
		!uploadData.marketTaxRates &&
		!uploadData.contentID &&
		!uploadData.op
	) {
		ctx.throw(HTTP_STATUS.IM_A_TEAPOT);
	}
}
