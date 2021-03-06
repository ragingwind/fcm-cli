#!/usr/bin/env node
'use strict';

const meow = require('meow');
const firebaseArgs = require('./lib/firebase-args');
const firebaseRunner = require('./lib/firebase-runner');
const firebaseLogger = require('./lib/firebase-logger');

const cli = meow(`
	Usage
	  $ fcm [command] <sources> <params> <configs...>

	Commands
		send                     send message through FCM
		watch                    watch database url and send message
		                         through FCM

	Sources/Params
		.json                    path of json file which have configs.
		                         params will be property name in the json
		.env                     path of .env file which have configs
		                         params will be prefix for replacing
		<alias>                  name of alias for saving and loading
		                         congigs from global

	Firebase APIs Options, same as Firebase APIs, acccept any of notations.
		--api-key                apiKey for Firebase APIs
		--server-key             serverKey for Firebase APIs
		--to                     token for peers who want to receive FCM push
		                         notification accept multiple options to send
		                         multiple peers the message
		--credential             path of Service Account credential file

	Firebase Messaging Payload, dot expressions will be translated to JSON
		--notification.title     {notification: {title: 'Title'}}
		--notification.body      {notification: {body: 'Body'}}
		--data.header            {data: {header: 'Header'}}
		--data.icon              {data: {icon: 'Icon'}}

	Examples
		# sending FCM push message by passed configs
		$ fcm send --server-key $SERVER_KEY --to $TOKEN --notification.title hi --notification.body message

		# save configs in global named by 'pwa-app1' after sending message
		$ fcm send pwa-app1 --server-key $SERVER_KEY --to $TOKEN --notification.title hi --notification.body message

		# loading configs by 'pwa-app1 and then sending message
		$ fcm send pwa-app1 --notification.title hi --notification.body message

		# loading configs by 'pwa-app1' and sending message to multiple peers
		$ fcm send pwa-app1 --to $PEER1_TOKEN --to $PEER2_TOKEN --notification.title hi --notification.body message

		# loading configs from firebaseConfig properties at firebase.json
	  $ fcm send firebase.json firebaseConfig --notification.title hi --notification.body message

		# loading configs from .env file and strip out FIREBASE_ prefix in keys
		$ fcm send .env FIREBASE_ --notification.title hi --notification.body message

		# watch
		$ fcm watch test1 --credential ./credential.json --database-url $DB_URL --api-key $API_KEY
`);

firebaseArgs(cli.input, cli.flags)
	.then(firebaseRunner)
	.catch(err => {
		console.error(err);
	});
