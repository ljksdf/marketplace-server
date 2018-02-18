import { init as initModels } from "../models";

process.env.NODE_ENV = "test";
import { app } from "../../src/app";
import * as request from "supertest";
//
// beforeAll(() => {
// 	const p = new Promise((resolve: any) => {
// 		app.on("initModels", () => {
// 			console.log("finished lior2");
// 			resolve();
// 		});
// 	});
// 	return p;
// })
// ;

describe("api tests for /users", async () => {

	it("return a user with 200", async () => {
		// await initModels();
		return request(app)
			.get("/v1/users?id=1234")
			.set("x-request-id", "123")
			.expect(200);
	});

	it("should return 404", () => {
		return request(app).get("/v1/no_such_page").expect(404);
	});
});
