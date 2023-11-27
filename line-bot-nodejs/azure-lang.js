import { TextAnalyticsClient, AzureKeyCredential } from "@azure/ai-text-analytics"

export async function azureSentiment(userInput) {
	const endpoint = process.env.AZURE_LANGUAGE_ENDPOINT; // Replace with your endpoint
	const apiKey = process.env.AZURE_LANGUAGE_APIKEY; // Replace with your API key

	const textAnalyticsClient = new TextAnalyticsClient(endpoint, new AzureKeyCredential(apiKey));

	const documents = [
		{ id: "1", language: "en", text: userInput }
	];

	const response = await textAnalyticsClient.analyzeSentiment(documents, "zh-Hant", { includeOpinionMining: true });

	console.log(response)

	const docs = response.filter(doc => !doc.error);

	for (const idx in docs) {
		console.log(`Document text: ${documents[idx].text}`);
		console.log(`Overall sentiment: ${docs[idx].sentiment}`);
	}

	return docs[0];
}

// Example usage
const user_input = "櫃台人員很親切";
azureSentiment(user_input).then(res => {
	console.log(`Returned sentiment: ${res.sentiment}`);
}).catch(error => {
	console.error("An error occurred:", error);
});
