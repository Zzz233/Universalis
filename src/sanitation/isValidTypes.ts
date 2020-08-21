import { TaxRates } from "../models/TaxRates";
import { TransactionRecord } from "../models/TransactionRecord";
import { ServerDirectory } from "../service";
import { removeUnsafeCharacters } from "./removeUnsafeCharacters";

export function areListingsValid(listings: any[]): boolean {
	for (const listing of listings) {
		if (
			listing.hq == null ||
			!isValidUInt32(listing.pricePerUnit) ||
			!isValidUInt32(listing.quantity) ||
			listing.retainerID == null ||
			listing.retainerCity == null ||
			!isValidName(listing.retainerName) ||
			listing.sellerID == null
		) {
			return false;
		}
	}
	return true;
}

export function areHistoryEntriesValid(entries: TransactionRecord[]): boolean {
	for (const entry of entries) {
		if (
			entry.hq == null ||
			!isValidUInt32(entry.pricePerUnit) ||
			!isValidUInt32(entry.quantity) ||
			!isValidName(entry.buyerName)
		) {
			return false;
		}
	}
	return true;
}

export function isValidName(input: any): boolean {
	if (typeof input !== "string") return false;
	if (input.length > 32) return false;
	if (removeUnsafeCharacters(input) !== input) return false;
	return true;
}

export function areValidTaxRates(rates: TaxRates): boolean {
	if (
		!isValidTaxRate(rates.crystarium) ||
		!isValidTaxRate(rates.gridania) ||
		!isValidTaxRate(rates.ishgard) ||
		!isValidTaxRate(rates.kugane) ||
		!isValidTaxRate(rates.limsaLominsa) ||
		!isValidTaxRate(rates.uldah)
	) {
		return false;
	}
	return true;
}

function isValidTaxRate(input: any): boolean {
	if (typeof input !== "number") return false;
	if (input < 0 || input > 5) return false;
	return true;
}

function isValidUInt32(input: any): boolean {
	if (typeof input !== "number") return false;
	if (input < 0 || input > 4294967295) return false;
	return true;
}

export function isValidWorld(input: any): boolean {
	if (typeof input !== "number") return false;
	return ServerDirectory.getWorldNameById(input) != null;
}
