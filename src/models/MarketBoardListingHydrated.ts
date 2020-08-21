import { MarketBoardListing } from "./MarketBoardListing";

export interface MarketBoardListingHydrated extends MarketBoardListing {
	worldName: string;
	itemName: string;
	retainerName: string;
	retainerCityName: string;
	creatorName: string | null;
}
