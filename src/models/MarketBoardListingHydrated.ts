import { MarketBoardListing } from "./MarketBoardListing";

export interface MarketBoardListingHydrated extends MarketBoardListing {
	worldName: string;
	itemName: string;
	retainerCityName: string;
}
