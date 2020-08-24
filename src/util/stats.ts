import { calcStandardDeviation, calcTrimmedAverage } from ".";
import { AveragePrices } from "../models/AveragePrices";
import { MinimizedTransactionRecord } from "../models/MinimizedTransactionRecord";
import { SaleVelocitySeries } from "../models/SaleVelocitySeries";
import { StackSizeHistograms } from "../models/StackSizeHistograms";

export function calculateSaleVelocities(
	regularSeries: MinimizedTransactionRecord[],
	nqSeries: MinimizedTransactionRecord[],
	hqSeries: MinimizedTransactionRecord[],
): SaleVelocitySeries {
	// Per day
	const regularSaleVelocity = calcSaleVelocity(...regularSeries.map((entry) => entry.timestamp));
	const nqSaleVelocity = calcSaleVelocity(...nqSeries.map((entry) => entry.timestamp));
	const hqSaleVelocity = calcSaleVelocity(...hqSeries.map((entry) => entry.timestamp));
	return {
		regularSaleVelocity,
		nqSaleVelocity,
		hqSaleVelocity,
	};
}

export function calculateAveragePrices(
	regularSeries: MinimizedTransactionRecord[],
	nqSeries: MinimizedTransactionRecord[],
	hqSeries: MinimizedTransactionRecord[],
): AveragePrices {
	const ppu = regularSeries.map((entry) => entry.pricePerUnit);
	const nqPpu = nqSeries.map((entry) => entry.pricePerUnit);
	const hqPpu = hqSeries.map((entry) => entry.pricePerUnit);
	const averagePrice = calcTrimmedAverage(calcStandardDeviation(...ppu), ...ppu);
	const averagePriceNQ = calcTrimmedAverage(calcStandardDeviation(...nqPpu), ...nqPpu);
	const averagePriceHQ = calcTrimmedAverage(calcStandardDeviation(...hqPpu), ...hqPpu);
	return {
		averagePrice,
		averagePriceNQ,
		averagePriceHQ,
	};
}

export function makeStackSizeHistograms(
	regularSeries: MinimizedTransactionRecord[],
	nqSeries: MinimizedTransactionRecord[],
	hqSeries: MinimizedTransactionRecord[],
): StackSizeHistograms {
	const stackSizeHistogram = makeDistrTable(...regularSeries.map((entry) => entry.quantity));
	const stackSizeHistogramNQ = makeDistrTable(...nqSeries.map((entry) => entry.quantity));
	const stackSizeHistogramHQ = makeDistrTable(...hqSeries.map((entry) => entry.quantity));
	return {
		stackSizeHistogram,
		stackSizeHistogramNQ,
		stackSizeHistogramHQ,
	};
}

/** Calculate the rate at which items have been selling per day over the past week. */
export function calcSaleVelocity(...timestamps: number[]): number {
	const thisWeek = timestamps.filter((timestamp) => timestamp * 1000 >= Date.now() - 604800000);

	return thisWeek.length / 7;
}

/** Create a distribution table of some numbers. */
export function makeDistrTable(...numbers: number[]): { [key: number]: number } {
	const table: { [key: number]: number } = {};
	for (const num of numbers) {
		if (!table[num]) {
			table[num] = 1;
		} else {
			++table[num];
		}
	}
	return table;
}
