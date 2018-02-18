import { Request, Router } from "express";
import { getOrCreateUserCredentials, activateUser } from "../services/users";
import { getLogger } from "../logging";
import * as db from "../models/users";
import { ErrorHandleRouter as ERouter } from "./router";

const mrouter: ERouter = new ERouter();
export const router: Router = mrouter.router;

const logger = getLogger();

// TEST FUNCTION - get a user
mrouter.get("/", async (req, res, next) => {
	const user = await db.User.findOne({ id: req.query.id });
	res.status(200).send({ user });
});

// TEST FUNCTION - raise error
mrouter.get("/error", async (req, res, next) => {
	throw new Error("this is an error message");
});

/**
 * sign in a user
 */
mrouter.post("/", async (req, res, next) => {
	const { token, activated } = await getOrCreateUserCredentials(
		req.body.jwt,
		req.body.public_address,
		req.body.device_id);
	res.status(200).send({ token, activated });
});

/**
 * user activates by approving TOS
 */
mrouter.post("/me/activate", async (req: Request & { token: string }, res, next) => {
	const { token, activated } = await activateUser(req.token);
	res.status(200).send({ token, activated });
});
