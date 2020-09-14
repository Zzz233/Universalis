import winston from "winston";

export class Logger {
	public static log(message: string) {
		Logger.logger.info(message);
	}

	public static warn(message: string) {
		Logger.logger.warn(message);
	}

	public static error(message: string) {
		Logger.logger.error(message);
	}

	private static logger = winston.createLogger({
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
