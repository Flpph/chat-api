"use strict";

const { User } = require("./user");
const { UserToken } = require("./userToken");

User.hasMany(UserToken, {
	foreignKey: "user_id",
	as: "auth_tokens",
});
UserToken.belongsTo(User, {
	foreignKey: "user_id",
	as: "user",
});

module.exports = {
	User,
	UserToken,
};
