'use strict';

function formatMessage(response) {
	const resultMessage = re => {
		return re.reduce((p, r) => {
			p += `Message Id: ${r.message_id}\n  `;
			return p;
		}, '');
	};

	return `Multicast Id: ${response.multicast_id}
  Success: ${response.success}
  Failure: ${response.failure}
  Canonical Ids: ${response.canonical_ids}
  ${resultMessage(response.results)}`;
}

module.exports = function (response) {
	response = JSON.parse(response);

	if (!response || response.failure === 1) {
		console.log(`PUSH> Failed:`, formatMessage(response));
		return;
	}

	console.log(`PUSH> Succeeded:`, formatMessage(response));
};
