import { MinimizedTransactionRecord } from "./MinimizedTransactionRecord";

export interface MinimizedTransactionSet {
	itemID: number;
	lastUploadTime: number;
	worldID: number;
	dcName: string;
	entries: MinimizedTransactionRecord[];
}
