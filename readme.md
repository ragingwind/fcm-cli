# fcm-cli [![Build Status](https://travis-ci.org/ragingwind/fcm-cli.svg?branch=master)](https://travis-ci.org/ragingwind/fcm-cli)

> FCM(Firebase Cloud Messaging Client) Development tool working on CLI to avoid a troublesome testing of Push Notification on the terminal


## Install

```
$ yarn global add fcm-cli <or> npm install -g fcm-cli
```

## Help

```sh
$ fcm --help
```

## Usase

```sh
$ fcm [command] <sources> <params> <configs...>
```

### Commands and Mandatory Configs

- send: Sending push message only. It requires:
	- server_key: You can get from Firebase Dashboard. Setting > Cloud Messaging > Server Key
	- to: You will get from a peer, client after they subscribed to push messaging service of FCM
	- notification / data: You should offer either of them at least. `title` and `body` should be exist if you'd use `notification` property. It's built on top of [fcm-node](https://github.com/jlcvp/fcm-node), Please refer to get mode information.

- watch: Watching changes on database url and send push notification message. It requires:
	- server_key, to, notification is same with mentioned above
	- api_key: You can get from Firebase Dashboard Overview
	- credential: We use firebase-admin which requires `Service Account Credential`. You can get the credential file from [Firebase Admin Setup](https://firebase.google.com/docs/admin/setup#add_firebase_to_your_app)
	)

### Use Case

```sh
# sending FCM push message by passed configs
$ fcm send --server-key $SERVER_KEY --to $TOKEN \
           --notification.title hi \
           --notification.body message

# save configs in global named by 'pwa-app1' after sending message
$ fcm send pwa-app1 --server-key $SERVER_KEY --to $TOKEN \
                    --notification.title hi \
                    --notification.body message

# loading configs by 'pwa-app1 and then sending message
$ fcm send pwa-app1 --notification.title hi --notification.body message

# loading configs by 'pwa-app1' and sending message to multiple peers
$ fcm send pwa-app1 --to $PEER1_TOKEN --to $PEER2_TOKEN \
                    --notification.title hi \
                    --notification.body message

# loading configs from firebaseConfig properties at firebase.json
$ fcm send firebase.json firebaseConfig \
                    --notification.title hi \
                    --notification.body message

# loading configs from .env file and strip out FIREBASE_ prefix in keys
$ fcm send .env FIREBASE_ --notification.title hi --notification.body message

# watch Firebase database and sending push when it's changed
fcm watch test1 --credential $PRJECT/conf/credential.json \
                --database-url https://yourapp-id.firebaseio.com/
```

## What is benefits in terms of testing with FCM

It's working in a similar way of other tools, are supporting RESTful APIs of Firebase, are working on terminal, like curl. However, those of another tools and commands is so hard and not handy to use while test as **we frequently modify configurations on terminal**. This package supports saving and loading pre-configuration by alias, loading from json with specific property and also .env which have simple key and value format. So, **we don't need to pass all of configuration everytime**. We can just put in simple updatable messages with alias

### Workflow

#### Testing with Alias

```sh
# first time, sending FCM push message with all of configs and alias for saving
$ fcm send test1 --server-key $SERVER_KEY --to $TOKEN \
                 --notification.title hi \
                 --notification.body message

# second time, we don't need to pass keys configuration its already saved before named by test1
$ fcm send test1 --notification.title hi --notification.body message2

# the next time or next day, we can just call alias to test
$ fcm send test1
```

#### Testing with pre-configured file .json and .env

```sh
# if you have json or env file having Firebase configurations, just pass its path to
$ fcm send .env --notification.title hi --notification.body message2
$ fcm send firebase.json --notification.title hi --notification.body message2

# may your configurations have parent property or prefix to distingush from other values. Just pass
# third param with .env or json files. It will works, remove prefix or find property depends on files type
$ fcm send .env FIREBASE_ --notification.title hi --notification.body message2
$ fcm send firebase.json firebaseConfig --notification.title hi --notification.body message2
```

#### Testing with watch mode

```sh
fcm watch test1 --credential $PRJECT/conf/credential.json \
                --database-url https://react-pwa-hello-world.firebaseio.com/
```

## FAQ

- Where is the location for saving alias and configurations?: We use [configstore](https://www.npmjs.com/package/configstore) to save configs. It usally use for that location at `~/.config/configstore/`, with package name, `fcm-cli`. You can have a look what is saved.

```sh
cat ~/.config/configstore/fcm-cli.json
{
	"test1": {
		"serverKey": "SERVER-KEY",
		"to": "LAST-SENT-TO-TOKEN",
		"notification": {
			"title": "hi",
			"body": "Welcome Push World"
		},
		"credential": "/Users/ragingwind/Downloads/credential.json",
		"apiKey": "-LADPTQtqD54TWdMzmZk",
		"databaseURL": "https://react-pwa-hello-world.firebaseio.com/"
	}
}
```

## License

MIT © [Jimmy Moon](http://ragingwind.me)
