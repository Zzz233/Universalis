import * as R from "remeda";

import { materiaIDToValueAndTier } from "../game/materia";
import { ItemMateria } from "../models/ItemMateria";

export function cleanMateriaArray(materiaArray: ItemMateria[]): ItemMateria[] {
	return R.pipe(materiaArray, R.map(cleanMateria), R.compact);
}

function cleanMateria(materiaSlot: ItemMateria): ItemMateria {
	if (!materiaSlot.materiaID && materiaSlot["materiaId"]) {
		materiaSlot.materiaID = materiaSlot["materiaId"];
		delete materiaSlot["materiaId"];
	} else if (!materiaSlot.materiaID) {
		return;
	}

	if (!materiaSlot.slotID && materiaSlot["slotId"]) {
		materiaSlot.slotID = materiaSlot["slotId"];
		delete materiaSlot["slotId"];
	} else if (!materiaSlot.slotID) {
		return;
	}

	const materiaID = parseInt((materiaSlot.materiaID as unknown) as string);
	if (materiaID > 973) {
		const materiaData = materiaIDToValueAndTier(materiaID);
		return {
			materiaID: materiaData.materiaID,
			slotID: materiaData.tier,
		};
	}

	return materiaSlot;
}
