import { MarketBoardListingHydrated } from "./MarketBoardListingHydrated";
import { MarketBoardTransactionRecordHydrated } from "./MarketBoardTransactionRecordHydrated";

export interface MarketBoardListingsEndpoint {
	itemID: number;
	lastUploadTime: number;
	listings: MarketBoardListingHydrated[];
	recentHistory: MarketBoardTransactionRecordHydrated[];
	worldID: number;
	dcName: string;

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
