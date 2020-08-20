/** Calculate the rate at which items have been selling per day over the past week. */
export function calcSaleVelocity(...timestamps: number[]): number {
	const thisWeek = timestamps.filter(
		(timestamp) => timestamp * 1000 >= Date.now() - 604800000,
	);

	return thisWeek.length / 7;
}

/** Create a distribution table of some numbers. */
export function makeDistrTable(
	...numbers: number[]
): { [key: number]: number } {
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
