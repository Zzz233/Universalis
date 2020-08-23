import { AveragePrices } from "./AveragePrices";
import { CurrentMarketData } from "./CurrentMarketData";
import { HydratedListing } from "./HydratedListing";
import { HydratedTransactionRecord } from "./HydratedTransactionRecord";
import { SaleVelocitySeries } from "./SaleVelocitySeries";
import { StackSizeHistograms } from "./StackSizeHistograms";

export interface HydratedCurrentMarketData
	extends CurrentMarketData,
		AveragePrices,
		SaleVelocitySeries,
		StackSizeHistograms {
	listings: HydratedListing[];
	recentHistory: HydratedTransactionRecord[];
}
