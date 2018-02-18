import { Router } from "express";

import { cancelOrder, getOrder, getOrderHistory, OpenOrder, Order, OrderList, submitOrder } from "../services/orders";
import { ErrorHandleRouter as ERouter } from "./router";

const mrouter: ERouter = new ERouter();
export const router: Router = mrouter.router;
/**
 * get an order
 */
mrouter.get("/:order_id", async (req, res, next) => {
	const order: Order = await getOrder("Tkjhds8s9d7fsdf1");
	res.status(200).send(order);
});

/**
 * submit an order
 */
mrouter.post("/:order_id", async (req, res, next) => {
	await submitOrder({});
	res.status(201).send();

});

/**
 * cancel an order
 */
mrouter.delete("/:order_id", async (req, res, next) => {
	await cancelOrder({});
	res.status(204).send();
});

/**
 * get user history
 */
mrouter.get("/", async (req, res, next) => {
	const orderList: OrderList = await getOrderHistory();
	res.status(200).send(orderList);
});
