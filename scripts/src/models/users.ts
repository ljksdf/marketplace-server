import { Column, Entity } from "typeorm";

import { CreationDateModel, register as Register } from "./index";
import { IdPrefix } from "../utils";
import * as moment from "moment";

@Entity({ name: "users" })
@Register
export class User extends CreationDateModel {
	@Column({ name: "app_id" })
	public appId: string;

	@Column({ name: "app_user_id" })
	public appUserId: string;

	@Column({ name: "wallet_address" })
	public walletAddress: string;

	@Column({ name: "activated_date", nullable: true })
	public activatedDate: Date;

	constructor();
	constructor(appUserId: string, appId: string, walletAddress: string);
	constructor(appUserId?: string, appId?: string, walletAddress?: string) {
		super(IdPrefix.User);
		Object.assign(this, { appUserId, appId, walletAddress });
	}

	public get activated(): boolean {
		return !!this.activatedDate;
	}
}

@Entity({ name: "auth_tokens" })
@Register
export class AuthToken extends CreationDateModel {
	@Column({ name: "expire_date" })
	public expireDate: Date;

	@Column({ name: "device_id" })
	public deviceId: string;

	@Column({ name: "user_id" })
	public userId: string;

	@Column()
	public valid: boolean;

	constructor();
	constructor(userId: string, deviceId: string, valid: boolean);
	constructor(userId?: string, deviceId?: string, valid?: boolean) {
		super(IdPrefix.None); // the id is the actual token
		const expireDate = moment().add(14, "days").toDate();

		// XXX token could be a JWT
		Object.assign(this, { expireDate, userId, deviceId, valid });
	}

	public isExpired(): boolean {
		return new Date() > this.expireDate;
	}

	public isAboutToExpire(): boolean {
		// 6 hours left
		return moment().add(6, "hours").toDate() > this.expireDate;
	}
}

@Entity({ name: "applications" })
@Register
export class Application extends CreationDateModel {
	@Column({ name: "name" })
	public name: string;

	@Column({ name: "jwt_public_key" })
	public jwtPublicKey: string;

	constructor();
	constructor(name: string, jwtPublicKey: string);
	constructor(name?: string, jwtPublicKey?: string) {
		super(IdPrefix.App);
		Object.assign(this, { name, jwtPublicKey });
	}
}
