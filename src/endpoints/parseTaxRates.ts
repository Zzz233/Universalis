/**
 * @name Tax Rates
 * @url /api/tax-rates
 * @param world string | number The world to retrieve data from.
 * @returns Crystarium number The Crystarium's current tax rate.
 * @returns Gridania number Gridania's current tax rate.
 * @returns Ishgard number Ishgard's current tax rate.
 * @returns Kugane number Kugane's current tax rate.
 * @returns Limsa_Lominsa number Limsa Lominsa's current tax rate (the property name has a space in place of the underscore).
 * @returns Ul'dah number Ul'dah's current tax rate.
 */

import { ParameterizedContext } from "koa";

import { HTTP_STATUS } from "../data";
import { Database } from "../db";
import { TaxRates } from "../models/TaxRates";
import { tryGetWorldId } from "../util";

export async function parseTaxRates(ctx: ParameterizedContext) {
	const worldId = tryGetWorldId(ctx);
	if (worldId == null) {
		ctx.throw(HTTP_STATUS.NOT_FOUND, "Invalid World");
	}

	const collection = await Database.collection<TaxRates>("TaxRates");
	const taxRates = await collection.document(`${worldId}`);

	if (!taxRates) {
		ctx.body = {
			Crystarium: null,
			Gridania: null,
			Ishgard: null,
			Kugane: null,
			"Limsa Lominsa": null,
			"Ul'dah": null,
		};
	} else {
		ctx.body = {
			Crystarium: taxRates.crystarium,
			Gridania: taxRates.gridania,
			Ishgard: taxRates.ishgard,
			Kugane: taxRates.kugane,
			"Limsa Lominsa": taxRates.limsaLominsa,
			"Ul'dah": taxRates.uldah,
		};
	}
}
