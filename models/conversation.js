"use strict";
const { Sequelize, Model } = require("sequelize");
const { sequelize } = require("./baseModel");

class Conversation extends Model {}
Conversation.init(
	{
		id: {
			primaryKey: true,
			type: Sequelize.UUID,
			defaultValue: Sequelize.literal("uuid_generate_v4()"),
		},
		type: {
			type: Sequelize.ENUM,
			values: ["direct", "channel"],
			defaultValue: "direct",
			allowNull: false,
		},
		name: {
			type: Sequelize.STRING,
			allowNull: true,
		},
		creator_id: {
			type: Sequelize.UUID,
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
		modelName: "Conversation",
		schema: "conversation",
		tableName: "conversation",
	}
);

module.exports = { Conversation };
