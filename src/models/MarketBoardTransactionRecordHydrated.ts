import { MarketBoardTransactionRecord } from "./MarketBoardTransactionRecord";

export interface MarketBoardTransactionRecordHydrated
	extends MarketBoardTransactionRecord {
	worldName: string;
	itemName: string;
}
