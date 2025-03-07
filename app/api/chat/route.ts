import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export const runtime = "edge";

export async function POST(req: Request) {
    try {
        const { messages, persona } = await req.json();

        const systemPrompt = `You are ${persona}. Respond in their style, vocabulary, 
        and mannerisms. Keep responses conversational and authentic.`;

        const result = await streamText({
            model: openai("gpt-4o-mini"),
            system: systemPrompt,
            messages,
            temperature: 0.7,
            maxTokens: 500,
        });

        return result.toDataStreamResponse();
    } catch (error) {
        console.error("Error in chat API:", error);
        return new Response(
            JSON.stringify({ error: "Error processing request" }),
            { status: 500 }
        );
    }
}
