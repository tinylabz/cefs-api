import { Configuration, OpenAIApi } from "openai";

export async function main() {
  const configuration = new Configuration({
    organization: "org-pR8KdvBVyrz67OHDBtbkC9QN",
    apiKey: "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",
  });
  const openai = new OpenAIApi(configuration);

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "user", content: "Write a nodejs express app with forking ?" },
    ],
  });

  return response;
}
