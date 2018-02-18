import { ConnectionOptions } from "typeorm";

import { LogTarget } from "./logging";

import * as path from "path";

export interface Config {
	port?: number;
	loggers?: LogTarget[];
	assets_base: string;
	db: ConnectionOptions;
}

export function getConfig(name: string = "default"): Config {
	return require(`../../config/${ name }.json`);
}
