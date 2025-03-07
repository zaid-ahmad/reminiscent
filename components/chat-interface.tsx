"use client";

import React, { useState, useRef, useEffect } from "react";
import { useChat } from "@/app/context/chat-provider";
import { useFile } from "@/app/context/file-provider";
import { useName } from "@/app/context/name-provider";
import { useTypingStatus } from "@/app/context/typing-status-provider";
import { FileUpload } from "./file-upload";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage } from "@/lib/types";
import { ArrowUp, Loader2 } from "lucide-react";

type ChatCompletionMessage = {
    role: string;
    content: string;
};

export function ChatInterface(): React.JSX.Element {
    const { chats, addMessageToChat, newChats } = useChat();
    const { selectedFile, fileType } = useFile();
    const { name } = useName();
    const { status, setStatus } = useTypingStatus();
    const [userInput, setUserInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chats, newChats, status]);

    const sendMessageToApi = async (
        message: string,
        chatHistory: ChatCompletionMessage[],
        persona: string
    ): Promise<string> => {
        const messages = [...chatHistory, { role: "user", content: message }];

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

        const text = await response.text();
        return text;
    };

    const handleSendMessage = async () => {
        if (!userInput.trim() || !selectedFile || !fileType) return;

        // Add user message to chat
        addMessageToChat("USER", userInput);
        setUserInput("");
        setIsLoading(true);
        setStatus(true);

        try {
            // Get past chat history for context
            const chatHistory = [...chats].map((chat) => ({
                role: chat.role === "USER" ? "user" : "assistant",
                content: chat.message,
            }));

            // Send to API using the integrated function
            const response = await sendMessageToApi(
                userInput,
                chatHistory,
                name
            );

            if (response) {
                // Add AI response to chat
                addMessageToChat("CHATBOT", response);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            addMessageToChat(
                "CHATBOT",
                "Sorry, I'm having trouble responding right now."
            );
        } finally {
            setIsLoading(false);
            setStatus(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const renderChatMessage = (message: ChatMessage, index: number) => {
        const isUser = message.role === "USER";

        return (
            <div
                key={index}
                className={`flex ${
                    isUser ? "justify-end" : "justify-start"
                } mb-4`}
            >
                <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                        isUser
                            ? "bg-primary text-primary-foreground rounded-tr-none"
                            : "bg-muted rounded-tl-none"
                    }`}
                >
                    {message.message}
                </div>
            </div>
        );
    };

    return (
        <div className='w-full max-w-4xl mx-auto px-4'>
            {!selectedFile ? (
                <div className='flex flex-col items-center justify-center py-8'>
                    <h1 className='text-3xl font-bold mb-6'>
                        Welcome to Reminiscent
                    </h1>
                    <p className='text-center mb-8 max-w-lg'>
                        Upload a chat history to start having AI-powered
                        conversations that feel just like chatting with your
                        friend.
                    </p>
                    <FileUpload />
                </div>
            ) : (
                <div className='flex flex-col h-[80vh]'>
                    <div className='flex-1 overflow-y-auto py-4 space-y-4 mb-4 border-b'>
                        {chats.length === 0 ? (
                            <div className='flex flex-col items-center justify-center h-full text-center p-8'>
                                <h2 className='text-2xl font-bold mb-2'>
                                    Start Chatting with {name}
                                </h2>
                                <p className='text-muted-foreground'>
                                    The AI has analyzed your chat history and is
                                    ready to simulate a conversation with {name}
                                    .
                                </p>
                            </div>
                        ) : (
                            chats.map(renderChatMessage)
                        )}
                        {status && (
                            <div className='flex items-center space-x-2 text-muted-foreground px-4'>
                                <Loader2 className='h-4 w-4 animate-spin' />
                                <span>{name} is typing...</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className='py-4'>
                        <div className='flex gap-2'>
                            <Textarea
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={`Type a message to ${name}...`}
                                className='resize-none'
                                rows={2}
                                disabled={isLoading}
                            />
                            <Button
                                onClick={handleSendMessage}
                                disabled={!userInput.trim() || isLoading}
                                className='self-end'
                            >
                                {isLoading ? (
                                    <Loader2 className='h-5 w-5 animate-spin' />
                                ) : (
                                    <ArrowUp className='h-5 w-5' />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
