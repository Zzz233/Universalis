import { DC_WORLDS, WORLD_ALIASES } from "../data";
import { World } from "../models/World";
import { getSheet } from "../util";

export class ServerDirectory {
	public static getWorldIdByName(name: string): number {
		if (name == null) return null;
		return ServerDirectory.instance().worlds.find((world) => world.name === name).id;
	}

	public static getWorldNameById(id: number): string {
		if (id == null) return null;
		return ServerDirectory.instance()
			.worlds.filter((world) => !world.isAlias)
			.find((world) => world.id === id).name;
	}

	public static getDataCenterForWorldId(worldId: number): string {
		const worldName = this.getWorldNameById(worldId);
		for (const dc in DC_WORLDS) {
			if (DC_WORLDS.hasOwnProperty(dc)) {
				for (const world of DC_WORLDS[dc] as string[]) {
					if (world === worldName) {
						return dc;
					}
				}
			}
		}
		return null;
	}

	public static getDataCenterForWorldName(worldName: string): string {
		for (const dc in DC_WORLDS) {
			if (DC_WORLDS.hasOwnProperty(dc)) {
				for (const world of DC_WORLDS[dc] as string[]) {
					if (world === worldName) {
						return dc;
					}
				}
			}
		}
		return null;
	}

	public static async initialize(): Promise<void> {
		let worldSheet = await getSheet("World.csv");
		worldSheet = worldSheet.slice(3);

		const lxnWorlds = DC_WORLDS.LuXingNiao;
		const mglWorlds = DC_WORLDS.MoGuLi;
		const mxpWorlds = DC_WORLDS.MaoXiaoPang;

		for (const row of worldSheet) {
			const worldName = row[1];
			const worldIsPublic = row[4] === "True";

			if (
				worldName === "Chaos" || // Chaos (world) is public for some reason
				(!worldIsPublic &&
					!lxnWorlds.includes(worldName) &&
					!mglWorlds.includes(worldName) &&
					!mxpWorlds.includes(worldName))
			)
				continue;

			ServerDirectory.instance().worlds.push({
				id: parseInt(row[0]),
				name: worldName,
				isAlias: false,
				userType: parseInt(row[2]),
				dataCenter: parseInt(row[3]),
				isPublic: worldIsPublic,
			});
		}

		ServerDirectory.instance().addAliasesFromData();
	}

	private static sInstance: ServerDirectory;
	private static instance(): ServerDirectory {
		if (!ServerDirectory.sInstance) {
			ServerDirectory.sInstance = new ServerDirectory();
		}
		return ServerDirectory.sInstance;
	}

	private worlds: World[];

	private constructor() {
		this.worlds = [];
	}

	private addAliasesFromData() {
		for (const world in WORLD_ALIASES) {
			if (WORLD_ALIASES.hasOwnProperty(world)) {
				for (const name of WORLD_ALIASES[world].names) {
					this.addAlias(WORLD_ALIASES[world].id, name);
				}
			}
		}
	}

	private addAlias(id: number, name: string) {
		const existing = this.worlds.find((world) => world.id === id);
		const copy = Object.assign({}, existing);
		copy.name = name;
		copy.isAlias = true;
		this.worlds.push(copy);
	}
}
