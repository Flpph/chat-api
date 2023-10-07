"use strict";
const { Sequelize, Model } = require("sequelize");
const { sequelize } = require("./baseModel");

class UserConversation extends Model {}
UserConversation.init(
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
		conversation_id: {
			type: Sequelize.UUID,
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
		modelName: "UserConversation",
		schema: "conversation",
		tableName: "user_conversations",
	}
);

module.exports = { UserConversation };
