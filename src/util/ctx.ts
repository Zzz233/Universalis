import { ParameterizedContext } from "koa";
import { ServerDirectory } from "../service";
import { capitalise } from "./strings";

export function tryGetWorldId(ctx: ParameterizedContext): number | null {
	const world: string | number = ctx.queryParams.world ? capitalise(ctx.queryParams.world) : null;
	let worldId: number;

	if (world && !isNaN(parseInt(world))) {
		// World is a string
		worldId = ServerDirectory.getWorldIdByName(world);
	} else if (parseInt(world)) {
		// World is a number
		worldId = parseInt(world);
	}

	return worldId;
}

export function tryGetDcName(ctx: ParameterizedContext): string | null {
	const dcName = ctx.queryParams.dcName
		? ctx.queryParams.dcName.charAt(0).toUpperCase() +
		  ctx.queryParams.dcName.substr(1).toLowerCase()
		: null;
	return dcName;
}

export function tryGetEntriesToReturn(ctx: ParameterizedContext): number | null {
	let entriesToReturn: any = ctx.queryParams.entries;
	if (entriesToReturn) entriesToReturn = parseInt(entriesToReturn.replace(/[^0-9]/g, ""));
	if (isNaN(entriesToReturn)) entriesToReturn = null;
	return entriesToReturn;
}
