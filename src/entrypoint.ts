import { App } from "./App";
import { Database } from "./db";
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
import { serveItemIdJson } from "./endpoints/serveItemIdJson";
import { upload } from "./endpoints/upload";

import { parseHighestSaleVelocityItems } from "./endpoints/parseHighestSaleVelocityItems";

const universalis = new App();

(async () => {
	await universalis.initialize();
	await ServerDirectory.initialize();
	await Database.initialize();

	universalis.setRouting((router) => {
		// Documentation page (temporary)
		router.get("/docs", async (ctx) => {
			ctx.redirect("/docs/index.html");
		});

		// REST API
		router
			.get("/api/:world/:item", parseListings)
			.get("/api/history/:world/:item", parseHistory)
			.get("/api/tax-rates", parseTaxRates)
			.get("/api/extra/content/:contentID", parseContentID)
			.get("/api/extra/stats/least-recently-updated", parseLeastRecentlyUpdatedItems)
			.get("/api/extra/stats/recently-updated", parseRecentlyUpdatedItems)
			.get("/api/extra/stats/highest-sale-velocity", parseHighestSaleVelocityItems)
			.get("/api/extra/stats/upload-history", parseUploadHistory)
			.get("/api/extra/stats/world-upload-counts", parseWorldUploadCounts)
			.get("/api/extra/stats/uploader-upload-counts", parseUploaderCounts)
			.get("/api/marketable", serveItemIdJson)
			.post("/upload/:apiKey", upload)
			.post("/upload", upload);
	});

	const port = process.argv[2] ? parseInt(process.argv[2]) : 4000;
	universalis.start(port);
	Logger.log(`Server started on port ${port}.`);
})();
