"use strict";
const { Sequelize, Model } = require("sequelize");
const { sequelize } = require("./baseModel");

class UserToken extends Model {}
UserToken.init(
	{
		id: {
			primaryKey: true,
			type: Sequelize.UUID,
			defaultValue: Sequelize.literal("uuid_generate_v4()"),
		},

		user_id: {
			type: Sequelize.UUID,
			allowNull: false,
		},
		auth_token: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		expiration: {
			type: Sequelize.DATE,
			allowNull: false,
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
		modelName: "UserToken",
		schema: "users",
		tableName: "user_token",
	}
);

module.exports = { UserToken };
