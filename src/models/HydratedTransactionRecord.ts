import { TransactionRecord } from "./TransactionRecord";

export interface HydratedTransactionRecord extends TransactionRecord {
	worldName: string;
	itemName: string;
}
