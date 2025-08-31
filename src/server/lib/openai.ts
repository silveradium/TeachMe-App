import { Configuration, OpenAIApi, type ChatCompletionRequestMessage } from "openai";
import "pino";
import logger from "~/lib/logger";

export async function getChatGPTResponse(
  conversationLog: ChatCompletionRequestMessage[]
): Promise<string | undefined> {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: conversationLog,
  });
  logger.info({ request: conversationLog, response: completion }, "Get ChatGPT response: Successful");

  return completion.data.choices[0]?.message?.content;
}
