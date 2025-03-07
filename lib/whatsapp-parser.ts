import { ChatMessage } from "@/lib/types";

interface ParsedWhatsAppMessage {
    timestamp: string;
    sender: string;
    content: string;
}

export const parseWhatsAppChat = (fileContent: string): ChatMessage[] => {
    const lines = fileContent.split("\n");
    const messages: ChatMessage[] = [];
    let currentSender = "";

    // Regular expression to match WhatsApp chat line format
    // Format: [DD/MM/YY, HH:MM:SS] Sender: Message
    const regex =
        /^\[(\d{1,2}\/\d{1,2}\/\d{2,4},\s\d{1,2}:\d{2}(?::\d{2})?(?:\s[AP]M)?)\]\s([^:]+):\s(.+)$/;

    lines.forEach((line) => {
        const match = line.match(regex);

        if (match) {
            const [_, timestamp, sender, content] = match;

            // Store the most recent sender for determining AI persona
            if (
                !currentSender &&
                sender.trim() !== "You" &&
                sender.trim() !== "Me"
            ) {
                currentSender = sender.trim();
            }

            // Determine if this is a user message or the target persona
            const role =
                sender.trim() === "You" || sender.trim() === "Me"
                    ? "USER"
                    : "CHATBOT";

            messages.push({
                role,
                message: content.trim(),
                metadata: {
                    timestamp,
                    sender: sender.trim(),
                },
            });
        } else if (line.trim() && messages.length > 0) {
            // If line doesn't match but isn't empty, it's likely a continuation of the previous message
            const lastMessage = messages[messages.length - 1];
            lastMessage.message += "\n" + line.trim();
        }
    });

    return messages;
};

export const extractPersonaName = (fileContent: string): string => {
    const lines = fileContent.split("\n");
    const regex =
        /^\[(\d{1,2}\/\d{1,2}\/\d{2,4},\s\d{1,2}:\d{2}(?::\d{2})?(?:\s[AP]M)?)\]\s([^:]+):\s(.+)$/;

    for (const line of lines) {
        const match = line.match(regex);
        if (match) {
            const [_, timestamp, sender, content] = match;
            if (sender.trim() !== "You" && sender.trim() !== "Me") {
                return sender.trim();
            }
        }
    }

    return "Friend"; // Default name if none found
};
