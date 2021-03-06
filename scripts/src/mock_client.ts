import * as axios from "axios";
import * as uuid4 from "uuid4";
import { Offer, OfferList } from "./services/offers";
import { OpenOrder, Order, OrderList } from "./services/orders";
import { Poll } from "./services/offer_contents";
import { delay } from "./utils";

const BASE = "http://localhost:3000";

class Client {

	public token = "";

	public async register(appId: string, userId: string, walletAddress: string) {
		const res = await axios.default.post(BASE + "/v1/users", {
			sign_in_type: "whitelist",
			user_id: userId,
			device_id: "my_device",
			app_id: appId,
			public_address: walletAddress,
		}, this.getConfig());

		this.token = res.data.token;
	}

	public async getOffers(): Promise<OfferList> {
		const res = await axios.default.get(BASE + "/v1/offers", this.getConfig());
		return res.data as OfferList;
	}

	public async createOrder(offerId: string): Promise<OpenOrder> {
		const res = await axios.default.post(BASE + `/v1/offers/${offerId}/orders`, {}, this.getConfig());
		return res.data as OpenOrder;
	}

	public async submitOrder(orderId: string, content: string): Promise<Order> {
		const res = await axios.default.post(BASE + `/v1/orders/${orderId}`, { content }, this.getConfig());
		return res.data as Order;
	}

	public async getOrder(orderId: string): Promise<Order> {
		const res = await axios.default.get(BASE + `/v1/orders/${orderId}`, this.getConfig());
		return res.data as Order;
	}

	public async getOrders(): Promise<OrderList> {
		const res = await axios.default.get(BASE + "/v1/orders", this.getConfig());
		return res.data as OrderList;
	}

	private getConfig() {
		return {
			headers: {
				"x-request-id": uuid4(),
				"Authorization": `Bearer ${this.token}`,
			},
		};
	}
}

async function main() {
	const c = new Client();
	await c.register("kik", "doody6", "GDNI5XYHLGZMLDNJMX7W67NBD3743AMK7SN5BBNAEYSCBD6WIW763F2H");
	const offers = await c.getOffers();
	let earn: Offer;

	for (const offer of offers.offers) {
		if (offer.offer_type === "earn") {
			earn = offer;
		}
	}

	console.log(`requesting order for offer: ${earn.id}: ${earn.content}`);
	const openOrder = await c.createOrder(earn.id);
	console.log(`got order ${openOrder.id}`);

	// fill in the poll
	console.log("poll " + earn.content);
	const poll: Poll = JSON.parse(earn.content);

	const content = JSON.stringify({ [poll.pages[0].question.id]: poll.pages[0].question.answers[0] });
	console.log("answers " + content);

	await c.submitOrder(openOrder.id, content);

	// poll on order payment
	let order = await c.getOrder(openOrder.id);
	console.log(`completion date: ${order.completion_date}`);
	for (let i = 0; i < 30 && order.status === "pending"; i++) {
		order = await c.getOrder(openOrder.id);
		await delay(1000);
	}
	console.log(`completion date: ${order.completion_date}`);

	if (order.status === "completed") {
		console.log("order completed!");
	} else {
		console.log("order still pending :(");
	}

	console.log(`got order after submit ${JSON.stringify(order, null, 2)}`);
	console.log(`order history ${JSON.stringify((await c.getOrders()).orders.slice(0, 2), null, 2)}`);
}

main().then(() => console.log("done")).catch(err => console.log(`got error ${err.message}:\n${err.stack}`));
