import { MarketBoardListing } from "./MarketBoardListing";
import { MarketBoardTransactionRecord } from "./MarketBoardTransactionRecord";
import { MarketTaxRates } from "./MarketTaxRates";
import { TrustedUpload } from "./TrustedUpload";

export interface GenericUpload extends TrustedUpload {
	itemID?: number;
	itemIDs?: number[];
	worldID?: number;

	contentID?: string | number;
	characterName?: string;
	entries?: MarketBoardTransactionRecord[];
	listings?: MarketBoardListing[];
	marketTaxRates?: MarketTaxRates;

	op?: {
		listings?: number;
	};
}
