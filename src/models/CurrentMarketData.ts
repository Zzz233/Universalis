import { Listing } from "./Listing";
import { OriginRecord } from "./OriginRecord";
import { TransactionRecord } from "./TransactionRecord";

export interface CurrentMarketData extends OriginRecord {
	itemID: number;
	worldID: number;
	dcName: string;
	lastUploadTime: number;
	listings: Listing[];
	recentHistory: TransactionRecord[];
}
