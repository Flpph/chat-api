"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		queryInterface.sequelize.transaction(async (transaction) => {
			await queryInterface.createSchema("conversation", { transaction });
			await queryInterface.createTable(
				{
					schema: "conversation",
					tableName: "conversation",
				},
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
				{ transaction }
			);

			await queryInterface.createTable(
				{
					schema: "conversation",
					tableName: "message",
				},
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
				{ transaction }
			);

			await queryInterface.createTable(
				{
					schema: "conversation",
					tableName: "user_conversations",
				},
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
				{ transaction }
			);
		});
	},

	async down(queryInterface, Sequelize) {},
};
