import * as R from "remeda";
import { CITY } from "../data";
import { parseSha256 } from "../util/cryptography";
import { hasHtmlTags } from "./hasHtmlTags";
import { removeUnsafeCharacters } from "./removeUnsafeCharacters";

import { MarketBoardListing } from "../models/MarketBoardListing";
import { MarketBoardListingHydrated } from "../models/MarketBoardListingHydrated";

const GAME_RELEASE_DATE_SECONDS = Math.floor(new Date(2013, 7, 27).valueOf() / 1000);

export function cleanListing(listing: MarketBoardListing, sourceName?: string): MarketBoardListing {
	const stringifiedListing = JSON.stringify(listing);
	if (hasHtmlTags(stringifiedListing)) {
		listing = JSON.parse(stringifiedListing.replace(/<[\s\S]*?>/, ""));
	}

	const securedFields = {
		creatorID: parseSha256(listing.creatorID),
		listingID: parseSha256(listing.listingID),
		retainerID: parseSha256(listing.retainerID),
		sellerID: parseSha256(listing.sellerID),
	};

	const cleanedListing = {
		creatorName: removeUnsafeCharacters(listing.creatorName),
		hq: listing.hq || false,
		materia: listing.materia || [],
		onMannequin: listing.onMannequin || false,
		retainerCity:
			typeof listing.retainerCity === "number" ? listing.retainerCity : CITY[listing.retainerCity],
		retainerName: removeUnsafeCharacters(listing.retainerName),
		uploadApplication: sourceName || listing.uploadApplication,
		lastReviewTime:
			listing.lastReviewTime < GAME_RELEASE_DATE_SECONDS
				? Math.floor(new Date().valueOf() / 1000) - listing.lastReviewTime
				: listing.lastReviewTime,
	};

	const newListing = R.pipe(
		listing,
		R.pick(["pricePerUnit", "quantity", "stainID", "uploaderID", "worldName"]),
		R.merge(securedFields),
		R.merge(cleanedListing),
	);

	if (typeof newListing.hq === "number") {
		// newListing.hq as a conditional will be truthy if not 0
		newListing.hq = newListing.hq ? true : false;
	}

	return newListing;
}

export function cleanListingOutput(
	listing: MarketBoardListingHydrated,
): MarketBoardListingHydrated {
	const stringifiedListing = JSON.stringify(listing);
	if (hasHtmlTags(stringifiedListing)) {
		listing = JSON.parse(stringifiedListing.replace(/<[\s\S]*?>/, ""));
	}

	const formattedListing = R.pipe(
		listing,
		R.pick([
			"creatorID",
			"lastReviewTime",
			"listingID",
			"pricePerUnit",
			"quantity",
			"retainerID",
			"sellerID",
			"stainID",
			"worldName",
		]),
		R.merge({
			creatorName: removeUnsafeCharacters(listing.creatorName),
			hq: listing.hq || false,
			isCrafted:
				listing.creatorID !== "5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9" && // 0n
				listing.creatorID !== "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", // ""
			materia: listing.materia || [],
			onMannequin: listing.onMannequin || false,
			retainerCity:
				typeof listing.retainerCity === "number"
					? listing.retainerCity
					: City[listing.retainerCity],
			retainerName: removeUnsafeCharacters(listing.retainerName),
			total: listing.pricePerUnit * listing.quantity,
			lastReviewTime:
				listing.lastReviewTime < gameReleaseDateSeconds
					? Math.floor(new Date().valueOf() / 1000) - listing.lastReviewTime
					: listing.lastReviewTime,
		}),
	);

	return formattedListing;
}
