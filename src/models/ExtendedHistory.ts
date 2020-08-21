import { MinimizedTransactionEntry } from "./MinimizedTransactionEntry";

export interface ExtendedHistory {
	dcName: string;
	worldID: number;
	itemID: number;
	lastUploadTime: number;
	entries: MinimizedTransactionEntry[];
}
