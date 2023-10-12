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

							ack(null, null);
						},
					},
				},
			},
		},
	},
	actions: {
		onBidReceived: {
			params: {
				offerId: "string",
				bid: "object",
			},
			async handler(ctx) {
				let socket = this;
				this.io
					.to(`offer_${ctx.params.offerId}`)
					.emit("bidReceived", ctx.params.bid);
			},
		},
	},
	methods: {
		async socketAuthorize(socket, handler) {
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
