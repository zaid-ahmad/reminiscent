"use client";

import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import FileUpload from "../custom/FileUpload";
import {
    useChatHistoryContext,
    useFileContext,
    useNameContext,
} from "@/app/context/context-provider";
import axios from "axios";

export function ChatInterface() {
    const { chats, addMessageToChat } = useChatHistoryContext();
    const { name } = useNameContext();
    const [message, setMessage] = useState<string>("");
    const { selectedFile } = useFileContext();
    const [messages, setMessages] = useState<
        { text: string; sender: string }[]
    >([]);

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent the default action to avoid form submission
            handleFunction();
        }
    };

    const handleFunction = async () => {
        if (message.trim()) {
            const newMessage = { text: message, sender: "You" }; // Example message object

            setMessages([...messages, newMessage]); // Add new message to the messages array
            addMessageToChat("USER", message);
            setMessage(""); // Clear the input after sending

            try {
                const formData = new FormData();
                formData.append("name", name);
                const chatsJson = JSON.stringify(chats);
                formData.append("latestChatHistory", chatsJson);
                formData.append("message", message);

                await axios
                    .post("http://localhost:5328/api/upload", formData)
                    .then((response) => {
                        addMessageToChat("CHATBOT", response.data);
                    });
            } catch (error) {
                throw new Error(
                    "Some error happend in chat-interface component while sending the message to the server."
                );
            }
        }
    };

    return (
        <div className='max-w-7xl border-zinc-200 shadow-md dark:border-gray-800'>
            <div className='rounded-lg border p-4'>
                <div className='flex items-start gap-2'>
                    <div className='rounded-lg bg-zinc-100 p-4 text-sm break-words max-w-[75%] dark:bg-zinc-300 dark:text-zinc-950'>
                        Go to the WhatsApp chat that you wish the AI to talk
                        like and export the chat. Upload that text file and
                        begin chatting!
                    </div>
                </div>
                {chats &&
                    chats.map((msg, index) => {
                        if (msg.role === "CHATBOT") {
                            return (
                                <div
                                    key={index}
                                    className='flex items-start gap-4'
                                >
                                    <div className=' rounded-lg bg-zinc-100 p-4 text-sm break-words max-w-[75%] dark:bg-zinc-300 dark:text-zinc-950'>
                                        {msg.message}
                                    </div>
                                </div>
                            );
                        }
                        return (
                            <div
                                key={index}
                                className='flex items-start gap-4 justify-end'
                            >
                                <div className='rounded-lg bg-red-500 p-4 text-sm break-words max-w-[75%] text-white'>
                                    {msg.message}
                                </div>
                            </div>
                        );
                    })}
            </div>
            <div className='border-t'>
                <div className='p-4'>
                    <div className='grid gap-2'>
                        {!!selectedFile ? (
                            <div className='relative'>
                                <Textarea
                                    className='peer h-20 min-h-[100px]'
                                    placeholder='Hit enter ↵ to send...'
                                    value={message}
                                    onKeyDown={handleKeyDown}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </div>
                        ) : (
                            <div className='text-center'>
                                <FileUpload />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
