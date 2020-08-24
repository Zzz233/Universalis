import { HydratedMinimizedTransactionRecord } from "./HydratedMinimizedTransactionRecord";
import { MinimizedTransactionSet } from "./MinimizedTransactionSet";
import { StackSizeHistograms } from "./StackSizeHistograms";

export interface HydratedMinimizedTransactionSet
	extends MinimizedTransactionSet,
		StackSizeHistograms {
	worldName: string;

	entries: HydratedMinimizedTransactionRecord[];
}
