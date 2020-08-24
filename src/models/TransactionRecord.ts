import { MinimizedTransactionRecord } from "./MinimizedTransactionRecord";

export interface TransactionRecord extends MinimizedTransactionRecord {
	total: number;
	buyerName: string;
	onMannequin: boolean;
}
