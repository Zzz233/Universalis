import { OriginRecord } from "./OriginRecord";

export interface MarketBoardTransactionRecord extends OriginRecord {
	worldID: number;
	itemID: number;
	hq: boolean;
	pricePerUnit: number;
	quantity: number;
	total: number;
	buyerName: string;
	timestamp: number;
	onMannequin: boolean;
}
