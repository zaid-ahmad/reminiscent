import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatChatHistory(
    messages: { role: string; content: string }[]
) {
    return messages
        .map((message) => {
            const role = message.role === "user" ? "User" : "Assistant";
            return `${role}: ${message.content}`;
        })
        .join("\n\n");
}

export function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
