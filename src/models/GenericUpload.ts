import { Listing } from "./Listing";
import { TaxRates } from "./TaxRates";
import { TransactionRecord } from "./TransactionRecord";
import { TrustedUpload } from "./TrustedUpload";

export interface GenericUpload extends TrustedUpload {
	itemID?: number;
	itemIDs?: number[];
	worldID?: number;

	contentID?: string | number;
	characterName?: string;
	entries?: TransactionRecord[];
	listings?: Listing[];
	marketTaxRates?: TaxRates;

	op?: {
		listings?: number;
	};
}
