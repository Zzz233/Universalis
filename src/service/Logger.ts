import winston, { Logger as WinstonLogger } from "winston";

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
			Logger.sInstance = new Logger();
		}
		return Logger.sInstance;
	}

	private logger: WinstonLogger;

	private constructor() {
		// Also gets logged to files via PM2 on our setup
		this.logger = winston.createLogger({
			transports: [
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
