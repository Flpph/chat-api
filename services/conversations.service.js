"use strict";
const {
	Conversation,
	UserConversation,
	User,
	Message,
} = require("../models/index");
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
	name: "conversations",
	model: Conversation,
	mixins: [DbMixin("conversations")],
	adapter: new SqlAdapter(process.env.POSTGRES_URI),
	/**
	 * Settings
	 */
	settings: {},

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
		insert: false,
		update: false,
		remove: false,

		create: {
			rest: "POST /create",
			auth: true,
			params: {
				type: {
					type: "enum",
					values: ["direct", "channel"],
				},
				target_user_ids: { type: "array", items: "uuid" },
				name: {
					type: "string",
					optional: true,
					empty: true,
				},
			},
			async handler(ctx) {
				const { type, target_user_ids, name } = ctx.params;

				let conversation = null;

				await sequelize.transaction(async (transaction) => {
					conversation = await Conversation.create(
						{
							type,
							name,
							creator_id: ctx.meta.user.id,
						},
						{ transaction }
					);

					const targetUsers = [
						{
							user_id: ctx.meta.user.id,
							conversation_id: conversation.id,
						},
					];

					for (const target of target_user_ids) {
						targetUsers.push({
							user_id: target,
							conversation_id: conversation.id,
						});
					}

					await UserConversation.bulkCreate(targetUsers, {
						transaction,
					});
				});

				return conversation;
			},
		},

		getUserConversations: {
			rest: "GET /",
			auth: true,
			async handler(ctx) {
				const userConversations = await UserConversation.findAll({
					where: { user_id: ctx.meta.user.id },
				});

				const conversations = await Conversation.findAll({
					include: [
						{
							model: User,
							as: "users",
							attributes: ["id", "name", "displayName"],
							through: {
								attributes: [],
							},
							where: {
								id: { [Op.ne]: ctx.meta.user.id },
							},
						},
						{
							model: Message,
							as: "messages",
							attributes: ["text", "created_at"],
							order: [["created_at", "DESC"]],
							limit: 1,
						},
					],
					where: {
						id: {
							[Op.in]: userConversations.map(
								(uc) => uc.conversation_id
							),
						},
					},
				});

				return conversations;
			},
		},

		sendMessage: {
			rest: "POST /:conversation_id/message",
			auth: true,
			params: {
				conversation_id: "uuid",
				message: "string",
				type: "string",
			},
			async handler(ctx) {
				const { conversation_id, message } = ctx.params;
				const userConversation = await UserConversation.findOne({
					where: {
						conversation_id,
						user_id: ctx.meta.user.id,
					},
				});

				if (!userConversation) {
					throw MoleculerClientError("NO_CONVERSATION");
				}

				const createdMessage = await Message.create({
					sender_id: ctx.meta.user.id,
					conversation_id,
					type: "message",
					text: message,
				});

				return createdMessage;
			},
		},

		getMessages: {
			rest: "GET /:id/messages",
			params: {},
			async handler(ctx) {
				const { id } = ctx.params;
				const userConversation = await UserConversation.findOne({
					where: {
						conversation_id: id,
						user_id: ctx.meta.user.id,
					},
				});

				if (!userConversation) {
					throw MoleculerClientError("NO_CONVERSATION");
				}

				const messages = await Message.findAll({
					where: {
						conversation_id: id,
					},
					attributes: ["id", "text", "created_at", "updated_at"],
					order: [["created_at", "ASC"]],
					include: [
						{
							model: User,
							as: "sender",
							attributes: ["id", "displayName"],
						},
					],
				});

				return messages;
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
