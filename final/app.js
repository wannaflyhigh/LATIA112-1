import express from 'express';
import { middleware, messagingApi } from '@line/bot-sdk';
import { findTopic } from './openai.js';
import fetchImage, { picToText } from './ocr.js';
import dotenv from 'dotenv'
import csvData, { readFile } from './readCsv.js';
import pushMessage from './linebot.js';
dotenv.config()

const app = express();

const config = {
	channelAccessToken: process.env.LINE_ACCESS_TOKEN,
	channelSecret: process.env.CHANNEL_SECRET,
};

app.get("/", (req, res) => {
	res.send("hi")
})

app.post('/webhook', middleware(config), (req, res) => {
	Promise
		.all(req.body.events.map(handleEvent))
		.then((result) => res.json(result));
});

const client = new messagingApi.MessagingApiClient({
	channelAccessToken: process.env.LINE_ACCESS_TOKEN,
});

async function handleEvent(event) {
	console.log(event)
	const userId = event.source.userId

	if (event.type === 'message') {
		const messageType = event.message.type;

		if (messageType === 'text') {
			// Handle text messages
			return await pushMessage(userId, `把想辨識的題目拍照上傳吧~`)
			return client.replyMessage({
				replyToken: event.replyToken,
				messages: [
					{
						type: 'text',
						text: `請傳送圖片已進行辨識`,
					},
				],
			});
		} else if (messageType === 'image') {
			// Handle image messages
			// You can access the image URL from event.message.contentProvider.originalContentUrl
			await client.replyMessage({
				replyToken: event.replyToken,
				messages: [
					{
						type: 'text',
						text: `歐虧辨識中~`,
					},
				],
			})
			await fetchImage(event.message.id)
			const text = await picToText()
			const data = await findTopic(text)
			const file = readFile()
			const topicURLmap = new Map(file)
			// console.log(topicURLmap)
			const replyText = `這個問題可能和以下單元的課程與影片有關
可以參考以下影片進行學習

${topicURLmap.get(data[0].book_name[0])?.chapter}
${data[0].book_name[0]} ${topicURLmap.get(data[0].book_name[0])?.url}

${topicURLmap.get(data[0].book_name[1])?.chapter}
${data[0].book_name[1]} ${topicURLmap.get(data[0].book_name[1])?.url}

${topicURLmap.get(data[0].book_name[2])?.chapter}
${data[0].book_name[2]} ${topicURLmap.get(data[0].book_name[2])?.url}`
			console.log(replyText)
			return await pushMessage(userId, replyText)
			return client.replyMessage({
				replyToken: event.replyToken,
				messages: [
					{
						type: 'text',
						text: `${topicURLmap.get(data[0].book_name[0])}
						${topicURLmap.get(data[0].book_name[1])}
						${topicURLmap.get(data[0].book_name[2])}`,
					},
				],
			});
		}
	}

	return Promise.resolve(null);
}

app.get("/hi", async (req, res) => {
	const { text } = req.query
	res.json(await findTopic(text))
})

app.listen(3000)
