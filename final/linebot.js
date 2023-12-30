export default async function pushMessage(userId, text) {
	const channelAccessToken = process.env.LINE_ACCESS_TOKEN

	const headers = {
		'Content-Type': 'application/json',
		'Authorization': `Bearer ${channelAccessToken}`,
	};

	const data = {
		to: userId,
		messages: [
			{
				type: 'text',
				text,
			},
		],
	};

	fetch('https://api.line.me/v2/bot/message/push', {
		method: 'POST',
		headers: headers,
		body: JSON.stringify(data),
	})
		.then(response => response.json())
		.then(result => {
			console.log('Response:', result);
		})
		.catch(error => {
			console.error('Error:', error.message || error);
		});
}