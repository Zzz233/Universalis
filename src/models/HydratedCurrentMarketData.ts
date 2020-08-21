import { CurrentMarketData } from "./CurrentMarketData";
import { HydratedListing } from "./HydratedListing";
import { HydratedTransactionRecord } from "./HydratedTransactionRecord";

export interface HydratedCurrentMarketData extends CurrentMarketData {
	listings: HydratedListing[];
	recentHistory: HydratedTransactionRecord[];

	averagePrice: number;
	averagePriceNQ: number;
	averagePriceHQ: number;

	saleVelocity: number;
	saleVelocityNQ: number;
	saleVelocityHQ: number;
	saleVelocityUnits: "per day";

	stackSizeHistogram: { [key: number]: number };
	stackSizeHistogramNQ: { [key: number]: number };
	stackSizeHistogramHQ: { [key: number]: number };
}
