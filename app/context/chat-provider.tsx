"use client";

import { ChatContextType, ChatMessage } from "@/lib/types";
import React, { createContext, useContext, useState } from "react";

const ChatHistoryContext = createContext<ChatContextType | undefined>(
    undefined
);

export const useChat = () => {
    const context = useContext(ChatHistoryContext);
    if (!context) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
};

export const ChatHistoryProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [chats, setChats] = useState<ChatMessage[]>([]);
    const [newChats, setNewChats] = useState<ChatMessage[]>([]);

    const addMessageToChat = (role: "USER" | "CHATBOT", message: string) => {
        const newMessage: ChatMessage = { role, message };
        setChats((prevChats) => [...prevChats, newMessage]);
    };

    const concatChats = (oldChats: ChatMessage[]) => {
        setChats((prevChats) => [...prevChats, ...oldChats]);
    };

    const addNewMessageToChat = (role: "USER" | "CHATBOT", message: string) => {
        const newMessage: ChatMessage = { role, message };
        setNewChats((prevChats) => [...prevChats, newMessage]);
    };

    const clearChats = () => {
        setChats([]);
        setNewChats([]);
    };

    return (
        <ChatHistoryContext.Provider
            value={{
                chats,
                addMessageToChat,
                concatChats,
                newChats,
                addNewMessageToChat,
                clearChats,
            }}
        >
            {children}
        </ChatHistoryContext.Provider>
    );
};
