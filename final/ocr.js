import { createWorker } from 'tesseract.js';
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

// fetchImage('488279355370242099')

export default async function fetchImage(messageId) {

	const channelAccessToken = process.env.LINE_ACCESS_TOKEN; // Replace with your actual channel access token

	// console.log(channelAccessToken, messageId)

	const apiUrl = `https://api-data.line.me/v2/bot/message/${messageId}/content`;

	const headers = {
		'Authorization': `Bearer ${channelAccessToken}`
	};

	const response = await fetch(apiUrl, { headers })
	const buffer = await streamToBuffer(response.body);
	fs.writeFileSync('./output.png', buffer);
	// console.log(imageBuffer)
	// console.log(await streamToString(imageBuffer))
	return;
}

async function streamToBuffer(stream) {
	const chunks = [];
	const reader = stream.getReader();
	while (true) {
		const { done, value } = await reader.read();
		if (done) {
			break;
		}
		chunks.push(value);
	}
	return new Uint8Array(chunks.reduce((acc, chunk) => [...acc, ...Array.from(chunk)], []));
}

export async function picToText() {
	const worker = await createWorker('eng+chi_tra');
	const { data: { text } } = await worker.recognize('output.png');
	console.log(text);
	await worker.terminate();
	return text
}
