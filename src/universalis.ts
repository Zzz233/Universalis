import { Collection, MongoClient } from "mongodb";

import { Logger, ServerDirectory } from "./service";

import { parseContentID } from "./endpoints/parseContentID";
import { parseHistory } from "./endpoints/parseHistory";
import { parseLeastRecentlyUpdatedItems } from "./endpoints/parseLeastRecentlyUpdatedItems";
import { parseListings } from "./endpoints/parseListings";
import { parseRecentlyUpdatedItems } from "./endpoints/parseRecentlyUpdatedItems";
import { parseTaxRates } from "./endpoints/parseTaxRates";
import { parseUploaderCounts } from "./endpoints/parseUploaderCounts";
import { parseUploadHistory } from "./endpoints/parseUploadHistory";
import { parseWorldUploadCounts } from "./endpoints/parseWorldUploadCounts";
import { serveItemIdJSON } from "./endpoints/serveItemIdJSON";
import { upload } from "./endpoints/upload";

import { parseHighestSaleVelocityItems } from "./endpoints/parseHighestSaleVelocityItems";

// Define application and its resources
const db = MongoClient.connect(process.env["UNIVERSALIS_DB_CONNECTION"], {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

let extendedHistory: Collection;
let recentData: Collection;

const init = (async () => {
	const universalisDB = (await db).db("universalis");
	Logger.log(`Database connected: ${(await db).isConnected()}`);

	extendedHistory = universalisDB.collection("extendedHistory");
	recentData = universalisDB.collection("recentData");

	await ServerDirectory.initialize();

	Logger.log("Connected to database and started data managers.");
})();

// Use single init await
universalis.use(async (_, next) => {
	await init;
	await next();
});

// Documentation page (temporary)
router.get("/docs", async (ctx) => {
	ctx.redirect("/docs/index.html");
});

// REST API
router
	.get("/api/:world/:item", async (ctx) => {
		// Normal data
		await parseListings(ctx, recentData);
	})
	.get("/api/history/:world/:item", async (ctx) => {
		// Extended history
		await parseHistory(ctx);
	})
	.get("/api/tax-rates", async (ctx) => {
		await parseTaxRates(ctx);
	})
	/*.get("/api/transports/eorzea-market-note/:world/:item", async (ctx) => {
        await parseEorzeanMarketNote(ctx, transportManager);
    })*/
	.get("/api/extra/content/:contentID", async (ctx) => {
		await parseContentID(ctx);
	})
	.get("/api/extra/stats/least-recently-updated", async (ctx) => {
		await parseLeastRecentlyUpdatedItems(ctx);
	})
	.get("/api/extra/stats/recently-updated", async (ctx) => {
		await parseRecentlyUpdatedItems(ctx);
	})
	.get("/api/extra/stats/highest-sale-velocity", async (ctx) => {
		// Note: disable this if it uses too much memory on staging.
		await parseHighestSaleVelocityItems(ctx);
	})
	.get("/api/extra/stats/upload-history", async (ctx) => {
		await parseUploadHistory(ctx);
	})
	.get("/api/extra/stats/world-upload-counts", async (ctx) => {
		await parseWorldUploadCounts(ctx);
	})
	.get("/api/extra/stats/uploader-upload-counts", async (ctx) => {
		await parseUploaderCounts(ctx);
	})

	.get("/api/marketable", async (ctx) => {
		// Marketable item ID JSON
		await serveItemIdJSON(ctx);
	});

// Start server
const port = process.argv[2] ? parseInt(process.argv[2]) : 4000;
universalis.listen(port);
Logger.log(`Server started on port ${port}.`);
