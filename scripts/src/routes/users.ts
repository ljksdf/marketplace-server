import { Request, Router } from "express";
import { getOrCreateUserCredentials, activateUser } from "../services/users";
import { getLogger } from "../logging";
import * as db from "../models/users";

export const router: Router = Router();
const logger = getLogger();

// TEST FUNCTION - get a user
router.get("/", async (req, res, next) => {
	const user = await db.User.findOne({ id: req.query.id });
	res.status(200).send({ user });
});

/**
 * sign in a user
 */
router.post("/", async (req, res, next) => {
	const { token, activated } = await getOrCreateUserCredentials(
		req.body.jwt,
		req.body.public_address,
		req.body.device_id);
	res.status(200).send({ token, activated });
});

/**
 * user activates by approving TOS
 */
router.post("/me/activate", async (req: Request & { token: string }, res, next) => {
	const { token, activated } = await activateUser(req.token);
	res.status(200).send({ token, activated });
});
