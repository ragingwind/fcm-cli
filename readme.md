# fcm-cli [![Build Status](https://travis-ci.org/ragingwind/fcm-cli.svg?branch=master)](https://travis-ci.org/ragingwind/fcm-cli)

> Firebase Cloud Messaging Client for CLI


## Install

```
$ npm install --save fcm-cli
```


## Usage

```js
const fcmCli = require('fcm-cli');

fcmCli('unicorns');
//=> 'unicorns & rainbows'
```


## API

### fcmCli(input, [options])

#### input

Type: `string`

Lorem ipsum.

#### options

##### foo

Type: `boolean`<br>
Default: `false`

Lorem ipsum.


## CLI

```
$ npm install --global fcm-cli
```

```
$ fcm-cli --help

  Usage
    fcm-cli [input]

  Options
    --foo  Lorem ipsum [Default: false]

  Examples
    $ fcm-cli
    unicorns & rainbows
    $ fcm-cli ponies
    ponies & rainbows
```


## License

MIT © [ragingwind](http://ragingwind.me)
