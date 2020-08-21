import { OriginRecord } from "./OriginRecord";

export interface MinimizedTransactionRecord extends OriginRecord {
	hq: boolean;
	pricePerUnit: number;
	quantity: number;
	timestamp: number;
}
