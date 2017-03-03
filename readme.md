# fcm-cli [![Build Status](https://travis-ci.org/ragingwind/fcm-cli.svg?branch=master)](https://travis-ci.org/ragingwind/fcm-cli)

> FCM(Firebase Cloud Messaging Client) for CLI to avoid a troublesome testing of Push Notification on the terminal


## Install

```
$ yarn global add fcm-cli <or> npm install -g fcm-cli
```

## Help

```
$ fcm-cli --help
```

## Why You should use this packages, What is benefits in terms of testing with FCM

It is going to work in similar way of other tools, are supporting RESTful APIs of Firebase, are working on terminal, like curl. However, those of another tools and commands is so hard and not handy to use while test as **we frequently modify configurations on terminal**. This package supports saving and loading pre-configuration by alias, loading from json with specific property and also .env which have simple key and value format. So, **we don't need to pass all of configuration everytime**. we can just put in simple updatable messages or updatable

### Workflow

```
# First time, sending FCM push message with all of configs and alias
$ fcm send test1 --server-key $SERVER_KEY --to $TOKEN --notification.title hi --notification.body message

# Second time, we don't need to pass keys configuration its alread saved before named by test1
$ fcm send test1 --notification.title hi --notification.body message2

# The next time or next day, we can just call alias to test
$ fcm send test1

# If you have json or env file to store Firebase configurations, just pass it to package
$ fcm send .env --notification.title hi --notification.body message2
$ fcm send firebase.json --notification.title hi --notification.body message2

# May your configurations have parent property or prefix to distingush from other values. Just pass
# third param with .env or json files. It will works, remove prefix or find property depends on files type
$ fcm send .env FIREBASE_ --notification.title hi --notification.body message2
$ fcm send firebase.json firebaseConfig --notification.title hi --notification.body message2
```

## Samples

```sh
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
```

## License

MIT © [Jimmy Moon](http://ragingwind.me)
