'use strict';

function formatMessage(response) {
	const resultMessage = re => {
		return re.reduce((p, r) => {
			p += `Message Id: ${r.message_id}\n  `;
			return p;
		}, '');
	};

	return `
  Multicast Id: ${response.multicast_id}
  Success: ${response.success}
  Failure: ${response.failure}
  Canonical Ids: ${response.canonical_ids}
  ${resultMessage(response.results)}`;
}

module.exports = function (response) {
	return new Promise((resolve, reject) => {
		if (!response || response.failure === 1) {
			reject(`FAILED:`, formatMessage(response));
			return;
		}

		console.log(`SUCCESS:`, formatMessage(response));
		resolve();
	});
};
