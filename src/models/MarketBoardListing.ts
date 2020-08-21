import { ItemMateria } from "./ItemMateria";
import { OriginRecord } from "./OriginRecord";

export interface MarketBoardListing extends OriginRecord {
	listingID: string;
	lastReviewTime: number;

	worldID: number;
	itemID: number;

	materia: ItemMateria[];

	pricePerUnit: number;
	quantity: number;
	total: number;

	hq: boolean;

	stainID: number | null;

	isCrafted: boolean;

	retainerID: string;

	creatorID: string | null;
	creatorName: string | null;

	onMannequin: boolean;

	sellerID: string;

	retainerCity: number;
	retainerName: string;
}
