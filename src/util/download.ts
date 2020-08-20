import bent from "bent";
import { parseCSV } from "./csv";

const downloadSheet = bent(
	"https://raw.githubusercontent.com/xivapi/ffxiv-datamining/master/csv/",
	"GET",
	"buffer",
);

export async function getSheet(sheetName: string): Promise<string[][]> {
	const rawSheet = await downloadSheet(sheetName);
	const parsedSheet = await parseCSV((rawSheet as Buffer).toString());
	return parsedSheet;
}
