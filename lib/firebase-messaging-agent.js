'use strict';

const FCM = require('fcm-node');

class FirebaseMessagingAgent {
	constructor(opts) {
		this.opts = Object.assign({
			serverKey: undefined
		}, opts);

		if (!opts.serverKey) {
			throw new Error('--server-key is missing for FCM');
		}

		this.fcm = new FCM(opts.serverKey);
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

module.exports = FirebaseMessagingAgent;
