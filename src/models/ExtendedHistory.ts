import { MinimizedTransactionRecord } from "./MinimizedTransactionRecord";

export interface ExtendedHistory {
	dcName: string;
	worldID: number;
	itemID: number;
	lastUploadTime: number;
	entries: MinimizedTransactionRecord[];
}
