import { Listing } from "./Listing";

export interface HydratedListing extends Listing {
	worldName: string;
	itemName: string;
	retainerCityName: string;
}
