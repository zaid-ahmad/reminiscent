"use server";

import { streamUI, Message as UIMessage } from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import { createAI } from "ai/rsc";
import { ChatMessage } from "./types";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export async function sendMessage({
    userMessage,
    chatHistory,
    userName,
    fileContent,
}: {
    userMessage: string;
    chatHistory: ChatMessage[];
    userName: string;
    fileContent?: string;
}): Promise<string> {
    const history: UIMessage[] = chatHistory.map((msg) => ({
        role: msg.role === "USER" ? "user" : "assistant",
        content: msg.message,
    }));

    const result = await streamUI({
        model: openai("gpt-4o-mini"),
        system: fileContent
            ? `You are ${userName}, acting exactly like the persona shown in this chat history: ${fileContent}.
       Use the same slang, emojis, and communication style. Be humorous and engage naturally.`
            : `You are ${userName}'s conversational partner. Adapt to their style, using casual language and emojis appropriately.`,
        messages: [...history, { role: "user" as const, content: userMessage }],
    });

    let finalResponse = "";
    const reader = result.stream.getReader();
    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (value.type === "text") {
                finalResponse += value.text;
            }
        }
    } finally {
        reader.releaseLock();
    }

    return finalResponse;
}

export const AI = createAI({
    actions: { sendMessage },
    initialUIState: [],
    initialAIState: {},
});

export async function uploadFile({
    fileContent,
    userName,
}: {
    fileContent: string;
    userName: string;
}): Promise<{
    formattedData: ChatMessage[];
    initialResponse: string;
}> {
    const formattedData = formatMessages(fileContent, userName);

    const result = await streamUI({
        model: openai("gpt-4-turbo"),
        system: `You are ${userName}, acting exactly like in this chat history. Use matching slang, emojis, and communication style.`,
        messages: [
            ...formattedData.map((msg) => ({
                role: msg.role as "user" | "assistant",
                content: msg.content,
            })),
            { role: "user" as const, content: 'Repeat after me- "Hi"' },
        ],
    });

    let initialResponse = "";
    const reader = result.stream.getReader();
    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (value.type === "text") {
                initialResponse += value.text;
            }
        }
    } finally {
        reader.releaseLock();
    }

    return {
        formattedData: formattedData.map((msg) => ({
            role: msg.role === "user" ? "USER" : "CHATBOT",
            message: msg.content,
        })),
        initialResponse,
    };
}

function formatMessages(content: string, name: string): Message[] {
    const messages: Message[] = [];
    const lines = content.split("\n");

    lines.forEach((line) => {
        if (line.includes(` - ${name}:`)) {
            messages.push({
                role: "user",
                content: line.split(`${name}: `)[1].trim(),
            });
        } else if (line.includes(" - ")) {
            const message = line.split(" - ")[1].trim();
            messages.push({
                role: message.startsWith(name) ? "assistant" : "user",
                content: message.split(": ")[1]?.trim() || message,
            });
        }
    });

    return messages;
}
