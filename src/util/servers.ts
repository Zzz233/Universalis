import { ParameterizedContext } from "koa";

export function appendWorldDC(
	obj: any,
	worldMap: Map<string, number>,
	ctx: ParameterizedContext,
): void {
	// Convert worldDC strings (numbers or names) to world IDs or DC names
	if (ctx.params && ctx.params.world) {
		const worldName =
			ctx.params.world.charAt(0).toUpperCase() + ctx.params.world.substr(1);
		if (!parseInt(ctx.params.world) && !worldMap.get(worldName)) {
			ctx.params.dcName = ctx.params.world;
		} else {
			if (parseInt(ctx.params.world)) {
				ctx.params.worldID = parseInt(ctx.params.world);
			} else {
				ctx.params.worldID = worldMap.get(worldName);
			}
		}
	}

	if (ctx.params.worldID) {
		obj["worldID"] = ctx.params.worldID;
	} else {
		if (ctx.params.dcName === "LuXingNiao") ctx.params.dcName = "陆行鸟"; // Little messy, but eh?
		if (ctx.params.dcName === "MoGuLi") ctx.params.dcName = "莫古力";
		if (ctx.params.dcName === "MaoXiaoPang") ctx.params.dcName = "猫小胖";
		obj["dcName"] = ctx.params.dcName;
	}
}
