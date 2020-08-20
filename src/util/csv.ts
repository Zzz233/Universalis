import csvParser from "csv-parse";

// TODO: caching

/** Parse a CSV. */
export async function parseCSV(fileName: string): Promise<string[][]> {
	const table = await this.fetchFile(fileName);

	const parser = csvParser({
		bom: true,
		delimiter: ",",
	});

	const data: Promise<string[][]> = new Promise((resolve) => {
		const output = [];

		parser.write(table);

		parser.on("readable", () => {
			let record: string[] = parser.read();
			while (record) {
				output.push(record);
				record = parser.read();
			}
		});

		parser.on("error", (err) => {
			this.logger.error(err.message);
		});

		parser.once("end", () => {
			resolve(output);
			parser.removeAllListeners();
		});

		parser.end();
	});

	return data;
}
