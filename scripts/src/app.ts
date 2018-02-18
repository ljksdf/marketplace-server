import * as express from "express";
import * as bearerToken from "express-bearer-token";

import { getConfig } from "./config";
import { initLogger } from "./logging";
import { init as initModels } from "./models/index";

// make sure that the model files are used, this is only for now because they are not really used
import "./models/users";
import "./models/offers";
import "./models/transactions";

const config = getConfig();
const logger = initLogger(...config.loggers);

// log requestId - in the future will use this to lock the request if needed to
// resolve race conditions of submitting the same request twice
function requestIdMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
	const requestId = req.headers["X-REQUEST-ID"] as string;
	logger.info(`handling request ${requestId}`);
	next();
}

function createApp() {
	const app = express();
	app.set("port", config.port);

	const bodyParser = require("body-parser");
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));

	const cookieParser = require("cookie-parser");
	app.use(cookieParser());
	app.use(bearerToken());
	app.use(requestIdMiddleware);
	return app;
}

export const app: express.Express = createApp();

// routes
app.use("/v1/offers", require("./routes/offers").router);
app.use("/v1/orders", require("./routes/orders").router);
// authentication
app.use("/v1/users", require("./routes/users").router);

// catch 404
app.use((req, res, next) => {
	// log.error(`Error 404 on ${req.url}.`);
	res.status(404).send({ status: 404, error: "Not found" });
});

// catch errors
app.use((err, req, res, next) => {
	logger.error(err.stack);
	const status = err.status || 500;
	// log.error(`Error ${status} (${err.message}) on ${req.method} ${req.url} with payload ${req.body}.`);
	res.status(status).send({ status, error: "Server error" });
});

// initializing db and models
initModels().then(msg => logger.debug(msg));