"use client";

import { useChat } from "@ai-sdk/react";
import { useFile } from "@/app/context/file-provider";
import { useName } from "@/app/context/name-provider";
import { FileUpload } from "./file-upload";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";

export function ChatInterface(): React.JSX.Element {
    const { selectedFile, fileType } = useFile();
    const { name } = useName();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        isLoading,
        error,
    } = useChat({
        api: "/api/chat",
        body: {
            persona: name,
        },
        sendExtraMessageFields: true,
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const renderChatMessage = (
        message: { role: string; content: string },
        index: number
    ) => (
        <div
            key={index}
            className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
            } mb-4`}
        >
            <div
                className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-muted rounded-tl-none"
                }`}
            >
                {message.content}
            </div>
        </div>
    );

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
                        {messages.length === 0 ? (
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
                            messages.map(renderChatMessage)
                        )}
                        {isLoading && (
                            <div className='flex items-center space-x-2 text-muted-foreground px-4'>
                                <Loader2 className='h-4 w-4 animate-spin' />
                                <span>{name} is typing...</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSubmit} className='py-4'>
                        <div className='flex gap-2'>
                            <Textarea
                                value={input}
                                onChange={handleInputChange}
                                placeholder={`Type a message to ${name}...`}
                                className='resize-none'
                                rows={2}
                                disabled={isLoading}
                            />
                            <Button
                                type='submit'
                                disabled={!input.trim() || isLoading}
                                className='self-end'
                            >
                                {isLoading ? (
                                    <Loader2 className='h-5 w-5 animate-spin' />
                                ) : (
                                    <ArrowUp className='h-5 w-5' />
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
