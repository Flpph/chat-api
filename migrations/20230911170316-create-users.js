"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createSchema("users");
		await queryInterface.sequelize.query(
			'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
		);
		await queryInterface.createTable(
			{
				schema: "users",
				tableName: "users",
			},
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
			}
		);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("users");
	},
};
