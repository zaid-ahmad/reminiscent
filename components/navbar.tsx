"use client";

import { useTheme } from "next-themes";
import { useFile } from "@/app/context/file-provider";
import { useName } from "@/app/context/name-provider";
import { useChat } from "@/app/context/chat-provider";
import { Button } from "@/components/ui/button";
import { Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
    const { setTheme, theme, resolvedTheme } = useTheme();
    const { selectedFile, setSelectedFile, setFileType } = useFile();
    const { name, setName } = useName();
    const { clearChats } = useChat();

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const resetApp = () => {
        setSelectedFile(null);
        setFileType(null);
        setName("");
        clearChats?.();
    };

    return (
        <nav className='fixed top-0 left-0 right-0 z-50 border-b border-[#ef5757]/20 bg-[#f1ede5]/90 backdrop-blur-sm'>
            <div className='container mx-auto px-4 py-3 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <span className='font-bold text-xl text-[#ef5757]'>REMI<span className="text-black">N</span>ISCENT</span>
                    {selectedFile && name && (
                        <span className='hidden md:inline-block text-sm text-black/70 ml-2'>
                            Chatting with {name}
                        </span>
                    )}
                </div>

                <div className='flex items-center gap-2'>
                    {selectedFile && (
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={resetApp}
                            title='Reset conversation'
                            className="hover:bg-[#ef5757]/10 text-[#ef5757]"
                        >
                            <X className='h-5 w-5' />
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
}