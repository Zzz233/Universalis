/** Calculate the average of some numbers. */
export function calcAverage(...numbers: number[]): number {
	if (numbers.length === 0) return 0;
	let out = 0;
	numbers.forEach((num) => {
		out += num;
	});
	return out / numbers.length;
}

export function calcTrimmedAverage(
	standardDeviation: number,
	...numbers: number[]
): number {
	if (numbers.length === 0) return 0;
	let out = 0;

	const mean = calcAverage(...numbers);

	// I would benchmark this, but benchmarking in JS is a pain
	// Also lol Prettier
	numbers.forEach(
		(num) =>
			(out +=
				num *
				Number(
					num <= mean + 3 * standardDeviation &&
						num >= mean - 3 * standardDeviation,
				)),
	);

	return out / numbers.length;
}

/** Calculate the standard deviation of some numbers. */
export function calcStandardDeviation(...numbers: number[]): number {
	if (numbers.length === 1) return 0;

	const average = calcAverage(...numbers);

	let sumSqr = 0;
	numbers.forEach((num) => {
		sumSqr += Math.pow(num - average, 2);
	});

	return Math.sqrt(sumSqr / (numbers.length - 1));
}
