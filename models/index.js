"use strict";

const { User } = require("./user");
const { UserToken } = require("./userToken");
const { Conversation } = require("./conversation");
const { Message } = require("./message");
const { UserConversation } = require("./userConversation");

User.hasMany(UserToken, {
	foreignKey: "user_id",
	as: "auth_tokens",
});
UserToken.belongsTo(User, {
	foreignKey: "user_id",
	as: "user",
});

User.belongsToMany(Conversation, {
	through: {
		model: UserConversation,
	},
	foreignKey: "user_id",
	as: "conversations",
});
Conversation.belongsToMany(User, {
	through: {
		model: UserConversation,
	},
	foreignKey: "conversation_id",
	as: "users",
});

UserConversation.belongsTo(Conversation, {
	foreignKey: "conversation_id",
	as: "conversation",
});
UserConversation.belongsTo(User, {
	foreignKey: "user_id",
	as: "user",
});

Conversation.hasMany(Message, {
	foreignKey: "conversation_id",
	as: "messages",
});

Message.belongsTo(Conversation, {
	foreignKey: "conversation_id",
	as: "conversation",
});

User.hasMany(Message, {
	foreignKey: "sender_id",
	as: "messages",
});

Message.belongsTo(User, {
	foreignKey: "sender_id",
	as: "sender",
});

module.exports = {
	User,
	UserToken,
	Conversation,
	Message,
	UserConversation,
};
