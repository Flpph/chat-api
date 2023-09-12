"use strict";

const DbService = require("moleculer-db");
const SqlAdapter = require("moleculer-db-adapter-sequelize");

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * @typedef {import('moleculer-db').MoleculerDB} MoleculerDB  Moleculer's DB Service Schema
 */

module.exports = function (collection) {
	const cacheCleanEventName = `cache.clean.${collection}`;

	/** @type {MoleculerDB & ServiceSchema} */
	const schema = {
		name: "configurations",
		mixins: [DbService],
		adapter: new SqlAdapter(process.env.POSTGRES_URI),
		model: {},
		/**
		 * Service settings
		 */
		settings: {
			fields: [],
			// Populates
			populates: {},
		},

		/**
		 * Service dependencies
		 */
		dependencies: [],

		/**
		 * Actions
		 */
		actions: {
			/**
			 * Get client and api version
			 *
			 */
			versionNumbers: {
				params: {},
				async handler(ctx) {
					return { apiVersion: "0.9.61" };
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
		methods: {},

		/**
		 * Service created lifecycle event handler
		 */
		created() {},

		/**
		 * Service started lifecycle event handler
		 */
		// async started() {

		// },

		/**
		 * Service stopped lifecycle event handler
		 */
		// async stopped() {

		// },
	};
	// Eredeti
	// if (process.env.MONGO_URI) {
	// 	// Mongo adapter
	// 	const MongoAdapter = require("moleculer-db-adapter-mongo");

	// 	schema.adapter = new MongoAdapter(process.env.MONGO_URI);
	// 	schema.collection = collection;
	// } else if (process.env.NODE_ENV === 'test') {
	// 	// NeDB memory adapter for testing
	// 	schema.adapter = new DbService.MemoryAdapter();
	// } else {
	// 	// NeDB file DB adapter

	// 	// Create data folder
	// 	if (!fs.existsSync("./data")) {
	// 		fs.mkdirSync("./data");
	// 	}

	// 	schema.adapter = new DbService.MemoryAdapter({ filename: `./data/${collection}.db` });
	// }
	// if (process.env.POSTGRES_URI) {
	// 	// console.log(`\n\n === Connecting to ${process.env.MONGO_URI}\n`);
	// 	// Mongoose adapter
	// 	// schema.adapter = new MongooseAdapter(process.env.MONGO_URI);
	// 	schema.adapter = new SqlAdapter(process.env.POSTGRES_URI);
	// 	schema.collection = collection;
	// 	// mongoose.set("debug", true);
	// } else if (process.env.TEST) {
	// 	// NeDB memory adapter for testing
	// 	schema.adapter = new DbService.MemoryAdapter();
	// } else {
	// 	// NeDB file DB adapter

	// 	// Create data folder
	// 	if (!fs.existsSync("./data")) {
	// 		fs.mkdirSync("./data");
	// 	}

	// 	schema.adapter = new DbService.MemoryAdapter({ filename: `./data/${collection}.db` });
	// }

	return schema;
};
