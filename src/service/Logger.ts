import winston, { Logger as WinstonLogger } from "winston";

require("winston-mongodb"); // Applies itself to the winston.transports namespace

export class Logger {
	public static log(message: string) {
		Logger.instance().logger.info(message);
	}

	public static warn(message: string) {
		Logger.instance().logger.warn(message);
	}

	public static error(message: string) {
		Logger.instance().logger.error(message);
	}
	private static sInstance: Logger;
	private static instance(): Logger {
		if (!Logger.sInstance) {
			Logger.sInstance = new Logger(process.env["UNIVERSALIS_DB_CONNECTION"]);
		}
		return Logger.sInstance;
	}

	private logger: WinstonLogger;

	private constructor(dbConnection: string) {
		this.logger = winston.createLogger({
			transports: [
				new winston.transports["MongoDB"]({
					capped: true,
					cappedMax: 10000,
					db: dbConnection,
					options: { useNewUrlParser: true, useUnifiedTopology: true },
				}),
				new winston.transports.File({
					filename: "logs/error.log",
					level: "error",
				}),
				new winston.transports.Console({
					format: winston.format.simple(),
				}),
			],
		});
	}
}
