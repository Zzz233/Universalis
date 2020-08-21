import * as R from "remeda";
import { hasHtmlTags } from "./hasHtmlTags";
import { removeUnsafeCharacters } from "./removeUnsafeCharacters";

import { MarketBoardTransactionRecord } from "../models/MarketBoardTransactionRecord";
import { MarketBoardTransactionRecordHydrated } from "../models/MarketBoardTransactionRecordHydrated";

export function cleanHistoryEntry(
	entry: MarketBoardTransactionRecord,
	sourceName?: string,
): MarketBoardTransactionRecord {
	const stringifiedEntry = JSON.stringify(entry);
	if (hasHtmlTags(stringifiedEntry)) {
		entry = JSON.parse(stringifiedEntry.replace(/<[\s\S]*?>/, ""));
	}

	const newEntry = R.pipe(
		entry,
		R.pick(["pricePerUnit", "quantity", "timestamp"]),
		R.merge({
			buyerName: removeUnsafeCharacters(entry.buyerName),
			hq: entry.hq || false,
			uploadApplication: entry.uploadApplication || sourceName,
		}),
	);

	if (typeof newEntry.hq === "number") {
		// newListing.hq as a conditional will be truthy if not 0
		newEntry.hq = newEntry.hq ? true : false;
	}

	return newEntry;
}

export function cleanHistoryEntryOutput(
	entry: MarketBoardTransactionRecordHydrated,
): MarketBoardTransactionRecordHydrated {
	const stringifiedEntry = JSON.stringify(entry);
	if (hasHtmlTags(stringifiedEntry)) {
		entry = JSON.parse(stringifiedEntry.replace(/<[\s\S]*?>/, ""));
	}

	return R.pipe(
		entry,
		R.pick(["hq", "pricePerUnit", "quantity", "timestamp", "worldName"]),
		R.merge({
			buyerName: removeUnsafeCharacters(entry.buyerName),
			total: entry.pricePerUnit * entry.quantity,
		}),
	);
}
