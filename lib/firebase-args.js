'use strcit';

const path = require('path');
const loadJSONFile = require('load-json-file');
const Configstore = require('configstore');
const dotenv = require('dotenv');
const decamelize = require('decamelize');
const camelcase = require('camelcase');
const pkg = require('../package.json');

const configStore = new Configstore(pkg.name);

const FirebaseDatabaseConfigs = [
	'apiKey',
	'authDomain',
	'databaseURL',
	'storageBucket',
	'messagingSenderId'
];

const FirebaseMessagingConfigs = [
	'serverKey',
	'to',
	'registrationIds',
	'condition',
	'collapseKey',
	'priority',
	'contentAvailable',
	'mutableContent',
	'timeToLive',
	'restrictedPackageName',
	'dryRun',
	'data',
	'notification'
];

function remapConfig(args) {
	return Object.keys(args).reduce((props, key) => {
		if (FirebaseDatabaseConfigs.indexOf(key) > -1) {
			props.database[key] = args[key];
		} else if (FirebaseMessagingConfigs.indexOf(key) > -1) {
			// re-decamelize for https://www.npmjs.com/package/fcm-node
			props.messaging[decamelize(key)] = args[key];
		} else {
			props[key] = args[key];
		}

		return props;
	}, {
		database: {},
		messaging: {}
	});
}

function transformConfig(configs = {}) {
	// camelize issue is only for databaseUrl
	if (configs.databaseUrl) {
		configs = Object.assign(configs, {databaseURL: configs.databaseUrl});
		delete configs.databaseUrl;
	}

	return configs;
}

function readConfig(src, param) {
	const file = path.resolve(process.cwd(), src);
	let configs = {};

	if (/\.json$/.test(file)) {
		configs = loadJSONFile.sync(file);
		if (param) {
			configs = configs[param];
		}
	} else if (/\.env$/.test(file)) {
		const parsed = dotenv.config({path: file}).parsed;
		configs = Object.keys(parsed).reduce((p, k) => {
			p[camelcase(param ? k.replace(param, '') : k)] = parsed[k];
			return p;
		}, {});
	} else {
		configs = configStore.get(src);
	}

	return configs;
}

module.exports = function (commands = [], configs = {}) {
	return new Promise((resolve, reject) => {
		try {
			const [command, src, param] = commands;
			let prevConfig = {};

			if (!command) {
				reject(`command is missing or invalid, ${commands[0]}`);
			}

			// try to read saved or stored configs from file system
			if (src) {
				prevConfig = readConfig(src, param);
			}

			// merge two both of configs between readed and passed config
			configs = Object.assign(transformConfig(prevConfig), transformConfig(configs));

			// save merged configs to global store
			if (src && /\.(json|env)$/.test(src) === false) {
				configStore.set(src, configs);
			}

			resolve(Object.assign(remapConfig(configs), {command, src, param}));
		} catch (err) {
			reject(err);
		}
	});
};
