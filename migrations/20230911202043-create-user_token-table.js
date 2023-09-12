"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			{
				schema: "users",
				tableName: "user_token",
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
			}
		);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("user_token");
	},
};
