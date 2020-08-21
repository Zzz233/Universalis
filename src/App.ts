import cors from "@koa/cors";
import Router from "@koa/router";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import queryParams from "koa-queryparams";
import serve from "koa-static";
import { Logger } from "./service";

export class App {
	private framework: Koa;
	private router: Router;

	constructor() {
		this.framework = new Koa();
		this.router = new Router();
	}

	public async initialize() {
		this.initBasicMiddleware();
	}

	public start(port: number) {
		this.framework.listen(port);
		Logger.log(`Server started on port ${port}.`);
	}

	public setRouting(initializer: (router: Router) => void) {
		initializer(this.router);
		this.framework.use(this.router.routes());
	}

	private initBasicMiddleware() {
		this.framework.use(cors());
		this.framework.use(
			bodyParser({
				enableTypes: ["json"],
				jsonLimit: "3mb",
			}),
		);
		this.framework.use(queryParams());

		this.framework.use(async (ctx, next) => {
			if (!ctx.url.includes("upload")) {
				Logger.log(`${ctx.method} ${ctx.url}`);
			}
			await next();
		});

		this.framework.use(serve("./public"));
	}
}
