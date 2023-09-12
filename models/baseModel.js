"use strict";
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
	define: {
		// The `timestamps` field specify whether or not the `createdAt` and `updatedAt` fields will be created.
		// This was true by default, but now is false by default
		timestamps: true,
		updatedAt: "updated_at",
		createdAt: "created_at",
	},
	logging: true,
	benchmark: true,
});

module.exports = { sequelize, Sequelize };
