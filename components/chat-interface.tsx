"use client";

import { useChat as useAIChat } from "@ai-sdk/react";
import { useFile } from "@/app/context/file-provider";
import { useName } from "@/app/context/name-provider";
import { useChat } from "@/app/context/chat-provider";
import { FileUpload } from "./file-upload";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";

export function ChatInterface(): React.JSX.Element {
    const { selectedFile, fileType } = useFile();
    const { name } = useName();
    const { originalChatContent } = useChat();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        isLoading,
        error,
    } = useAIChat({
        api: "/api/chat",
        body: {
            persona: name,
            chatHistory: originalChatContent,
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
                        ? "bg-[#ef5757] text-[#f1ede5] rounded-tr-none"
                        : "bg-[#f1ede5] border border-[#ef5757]/20 text-black rounded-tl-none"
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
                    <h1 className='text-5xl font-black mb-6'>
                        <span className='text-[#ef5757]'>Remi</span>
                        <span className='text-black'>n</span>
                        <span className='text-[#ef5757]'>iscent</span>
                    </h1>
                    <p className='text-center mb-8 max-w-lg text-black/80'>
                        Upload a chat history to start having AI-powered
                        conversations that feel just like chatting with your
                        friend.
                    </p>
                    <FileUpload />
                </div>
            ) : (
                <div className='flex flex-col h-[80vh] bg-[#f1ede5]/30 rounded-lg'>
                    <div className='flex-1 overflow-y-auto py-4 space-y-4 mb-4 border-b border-[#ef5757]/10'>
                        {messages.length === 0 ? (
                            <div className='flex flex-col items-center justify-center h-full text-center p-8'>
                                <h2 className='text-2xl font-bold mb-2 text-[#ef5757]'>
                                    Start Chatting with {name}
                                </h2>
                                <p className='text-black/70'>
                                    The AI has analyzed your chat history and is
                                    ready to simulate a conversation with {name}.
                                </p>
                            </div>
                        ) : (
                            messages.map(renderChatMessage)
                        )}
                        {isLoading && (
                            <div className='flex items-center space-x-2 text-black/70 px-4'>
                                <Loader2 className='h-4 w-4 animate-spin text-[#ef5757]' />
                                <span>{name} is typing...</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSubmit} className='py-4 px-4'>
                        <div className='flex gap-2'>
                            <Textarea
                                value={input}
                                onChange={handleInputChange}
                                placeholder={`Type a message to ${name}...`}
                                className='resize-none bg-[#f1ede5] border-[#ef5757]/20 focus-visible:ring-[#ef5757]/30'
                                rows={2}
                                disabled={isLoading}
                            />
                            <Button
                                type='submit'
                                disabled={!input.trim() || isLoading}
                                className='self-end bg-[#ef5757] hover:bg-[#ef5757]/90 text-[#f1ede5]'
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