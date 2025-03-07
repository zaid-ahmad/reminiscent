import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";
import { formatChatHistory } from "@/lib/utils";

// Create OpenAI API client
const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export const runtime = "edge";

export async function POST(req: Request) {
    try {
        const { messages, persona } = await req.json();

        const formattedHistory = formatChatHistory(
            messages.slice(0, -1) // Exclude the last message which is the current user input
        );

        const systemPrompt = `You are ${persona}. 
    
The following is a chat history between you and the user: 

${formattedHistory}

Your goal is to respond as ${persona} would, mimicking their speaking style, vocabulary, humor, and mannerisms based on the chat history. Keep your responses conversational and in the style that ${persona} would use.

Be humorous, authentic, and engaging, just like in a real conversation. Don't be overly formal unless that's how ${persona} typically communicates.`;

        const apiMessages = [
            {
                role: "system",
                content: systemPrompt,
            },
            ...messages,
        ];

        const response = await openai.createChatCompletion({
            model: "gpt-4o-mini",
            messages: apiMessages,
            temperature: 0.7,
            max_tokens: 500,
            stream: true,
        });

        const stream = OpenAIStream(response);
        return new StreamingTextResponse(stream);
    } catch (error) {
        console.error("Error in chat API:", error);
        return new Response(
            JSON.stringify({
                error: "There was an error processing your request",
            }),
            { status: 500 }
        );
    }
}
