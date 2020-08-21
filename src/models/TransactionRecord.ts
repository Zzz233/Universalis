import { MinimizedTransactionRecord } from "./MinimizedTransactionRecord";

export interface TransactionRecord extends MinimizedTransactionRecord {
	worldID: number;
	itemID: number;
	total: number;
	buyerName: string;
	onMannequin: boolean;
}
