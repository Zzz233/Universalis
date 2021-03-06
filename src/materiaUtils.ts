const data = require("../public/json/materia.json");

export function materiaIDToValueAndTier(
	materiaID: number,
): { materiaID: number; tier: number } {
	const materiaIDAsString = "" + materiaID;
	for (const row of data) {
		if (row.includes(materiaIDAsString)) {
			return {
				materiaID: parseInt(row[0]),
				tier: parseInt(data[0][row.indexOf(materiaIDAsString)]),
			};
		}
	}
	return {
		materiaID: null,
		tier: null,
	};
}

export async function materiaValueToItemID(
	materiaValue: number,
): Promise<number> {
	const materiaData = await this.materiaValueToMateriaData(materiaValue);
	return data[materiaData.materiaID + 3][materiaData.tier + 1];
}

export async function materiaValueToItemName(
	materiaValue: number,
): Promise<string> {
	const itemID = await this.materiaValueToItemID(materiaValue);
	return this.materiaIDList[itemID];
}

// https://discordapp.com/channels/192333432481775627/266296762690568192/611403811881222145
// tyvm Adam
export async function materiaValueToMateriaData(materiaValue: number) {
	const materiaData: {
		materiaValue: number;
		materiaID?: number;
		tier?: number;
		leftover?: number;
	} = {
		materiaValue,
	};

	materiaData.materiaID = (materiaValue & 0xff0) >> 4;
	materiaData.tier = materiaValue & 0xf;
	materiaData.leftover = materiaValue >> 8;

	return materiaData;
}

