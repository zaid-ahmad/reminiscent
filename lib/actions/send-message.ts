// lib/actions/send-message.ts
"use server";

type ChatCompletionMessage = {
    role: string;
    content: string;
};

type SendMessageProps = {
    message: string;
    chatHistory: ChatCompletionMessage[];
    persona: string;
};

export async function sendMessage({
    message,
    chatHistory,
    persona,
}: SendMessageProps): Promise<string> {
    try {
        // Add the current message to the history
        const messages = [...chatHistory, { role: "user", content: message }];

        // Make a request to our API endpoint
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messages,
                persona,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Get the response data
        const text = await response.text();
        return text;
    } catch (error) {
        console.error("Error in sendMessage action:", error);
        throw error;
    }
}
