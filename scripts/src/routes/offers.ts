import { Router } from "express";

import { getOffers, OfferList } from "../services/offers";
import { createOrder, OpenOrder } from "../services/orders";
import { ErrorHandleRouter as ERouter } from "./router";

const mrouter: ERouter = new ERouter();
export const router: Router = mrouter.router;

/**
 * Return a list of offers
 */
mrouter.get("/", async (req, res, next) => {
	const data: OfferList = await getOffers({});
	res.status(200).send(data);
});

/**
 * create an order for an offer
 */
mrouter.post("/:offer_id/orders", async (req, res, next) => {
	const order: OpenOrder = await createOrder(req.params.offer_id);
	res.status(201).send(order);
});
