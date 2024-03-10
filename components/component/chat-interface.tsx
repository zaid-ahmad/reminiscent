"use client";

import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import FileUpload from "../custom/FileUpload";
import {
    useChatHistoryContext,
    useFileContext,
    useNameContext,
    useTypingStatusContext,
} from "@/app/context/context-provider";
import axios from "axios";

export function ChatInterface() {
    const { chats, addMessageToChat, newChats, addNewMessageToChat } =
        useChatHistoryContext();
    const { name } = useNameContext();
    const { status, setStatus } = useTypingStatusContext();

    const [message, setMessage] = useState<string>("");
    const { selectedFile } = useFileContext();
    const [messages, setMessages] = useState<
        { text: string; sender: string }[]
    >([]);

    const dummy = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (dummy.current) {
            dummy.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chats]);

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
            addNewMessageToChat("USER", message);
            setMessage(""); // Clear the input after sending

            try {
                const formData = new FormData();
                formData.append("name", name);
                const chatsJson = JSON.stringify(chats);
                formData.append("latestChatHistory", chatsJson);
                formData.append("message", message);
                setStatus(true);

                await axios
                    .post("http://localhost:5328/api/upload", formData)
                    .then((response) => {
                        addMessageToChat("CHATBOT", response.data);
                        addNewMessageToChat("CHATBOT", response.data);
                        setStatus(false);
                    });
            } catch (error) {
                throw new Error(
                    "Some error happend in chat-interface component while sending the message to the server."
                );
            }
        }
    };

    return (
        <div className='w-full sm:w-[80rem] max-w-7xl rounded border border-zinc-200 shadow-md dark:border-gray-800 dark:bg-zinc-900'>
            <div className='w-full sm:w-[80rem] max-w-7xl h-[480px] p-4 overflow-y-auto'>
                <div className='flex items-start gap-2 animate-slide-up'>
                    <div className='rounded-lg bg-zinc-100 p-4 text-sm break-words max-w-[65%] sm:max-w-[55%] dark:bg-zinc-800 dark:text-zinc-100'>
                        Go to the WhatsApp chat that you wish the AI to talk
                        like and export the chat. Upload that text file and
                        begin chatting!
                    </div>
                </div>
                {newChats &&
                    newChats.map((msg, index) => {
                        if (msg.role === "CHATBOT") {
                            return (
                                <div
                                    key={index}
                                    className='flex items-start gap-4 animate-slide-up'
                                >
                                    <div className=' rounded-3xl bg-zinc-100 p-4 mt-2 text-sm break-words max-w-[65%] sm:max-w-[55%] dark:bg-zinc-800 dark:text-zinc-100'>
                                        {msg.message}
                                    </div>
                                </div>
                            );
                        }
                        return (
                            <div
                                key={index}
                                className='flex items-start gap-4 justify-end animate-slide-up'
                            >
                                <div className='rounded-3xl bg-red-500 p-4 mt-2 text-sm break-words max-w-[55%] text-white dark:bg-red-700 dark:text-zinc-100'>
                                    {msg.message}
                                </div>
                            </div>
                        );
                    })}

                {status ? (
                    <div className='flex items-start gap-2 animate-slide-up'>
                        <div className='flex mt-2 space-x-1 rounded-lg bg-zinc-100 p-4 text-sm break-words max-w-[55    %] dark:text-zinc-950 dark:bg-zinc-800'>
                            <span className='sr-only'>Typing...</span>
                            <div className='h-2 w-2 bg-red-600 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                            <div className='h-2 w-2 bg-red-600 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                            <div className='h-2 w-2 bg-red-600 rounded-full animate-bounce'></div>
                        </div>
                    </div>
                ) : (
                    ""
                )}
                <div ref={dummy} />
            </div>
            <div>
                <div className='p-4'>
                    <div className='grid gap-2'>
                        {!!selectedFile ? (
                            <div className='relative'>
                                {status ? (
                                    <Textarea
                                        className='peer h-20 min-h-[100px] dark:bg-zinc-800'
                                        placeholder='Hit enter ↵ to send...'
                                        value={message}
                                        onKeyDown={handleKeyDown}
                                        onChange={(e) =>
                                            setMessage(e.target.value)
                                        }
                                        disabled
                                    />
                                ) : (
                                    <Textarea
                                        className='peer h-20 min-h-[100px] dark:bg-zinc-800'
                                        placeholder='Hit enter ↵ to send...'
                                        value={message}
                                        onKeyDown={handleKeyDown}
                                        onChange={(e) =>
                                            setMessage(e.target.value)
                                        }
                                    />
                                )}
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
