'use strict';

const FirebaseMessagingAgent = require('./firebase-messaging-agent');

const handlers = {
	send: configs => {
		const fma = new FirebaseMessagingAgent({
			serverKey: configs.messaging.server_key
		});

		return fma.send(configs.messaging);
	}
};

module.exports = function (configs = {}) {
	return new Promise((resolve, reject) => {
		const {command} = configs;
		const handler = handlers[command];

		if (!handler) {
			reject(`command is invalid, ${command}`);
			return;
		}

		handler(configs).then(response => {
			resolve(JSON.parse(response));
		});
	});
};
