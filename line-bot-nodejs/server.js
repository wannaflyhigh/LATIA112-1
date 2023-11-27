import express from 'express';
import { middleware, messagingApi } from '@line/bot-sdk';
import { azureSentiment } from './azure-lang.js';

const config = {
	channelAccessToken: process.env.LINE_ACCESS_TOKEN,
	channelSecret: process.env.CHANNEL_SECRET,
};

const app = express();
app.post('/webhook', middleware(config), (req, res) => {
	Promise
		.all(req.body.events.map(handleEvent))
		.then((result) => res.json(result));
});

const client = new messagingApi.MessagingApiClient({
	channelAccessToken: process.env.LINE_ACCESS_TOKEN,
});
async function handleEvent(event) {
	if (event.type !== 'message' || event.message.type !== 'text') {
		return Promise.resolve(null);
	}
	const { sentiment, confidenceScores } = await azureSentiment(event.message.text)

	return client.replyMessage({
		replyToken: event.replyToken,
		messages: [{
			type: 'text',
			text: event.message.text + " " + sentiment + " " + confidenceScores[sentiment]
		}],
	});
}

app.listen(3000);