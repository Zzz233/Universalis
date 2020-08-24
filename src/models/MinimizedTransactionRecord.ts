import { OriginRecord } from "./OriginRecord";

export interface MinimizedTransactionRecord extends OriginRecord {
	worldID: number;
	itemID: number;

	hq: boolean;
	pricePerUnit: number;
	quantity: number;
	timestamp: number;
	uploadTime: number;
}
