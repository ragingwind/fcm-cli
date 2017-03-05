'use strict';

const EventEmitter = require('events');
const firebase = require('firebase-admin');

class FirebaseDatabaseListener extends EventEmitter {
	constructor(config) {
		super();

		this.app = firebase.initializeApp(config);
		this.prefetched = false;
	}

	_emit(e, snap) {
		this.emit('firebase-database', {
			event: e,
			ref: snap.ref.toString(),
			key: snap.key,
			val: snap.val()
		}, snap);
	}

	listen(path) {
		const refs = firebase.database().ref(path);
		let count = 0;

		refs.on('child_added', snap => {
			if (!this.prefetched) {
				count++;
				return;
			}

			this._emit('child_added', snap);
		});

		refs.once('value', snap => {
			if (snap.numChildren() === count) {
				this.prefetched = true;
			}
		});

		refs.on('child_changed', snap => this._emit('child_changed', snap));

		refs.on('child_removed', snap => this._emit('child_removed', snap));

		return this;
	}
}

let listner;

module.exports = {
	init: config => {
		if (!listner) {
			listner = new FirebaseDatabaseListener(config);
		}

		return listner;
	},
	listen: (path, handler) => {
		if (handler) {
			listner.on('firebase-database', e => handler(e));
		}

		return listner.listen(path);
	}
};
