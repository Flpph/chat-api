"use strict";
const { Sequelize, Model } = require("sequelize");
const { sequelize } = require("./baseModel");

class Message extends Model {}
Message.init(
	{
		id: {
			primaryKey: true,
			type: Sequelize.UUID,
			defaultValue: Sequelize.literal("uuid_generate_v4()"),
		},
		sender_id: {
			type: Sequelize.UUID,
			allowNull: false,
		},
		conversation_id: {
			type: Sequelize.UUID,
			allowNull: false,
		},
		type: {
			type: Sequelize.ENUM,
			values: ["message"],
			defaultValue: "message",
			allowNull: false,
		},
		text: {
			type: Sequelize.TEXT,
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
		deleted_at: {
			type: Sequelize.DATE,
			allowNull: true,
		},
	},
	{
		sequelize,
		modelName: "Message",
		schema: "conversation",
		tableName: "message",
	}
);

module.exports = { Message };
