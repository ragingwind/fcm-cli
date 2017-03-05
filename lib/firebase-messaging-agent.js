'use strict';

const FCM = require('fcm-node');

class FirebaseMessagingAgent {
	constructor(opts) {
		if (!opts.server_key) {
			throw new Error('--server-key is missing for FCM');
		}

		this.fcm = new FCM(opts.server_key);
	}

	send(message = {}) {
		// @TODO support multiple to
		return new Promise((resolve, reject) => {
			if (!message.data && !message.notification) {
				reject('--data and --notification, are missing, either of options is avaiablefor FCM');
				return;
			}

			this.fcm.send(message, (err, resp) => {
				if (err) {
					reject(err);
					return;
				}

				return resolve(resp);
			});
		});
	}
}

let agent;

module.exports = {
	init: config => {
		if (!agent) {
			agent = new FirebaseMessagingAgent(config);
		}

		return agent;
	},
	send: message => {
		return agent.send(message);
	}
};
