"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        if (theme === "light") {
            setTheme("dark");
        } else {
            setTheme("light");
        }
    };

    return (
        <Button variant='outline' size='icon' onClick={toggleTheme}>
            {theme === "light" ? (
                <SunIcon className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all' />
            ) : (
                <MoonIcon className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all text-white' />
            )}
        </Button>
    );
}
