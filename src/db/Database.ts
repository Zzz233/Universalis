import { Database as ArangoDB, DocumentCollection } from "arangojs";
import { Logger } from "../service";

export class Database {
	public static async initialize() {
		await new Promise((resolve) =>
			Database.instance()
				.db.createDatabase("universalis")
				.then(() => Logger.log("Connected to database."))
				.then(resolve)
				.catch(Logger.error),
		);
		Database.instance().db.useDatabase("universalis");
	}

	public static async collection<TDocument extends object = any>(
		name: string,
	): Promise<DocumentCollection<TDocument>> {
		const collection = Database.instance().db.collection(name);
		if (!(await collection.exists())) {
			await new Promise((resolve) =>
				collection
					.create()
					.then(() => Logger.log(`Created collection ${name}.`))
					.then(resolve)
					.catch(Logger.error),
			);
		}
		return collection;
	}

	private static sInstance: Database;
	private static instance() {
		if (!Database.sInstance) {
			Database.sInstance = new Database();
		}
		return Database.sInstance;
	}

	private db: ArangoDB;

	private constructor() {
		this.db = new ArangoDB(process.env["UNIVERSALIS_DB_CONNECTION"]);
	}
}
