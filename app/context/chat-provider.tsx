"use client";
import { createContext, useContext, useState } from "react";
import { ChatMessage } from "@/lib/types";

interface ChatContextType {
    chats: ChatMessage[];
    originalChatContent: string | null;
    concatChats: (newChats: ChatMessage[]) => void;
    clearChats: () => void;
    setOriginalContent: (content: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatHistoryProvider({ children }: { children: React.ReactNode }) {
    const [chats, setChats] = useState<ChatMessage[]>([]);
    const [originalChatContent, setOriginalChatContent] = useState<string | null>(null);

    const concatChats = (newChats: ChatMessage[]) => {
        setChats((prevChats) => [...prevChats, ...newChats]);
    };

    const clearChats = () => {
        setChats([]);
    };

    const setOriginalContent = (content: string) => {
        setOriginalChatContent(content);
    };

    return (
        <ChatContext.Provider
            value={{ 
                chats, 
                originalChatContent, 
                concatChats, 
                clearChats, 
                setOriginalContent 
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error("useChat must be used within a ChatHistoryProvider");
    }
    return context;
}