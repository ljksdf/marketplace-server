import { app } from "./app";
import * as http from "http";
import { getConfig } from "./config";
import { initLogger } from "./logging";

const config = getConfig();
const logger = initLogger(...config.loggers);

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
	if (error.syscall !== "listen") {
		throw error;
	}

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case "EACCES":
			logger.error(`${ config.port } requires elevated privileges`);
			process.exit(1);
			break;
		case "EADDRINUSE":
			logger.error(`${ config.port } is already in use`);
			process.exit(1);
			break;
		default:
			throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
	const addr = server.address();
	logger.debug(`Listening on ${ addr.port }`);
}

const server = http.createServer(app);
server.listen(config.port);
server.on("error", onError);
server.on("listening", onListening);