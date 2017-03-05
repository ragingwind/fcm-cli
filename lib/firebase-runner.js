'use strict';

const path = require('path');
const admin = require('firebase-admin');
const loadJSONFile = require('load-json-file');
const firebaseMessagingAgent = require('./firebase-messaging-agent');
const firebaseDatabaseListener = require('./firebase-database-listener');
const firebaseLogger = require('./firebase-logger');

const handlers = {
	send: configs => {
		firebaseMessagingAgent.init(configs.messaging);
		firebaseMessagingAgent.send(configs.messaging)
			.then(firebaseLogger);
	},
	watch: configs => {
		const credential = loadJSONFile.sync(path.resolve(process.cwd(), configs.credential));

		if (!credential) {
			throw new Error(`credential for service account is invalid, ${configs.credential}`);
		}

		firebaseMessagingAgent.init(configs.messaging);

		firebaseDatabaseListener.init(Object.assign(
			configs.database, {
				credential: admin.credential.cert(credential)
			}
		));

		firebaseDatabaseListener.listen('/', e => {
			configs.data = e;
			configs.messaging.notification = {
				title: `Data Changed`,
				body: `event: ${e.event}, ref: ${e.ref}, key: ${e.key},val: ${typeof e.val === 'object' ? JSON.stringify(e.val) : e.val}`
			};

			console.log(`DATA CHANGED> ${configs.messaging.notification.body}`);

			firebaseMessagingAgent.send(configs.messaging)
				.then(firebaseLogger);
		});
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

		return handler(configs);
	});
};