// https://github.com/xivapi/ffxiv-datamining/blob/master/csv/Materia.csv
export const materiaIDList = {
	5604: "Strength Materia I",
	5605: "Strength Materia II",
	5606: "Strength Materia III",
	5607: "Strength Materia IV",
	5608: "Strength Materia V",
	5609: "Vitality Materia I",
	5610: "Vitality Materia II",
	5611: "Vitality Materia III",
	5612: "Vitality Materia IV",
	5613: "Vitality Materia V",
	5614: "Dexterity Materia I",
	5615: "Dexterity Materia II",
	5616: "Dexterity Materia III",
	5617: "Dexterity Materia IV",
	5618: "Dexterity Materia V",
	5619: "Intelligence Materia I",
	5620: "Intelligence Materia II",
	5621: "Intelligence Materia III",
	5622: "Intelligence Materia IV",
	5623: "Intelligence Materia V",
	5624: "Mind Materia I",
	5625: "Mind Materia II",
	5626: "Mind Materia III",
	5627: "Mind Materia IV",
	5628: "Mind Materia V",
	5629: "Piety Materia I",
	5630: "Piety Materia II",
	5631: "Piety Materia III",
	5632: "Piety Materia IV",
	5633: "Piety Materia V",
	5634: "Fire Materia I",
	5635: "Fire Materia II",
	5636: "Fire Materia III",
	5637: "Fire Materia IV",
	5638: "Fire Materia V",
	5639: "Ice Materia I",
	5640: "Ice Materia II",
	5641: "Ice Materia III",
	5642: "Ice Materia IV",
	5643: "Ice Materia V",
	5644: "Wind Materia I",
	5645: "Wind Materia II",
	5646: "Wind Materia III",
	5647: "Wind Materia IV",
	5648: "Wind Materia V",
	5649: "Earth Materia I",
	5650: "Earth Materia II",
	5651: "Earth Materia III",
	5652: "Earth Materia IV",
	5653: "Earth Materia V",
	5654: "Lightning Materia I",
	5655: "Lightning Materia II",
	5656: "Lightning Materia III",
	5657: "Lightning Materia IV",
	5658: "Lightning Materia V",
	5659: "Water Materia I",
	5660: "Water Materia II",
	5661: "Water Materia III",
	5662: "Water Materia IV",
	5663: "Water Materia V",
	5664: "Heaven's Eye Materia I",
	5665: "Heaven's Eye Materia II",
	5666: "Heaven's Eye Materia III",
	5667: "Heaven's Eye Materia IV",
	5668: "Heaven's Eye Materia V",
	5669: "Savage Aim Materia I",
	5670: "Savage Aim Materia II",
	5671: "Savage Aim Materia III",
	5672: "Savage Aim Materia IV",
	5673: "Savage Aim Materia V",
	5674: "Savage Might Materia I",
	5675: "Savage Might Materia II",
	5676: "Savage Might Materia III",
	5677: "Savage Might Materia IV",
	5678: "Savage Might Materia V",
	5679: "Battledance Materia I",
	5680: "Battledance Materia II",
	5681: "Battledance Materia III",
	5682: "Battledance Materia IV",
	5683: "Battledance Materia V",
	5684: "Gatherer's Guerdon Materia I",
	5685: "Gatherer's Guerdon Materia II",
	5686: "Gatherer's Guerdon Materia III",
	5687: "Gatherer's Guerdon Materia IV",
	5688: "Gatherer's Guerdon Materia V",
	5689: "Gatherer's Guile Materia I",
	5690: "Gatherer's Guile Materia II",
	5691: "Gatherer's Guile Materia III",
	5692: "Gatherer's Guile Materia IV",
	5693: "Gatherer's Guile Materia V",
	5694: "Gatherer's Grasp Materia I",
	5695: "Gatherer's Grasp Materia II",
	5696: "Gatherer's Grasp Materia III",
	5697: "Gatherer's Grasp Materia IV",
	5698: "Gatherer's Grasp Materia V",
	5699: "Craftman's Competence Materia I",
	5700: "Craftman's Competence Materia II",
	5701: "Craftman's Competence Materia III",
	5702: "Craftman's Competence Materia IV",
	5703: "Craftman's Competence Materia V",
	5704: "Craftman's Cunning Materia I",
	5705: "Craftman's Cunning Materia II",
	5706: "Craftman's Cunning Materia III",
	5707: "Craftman's Cunning Materia IV",
	5708: "Craftman's Cunning Materia V",
	5709: "Craftman's Command Materia I",
	5710: "Craftman's Command Materia II",
	5711: "Craftman's Command Materia III",
	5712: "Craftman's Command Materia IV",
	5713: "Craftman's Command Materia V",
	5714: "Quickarm Materia I",
	5715: "Quickarm Materia II",
	5716: "Quickarm Materia III",
	5717: "Quickarm Materia IV",
	5718: "Quickarm Materia V",
	5719: "Quicktongue Materia I",
	5720: "Quicktongue Materia II",
	5721: "Quicktongue Materia III",
	5722: "Quicktongue Materia IV",
	5723: "Quicktongue Materia V",
	5724: "Cracked Materia I",
	5725: "Cracked Materia II",
	5726: "Cracked Materia III",
	5727: "Cracked Materia IV",
	6937: "Cactuar Foot Materia I",
	6939: "Coeurl Eye Materia I",
	6940: "Aurelia Kiss Materia I",
	6941: "Bison Hoof Materia I",
	6942: "Funguar Shriek Materia I",
	6943: "Treant Root Materia I",
	6944: "Chocobo Down Materia I",
	18006: "Strength Materia VI",
	18007: "Vitality Materia VI",
	18008: "Dexterity Materia VI",
	18009: "Intelligence Materia VI",
	18010: "Mind Materia VI",
	18011: "Piety Materia VI",
	18012: "Fire Materia VI",
	18013: "Ice Materia VI",
	18014: "Wind Materia VI",
	18015: "Earth Materia VI",
	18016: "Lightning Materia VI",
	18017: "Water Materia VI",
	18018: "Heaven's Eye Materia VI",
	18019: "Savage Aim Materia VI",
	18020: "Savage Might Materia VI",
	18021: "Battledance Materia VI",
	18022: "Gatherer's Guerdon Materia VI",
	18023: "Gatherer's Guile Materia VI",
	18024: "Gatherer's Grasp Materia VI",
	18025: "Craftman's Competence Materia VI",
	18026: "Craftman's Cunning Materia VI",
	18027: "Craftman's Command Materia VI",
	18028: "Quickarm Materia VI",
	18029: "Quicktongue Materia VI",
	25186: "Piety Materia VII",
	25187: "Heaven's Eye Materia VII",
	25188: "Savage Aim Materia VII",
	25189: "Savage Might Materia VII",
	25190: "Battledance Materia VII",
	25191: "Gatherer's Guerdon Materia VII",
	25192: "Gatherer's Guile Materia VII",
	25193: "Gatherer's Grasp Materia VII",
	25194: "Craftman's Competence Materia VII",
	25195: "Craftman's Cunning Materia VII",
	25196: "Craftman's Command Materia VII",
	25197: "Quickarm Materia VII",
	25198: "Quicktongue Materia VII",
	26727: "Piety Materia VIII",
	26728: "Heaven's Eye Materia VIII",
	26729: "Savage Aim Materia VIII",
	26730: "Savage Might Materia VIII",
	26731: "Battledance Materia VIII",
	26732: "Gatherer's Guerdon Materia VIII",
	26733: "Gatherer's Guile Materia VIII",
	26734: "Gatherer's Grasp Materia VIII",
	26735: "Craftman's Competence Materia VIII",
	26736: "Craftman's Cunning Materia VIII",
	26737: "Craftman's Command Materia VIII",
	26738: "Quickarm Materia VIII",
	26739: "Quicktongue Materia VIII",
};
