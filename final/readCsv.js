import { createReadStream, readFileSync, writeFileSync } from 'fs';
import csv from 'csv-parser';
// csvData()

export function readFile() {
	return JSON.parse(readFileSync('parsed.json', 'utf-8'))
}



export function parseCsv(csv) {
	console.log(csv)
	const parsed = []
	csv.forEach(e => {
		parsed.push([e['單元'], e['網址']])
		parsed.push([e['課程名稱'], e['網址']])
	})

	writeFileSync('parsed.json', JSON.stringify(parsed))
	// console.log(new Map(parsed))
	return (new Map(parsed))
}

export default async function csvData() {
	const filePath = '均一高中生物(1).csv'; // Replace with the path to your CSV file

	const results = [];

	createReadStream(filePath)
		.pipe(csv())
		.on('data', (data) => {
			// This event will be emitted whenever a new row is parsed
			results.push(data);
		})
		.on('end', () => {
			// This event will be emitted when the CSV parsing is complete
			console.log('hi');
			return parseCsv(results);
			// Now 'results' contains an array of objects, each representing a row in the CSV file
		})
		.on('error', (error) => {
			console.error('Error:', error.message);
		});
}
