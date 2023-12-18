import express from 'express';
import { findTopic } from './openai.js';

const app = express();

app.get("/", (req, res) => {
	res.send("hi")
})

app.get("/hi", async (req, res) => {
	const { text } = req.query
	res.json(await findTopic(text))
})

app.listen(3000)