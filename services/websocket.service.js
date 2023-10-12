"use strict";
const SocketIOService = require("moleculer-io");

module.exports = {
	name: "websocket",
	mixins: [SocketIOService],
	/**
	 * Service settings
	 */
	settings: {
		// Populates
		populates: {},
		// Validation schema for new entities
		entityValidator: {},
		port: process.env.SOCKETPORT || 3001, //will call initSocketIO() on broker.start()
		cors: {
			origin: "*",
			methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE", "PATCH"],
			exposedHeaders: [],
			credentials: false,
			maxAge: 3600,
		},
		io: {
			namespaces: {
				"/": {
					authorization: true,
					events: {
						sendMessage: async function (data, ack) {
							let socket = this;
							let user = socket.client.user;
							console.log({ userName: user.name, data });
							try {
								const { message, conversationUsers } =
									await socket.$service.broker.call(
										"conversations.sendMessage",
										{
											conversation_id:
												data.conversationId,
											message: data.message,
											type: "message",
										},
										{
											meta: {
												user,
											},
										}
									);
								ack(null, message);

								await socket.$service.broker.call(
									"websocket.newMessage",
									{
										userIds: conversationUsers,
										conversationId: data.conversationId,
										message,
									}
								);
							} catch (e) {
								ack(e, null);
							}
						},
					},
				},
			},
		},
	},
	actions: {
		newMessage: {
			params: {
				userIds: "array",
				conversationId: "string",
				message: "object",
			},
			async handler(ctx) {
				const { userIds, conversationId, message } = ctx.params;
				let socket = this;
				for (const userId of userIds) {
					console.log("runs");
					socket.io
						.to(`chat_feed_${userId}`)
						.emit("newMessage", { conversationId, message });
				}
			},
		},
	},
	methods: {
		async socketAuthorize(socket) {
			let authToken = socket.handshake.query["x-api-key"];
			console.log("Login using remember token: ", authToken);
			if (authToken) {
				const user = await this.broker.call("users.findByAuthToken", {
					authToken: authToken,
				});
				if (user) {
					socket.join(`chat_feed_${user.id}`);
					return user;
				}
			}

			setInterval();
			console.log("Invalid creditials");
			return Promise.reject("Invalid creditials");
		},
	},

	created() {},

	stopped() {
		console.log("stopped");
	},
};
