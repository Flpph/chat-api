"use strict";
const { Sequelize, Model } = require("sequelize");
const { sequelize } = require("./baseModel");

class User extends Model {}
User.init(
	{
		id: {
			primaryKey: true,
			type: Sequelize.UUID,
			defaultValue: Sequelize.literal("uuid_generate_v4()"),
		},
		name: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		displayName: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		email: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		password: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		password_reset_code: {
			type: Sequelize.STRING,
			allowNull: true,
		},
		is_verified: {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
		},
		verification_token: {
			type: Sequelize.STRING,
			allowNull: true,
		},
		created_at: {
			type: Sequelize.DATE,
			allowNull: true,
		},
		updated_at: {
			type: Sequelize.DATE,
			allowNull: true,
		},
	},
	{
		sequelize,
		modelName: "User",
		schema: "users",
		tableName: "users",
	}
);

module.exports = { User };
