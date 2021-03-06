import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";

import { CreationDateModel, Model, register as Register } from "./index";
import { IdPrefix } from "../utils";
import { OrderMeta } from "./orders";

export type OfferMeta = {
	title: string;
	image: string;
	description: string;
	order_meta: OrderMeta;
};

export type Cap = {
	total: number;
	used: number;
	per_user: number;
};

export type AssetValue = {
	coupon_code: string;
};

export type OfferType = "spend" | "earn";
export type ContentType = "poll" | "coupon";

@Entity({ name: "offer_owners" })
@Register
export class OfferOwner extends Model {
	@Column()
	public name: string;

	public get offers(): Promise<Offer[]> {
		return Offer.find({ ownerId: this.id });
	}

	public constructor() {
		super();
	}
}

@Entity({ name: "offers" })
@Register
export class Offer extends CreationDateModel {
	@Column()
	public amount: number;

	@Column("simple-json")
	public cap: Cap;

	@Column("simple-json")
	public meta: OfferMeta;

	@Column()
	public type: OfferType;

	@Column({ name: "owner_id" })
	public ownerId: string;

	// @ManyToOne(type => OfferOwner, owner => owner.offers) // XXX requires a generated value
	public get owner(): Promise<OfferOwner> {
		return OfferOwner.findOneById(this.ownerId);
	}

	public constructor() {
		super(IdPrefix.Offer);
	}
}

@Entity({ name: "offer_contents" })
@Register
export class OfferContent extends Model {
	@PrimaryColumn({ name: "offer_id" })
	public offerId: string;

	@Column("simple-json")
	public content: string;

	@Column({ name: "content_type" })
	public contentType: ContentType;

	public constructor() {
		super();
	}
}

@Entity({ name: "app_offers" })
@Register
@Index(["offerId", "appId"], { unique: true })
export class AppOffer extends Model {
	@PrimaryColumn({ name: "offer_id" })
	public offerId: string;

	@PrimaryColumn({ name: "app_id" })
	public appId: string;

	public constructor() {
		super();
	}
}

@Entity({ name: "assets" })
@Register
export class Asset extends CreationDateModel {
	@Column()
	public type: "coupon";

	@Column({ name: "offer_id" })
	public offerId: string;

	@Column({ name: "owner_id", nullable: true })
	public ownerId: string;  // User.id

	@Column("simple-json")
	public value: AssetValue;

	public constructor() {
		super();
	}
}
