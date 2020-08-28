/**
 * @name Upload
 * @url /upload
 */

import { Context } from "koa";
import * as R from "remeda";
import { CITY, HTTP_STATUS } from "../data";
import { TransactionRecord } from "../models/TransactionRecord";
import { Logger } from "../service";
import { parseSha256 } from "../util";

export async function upload(ctx: Context) {
	validation.validateUploadDataPreCast(ctx);

	const promises: Array<Promise<any>> = []; // Sort of like a thread list.

	// Accept identity via API key.
	const trustedSource: TrustedSource = await trustedSourceManager.get(ctx.params.apiKey);
	if (!trustedSource) return ctx.throw(HttpStatusCodes.UNAUTHENTICATED);
	const sourceName = trustedSource.sourceName;
	promises.push(trustedSourceManager.increaseUploadCount(ctx.params.apiKey));
	Logger.log("Received upload from " + sourceName + ":\n" + JSON.stringify(ctx.request.body));
	promises.push(extraDataManager.incrementDailyUploads());

	// Preliminary data processing and metadata stuff
	if (ctx.request.body.retainerCity)
		ctx.request.body.retainerCity = CITY[ctx.request.body.retainerCity];
	const uploadData: GenericUpload = ctx.request.body;

	uploadData.uploaderID = parseSha256(uploadData.uploaderID + "");

	await validation.validateUploadData(logger, {
		ctx,
		uploadData,
		blacklistManager,
		remoteDataManager,
	});

	// Hashing and passing data
	if (uploadData.listings) {
		const dataArray: MarketBoardItemListing[] = [];

		for (const listing of uploadData.listings) {
			// Ensures retainer and listing information exists
			const cleanListing = validation.cleanListing(listing, sourceName);

			// Needs to be called separately because... reasons
			cleanListing.materia = validation.cleanMateriaArray(cleanListing.materia);

			if (cleanListing.creatorID && cleanListing.creatorName) {
				contentIDCollection.set(cleanListing.creatorID, "player", {
					characterName: cleanListing.creatorName,
				});
			}

			contentIDCollection.set(cleanListing.retainerID, "retainer", {
				characterName: cleanListing.retainerName,
			});

			dataArray.push(listing as any);
		}

		// Post listing to DB
		promises.push(
			priceTracker.set(
				uploadData.uploaderID,
				sourceName,
				uploadData.itemID,
				uploadData.worldID,
				dataArray as MarketBoardItemListing[],
			),
		);
	}

	if (uploadData.entries) {
		const dataArray: TransactionRecord[] = [];
		uploadData.entries = uploadData.entries.map((entry) => {
			return validation.cleanHistoryEntry(entry, sourceName);
		});

		for (const entry of uploadData.entries) {
			dataArray.push(entry);
		}

		promises.push(
			historyTracker.set(
				uploadData.uploaderID,
				uploadData.itemID,
				uploadData.worldID,
				dataArray as MarketBoardHistoryEntry[],
			),
		);
	}

	if (uploadData.marketTaxRates) {
		promises.push(
			extraDataManager.setTaxRates(
				uploadData.worldID,
				R.merge(uploadData.marketTaxRates, {
					uploaderID: uploadData.uploaderID,
					sourceName,
				}),
			),
		);
	}

	if (uploadData.contentID && uploadData.characterName) {
		promises.push(
			contentIDCollection.set(uploadData.contentID, "player", {
				characterName: uploadData.characterName,
			}),
		);
	}

	// Bulk operations
	if (uploadData.op) {
		const op = uploadData.op;
		if (uploadData.itemIDs && uploadData.worldID && op.listings === -1) {
			if (uploadData.itemIDs.length <= 100) {
				for (const itemID of uploadData.itemIDs) {
					promises.push(
						priceTracker.set(uploadData.uploaderID, sourceName, itemID, uploadData.worldID, []),
					);
				}
			} else {
				Logger.warn("Attempted to run a bulk delisting of over 100 items, rejecting.");
				return ctx.throw(HTTP_STATUS.UNPROCESSABLE_ENTITY);
			}
		}
	}

	await Promise.all(promises);

	ctx.body = "Success";
}
