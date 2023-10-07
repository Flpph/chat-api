"use strict";
const { User, UserToken } = require("../models/index");
const DbMixin = require("../mixins/db.mixin");
const SqlAdapter = require("moleculer-db-adapter-sequelize");
const { sequelize } = require("../models/baseModel");
const bcrypt = require("bcrypt");
const moment = require("moment");
const hat = require("hat");
const { TOKEN_EXPIRATION_IN_HOURS } = require("../models/enums");
const { Op } = require("sequelize");
const { MoleculerClientError } = require("moleculer").Errors;

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/** @type {ServiceSchema} */
module.exports = {
	name: "users",
	model: User,
	mixins: [DbMixin("users")],
	adapter: new SqlAdapter(process.env.POSTGRES_URI),
	/**
	 * Settings
	 */
	settings: {
		fields: [
			"id",
			"email",
			"name",
			"displayName",
			"is_verified",
			"created_at",
			"updated_at",
		],
	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
		list: false,
		get: false,
		find: false,
		count: false,
		create: false,
		insert: false,
		update: false,
		remove: false,
		register: {
			rest: "POST /register",
			auth: false,
			params: {
				email: "email",
				password: "string|min:6",
				name: {
					type: "string",
					pattern:
						/^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/,
				},
			},
			async handler(ctx) {
				const { email, password, name } = ctx.params;

				const existingUser = await User.findOne({
					where: {
						[Op.or]: [{ email }, { name }],
					},
				});
				if (existingUser) {
					throw new MoleculerClientError(
						"USER_ALREADY_EXISTS",
						400,
						"CONFLICT"
					);
				}

				const user = {
					email,
					name,
					displayName: name,
					password: this.hashPassword(password),
				};

				// Transaction, if we need to write into multiple tables later
				const { createdUser, authToken } = await sequelize.transaction(
					async (transaction) => {
						const createdUser = await User.create(user, {
							transaction,
						});

						const authToken = await ctx.call("users.addToken", {
							userId: createdUser.id,
						});

						return {
							createdUser,
							authToken,
						};
					}
				);

				return {
					createdUser: await this.transformDocuments(
						ctx,
						{},
						createdUser
					),
					authToken,
				};
			},
		},

		login: {
			rest: "POST /login",
			auth: false,
			params: {
				username: "string",
				password: "string",
			},
			async handler(ctx) {
				const { username, password } = ctx.params;

				const user = await User.findOne({
					where: {
						[Op.or]: [{ email: username }, { name: username }],
					},
				});

				if (
					!user ||
					!(await this.comparePasswords(password, user.password))
				) {
					throw new MoleculerClientError(
						"NO_USER_FOUND",
						404,
						"NOT_FOUND"
					);
				}

				const authToken = await ctx.call("users.addToken", {
					userId: user.id,
				});

				return {
					user: await this.transformDocuments(ctx, {}, user),
					authToken,
				};
			},
		},

		me: {
			rest: "GET /me",
			auth: true,
			async handler(ctx) {
				return {
					user: await this.transformDocuments(ctx, {}, ctx.meta.user),
				};
			},
		},

		addToken: {
			params: {
				userId: { type: "string" },
			},
			async handler(ctx) {
				const { userId } = ctx.params;

				const hash = hat();
				await UserToken.create({
					user_id: userId,
					auth_token: hash,
					expiration: this.getTokenExpirationDate(),
				});

				return hash;
			},
		},

		findByAuthToken: {
			params: {
				authToken: "string",
			},
			async handler(ctx) {
				const userQuery = {
					attributes: { exclude: ["password"] },
					include: [
						{
							model: UserToken,
							as: "auth_tokens",
							require: false,
							attributes: ["auth_token", "expiration"],
							where: {
								auth_token: ctx.params.authToken,
							},
						},
					],
				};

				const user = await User.findOne(userQuery);

				if (!user) throw new MoleculerClientError("UNAUTHORIZED", 401);

				return user;
			},
		},
	},

	/**
	 * Events
	 */
	events: {},

	/**
	 * Methods
	 */
	methods: {
		hashPassword(password) {
			return bcrypt.hashSync(password, 10);
		},

		getTokenExpirationDate() {
			return moment().add(TOKEN_EXPIRATION_IN_HOURS, "hours");
		},

		async comparePasswords(password, hash) {
			return await bcrypt.compare(password, hash);
		},
	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {},
};
