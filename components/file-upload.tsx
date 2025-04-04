"use client";

import { useFile } from "@/app/context/file-provider";
import { useName } from "@/app/context/name-provider";
import { useChat } from "@/app/context/chat-provider";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { extractPersonaName, parseWhatsAppChat } from "@/lib/whatsapp-parser";

export function FileUpload() {
    const { setSelectedFile, setFileType, fileType } = useFile();
    const { setName } = useName();
    const { concatChats, clearChats, setOriginalContent } = useChat();
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState<string>("");

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0] || !fileType) return;

        setIsLoading(true);
        const file = e.target.files[0];
        setFileName(file.name);

        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                // Process the file content based on file type
                const content = event.target.result;

                setSelectedFile({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    content: content,
                });

                // Clear existing chats
                clearChats?.();

                // Parse the chat based on file type
                if (fileType === "WHATSAPP" && typeof content === "string") {
                    // Store the original chat content for AI context
                    setOriginalContent(content);
                    
                    const parsedChats = parseWhatsAppChat(content);
                    const personaName = extractPersonaName(content);

                    // Set the persona name
                    setName(personaName);

                    // Add parsed chats to context
                    concatChats(parsedChats);
                }

                setIsLoading(false);
            }
        };

        reader.readAsText(file);
    };

    const handleFileTypeChange = (
        value: "WHATSAPP" | "TELEGRAM" | "DISCORD"
    ) => {
        setFileType(value);
    };

    return (
        <div className='w-full max-w-md space-y-4 p-4 border rounded-lg bg-background/50 backdrop-blur-sm'>
            <div className='space-y-2'>
                <Label htmlFor='file-type'>Chat Platform</Label>
                <Select onValueChange={handleFileTypeChange}>
                    <SelectTrigger>
                        <SelectValue placeholder='Select platform' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='WHATSAPP'>WhatsApp</SelectItem>
                        <SelectItem value='TELEGRAM' disabled>
                            Telegram (Coming Soon)
                        </SelectItem>
                        <SelectItem value='DISCORD' disabled>
                            Discord (Coming Soon)
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className='space-y-2'>
                <Label htmlFor='file-upload'>Upload Chat History</Label>
                <div className='flex items-center gap-2'>
                    <Input
                        id='file-upload'
                        type='file'
                        accept='.txt'
                        onChange={handleFileSelect}
                        disabled={!fileType || isLoading}
                        className='cursor-pointer'
                    />
                </div>
                {fileName && (
                    <p className='text-sm text-muted-foreground mt-1'>
                        Selected: {fileName}
                    </p>
                )}
            </div>

            {isLoading && (
                <div className='flex items-center justify-center py-2'>
                    <Loader2 className='h-6 w-6 animate-spin text-primary' />
                    <span className='ml-2'>Processing chat history...</span>
                </div>
            )}

            <div className='text-sm text-muted-foreground'>
                <p>
                    Upload a chat export file to let Reminiscent analyze and
                    simulate conversations.
                </p>
                <p className='mt-1'>
                    Currently supporting WhatsApp chat exports (.txt format).
                </p>
            </div>
        </div>
    );
}