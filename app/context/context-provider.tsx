"use client";

import React, { createContext, useContext, useState } from "react";

type FileContextType = {
    selectedFile: File | null;
    setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
};

type NameContextType = {
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
};

type ChatMessageType = {
    role: string;
    message: string;
};

type ChatHistoryContextType = {
    chats: ChatMessageType[];
    addMessageToChat: (sender: string, message: string) => void;
};

const FileContext = createContext<FileContextType | undefined>(undefined);
const NameContext = createContext<NameContextType | undefined>(undefined);
const ChatHistoryContext = createContext<ChatHistoryContextType | undefined>(
    undefined
);

export const useFileContext = () => {
    const context = useContext(FileContext);
    if (!context) {
        throw new Error("useFileContext must be used within a FileProvider");
    }
    return context;
};

export const useNameContext = () => {
    const context = useContext(NameContext);
    if (!context) {
        throw new Error("useNameContext must be used within a NameProvider");
    }
    return context;
};

export const useChatHistoryContext = () => {
    const context = useContext(ChatHistoryContext);

    if (!context) {
        throw new Error(
            "useChatHistoryContext must be used within a ChatHistoryProvider"
        );
    }

    return context;
};

export const FileProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    return (
        <FileContext.Provider value={{ selectedFile, setSelectedFile }}>
            <NameProvider>{children}</NameProvider>
        </FileContext.Provider>
    );
};

export const NameProvider = ({ children }: { children: React.ReactNode }) => {
    const [name, setName] = useState<string>(
        "Click to enter the same name saved in your WhatsApp chat"
    );

    return (
        <NameContext.Provider value={{ name, setName }}>
            {children}
        </NameContext.Provider>
    );
};

export const ChatHistoryProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [chats, setChats] = useState<ChatMessageType[]>([]);

    const addMessageToChat = (sender: string, message: string) => {
        const newMessage: ChatMessageType = { role: sender, message };
        setChats((prevChats) => [...prevChats, newMessage]);
    };

    return (
        <ChatHistoryContext.Provider value={{ chats, addMessageToChat }}>
            {children}
        </ChatHistoryContext.Provider>
    );
};
