import beep from "beepbeep";
import fs from "fs";
import path from "path";
import util from "util";

import { Logger } from "../service";

const exists = util.promisify(fs.exists);
const mkdir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);

export async function exportObject(obj: any) {
	const outDir = path.join(__dirname, "..", "badUploads");
	if (!(await exists(outDir))) {
		await mkdir(outDir);
	}

	const outFile = path.join(outDir, `${obj.itemID}.json`); // sloppy but eh
	if (!(await exists(outFile))) {
		await writeFile(outFile, JSON.stringify(obj));
	}

	Logger.log(`Wrote out ${obj.itemID}.json. Please examine the contents of this file.`);
	beep(2);
}
