"use client";

import { Textarea } from "@/components/ui/textarea";
import EditableTextInput from "../custom/editable-input";
import { useState } from "react";
import FileUpload from "../custom/FileUpload";
import { useFileContext } from "@/app/context/file-context";

export function ChatInterface() {
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

    const handleFunction = () => {
        if (message.trim()) {
            const newMessage = { text: message, sender: "You" }; // Example message object
            setMessages([...messages, newMessage]); // Add new message to the messages array
            setMessage(""); // Clear the input after sending
        }
    };

    return (
        <div className='grid w-full max-w-3xl border border-zinc-200 rounded-lg shadow-md dark:border-gray-800'>
            <div className='flex border-b rounded-t-lg'>
                <div className='flex-1 grid place-items-center py-3'>
                    <div className='flex items-center gap-2'>
                        <UserIcon className='h-6 w-6' />
                        <span className='font-semibold'>You</span>
                    </div>
                </div>
                <div className='flex-1 grid place-items-center py-3'>
                    <div className='flex items-center justify-end gap-2'>
                        <TextIcon className='h-6 w-6' />
                        <span className='font-semibold'>
                            <EditableTextInput />
                        </span>
                    </div>
                </div>
            </div>
            <div className='p-4 grid gap-4 h-80 overflow-y-scroll'>
                <div className='flex items-start gap-4'>
                    <div className='rounded-lg bg-gray-100 p-4 text-sm break-words max-w-[75%]'>
                        Go to the WhatsApp chat that you wish the AI to talk
                        like and export the chat. Upload that text file and
                        begin chatting!
                    </div>
                </div>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex items-start gap-4 ${
                            msg.sender === "You" ? "justify-end" : ""
                        }`}
                    >
                        <div className='rounded-lg bg-gray-100 p-4 text-sm break-words max-w-[75%]'>
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>
            <div className='border-t'>
                <div className='p-4'>
                    <div className='grid gap-2'>
                        {!!selectedFile ? (
                            <div className='relative'>
                                <Textarea
                                    className='peer h-20 min-h-[100px]'
                                    placeholder='Hit enter ↵ to send...'
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

function UserIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
        >
            <path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' />
            <circle cx='12' cy='7' r='4' />
        </svg>
    );
}

function TextIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
        >
            <path d='M17 6.1H3' />
            <path d='M21 12.1H3' />
            <path d='M15.1 18H3' />
        </svg>
    );
}

/*
                { <div className='flex justify-end items-start gap-4'>
                    <div className='rounded-lg bg-gray-100 p-4 text-sm break-words max-w-[75%]'>
                        I'm looking for a good book recommendation. Can you help
                        me out?
                    </div>
                </div>
                <div className='flex items-start gap-4'>
                    <div className='rounded-lg bg-gray-100 p-4 text-sm break-words max-w-[75%]'>
                        Of course! I can help with that. What genre are you
                        interested in?
                    </div>
                </div>
                <div className='flex justify-end items-start gap-4'>
                    <div className='rounded-lg bg-gray-100 p-4 text-sm break-words max-w-[75%]'>
                        I'm interested in science fiction.
                    </div>
                </div>
                <div className='flex items-start gap-4'>
                    <div className='rounded-lg bg-gray-100 p-4 text-sm break-words max-w-[75%]'>
                        Great choice! I have some recommendations in mind. One
                        moment while I fetch the details.
                    </div>
                </div> 
                
*/
