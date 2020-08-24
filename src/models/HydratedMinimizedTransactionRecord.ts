import { MinimizedTransactionRecord } from "./MinimizedTransactionRecord";

export interface HydratedMinimizedTransactionRecord extends MinimizedTransactionRecord {
	worldName: string;
}
