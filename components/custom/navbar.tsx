"use client";

import { FunctionComponent } from "react";
import { ModeToggle } from "../ui/mode-toggle";
import EditableTextInput from "./editable-input";
import { IoPersonSharp } from "react-icons/io5";
import { useNameContext } from "@/app/context/context-provider";
import { Badge } from "../ui/badge";

const Navbar: FunctionComponent = () => {
    const { name } = useNameContext();
    return (
        <header className='flex justify-between items-center py-3 px-7'>
            <h2 className='text-xl font-bold'>
                Remini<span className='italic text-red-600'>s</span>cent
            </h2>
            <div>
                <div className='flex items-center justify-end gap-2'>
                    <IoPersonSharp />
                    <span className='font-semibold text-sm'>
                        <EditableTextInput />
                    </span>

                    {name !==
                    "Click to enter the same name saved in your WhatsApp chat" ? (
                        <Badge variant='outline' className='bg-emerald-500'>
                            Online
                        </Badge>
                    ) : (
                        ""
                    )}
                </div>
            </div>
            <ModeToggle />
        </header>
    );
};

export default Navbar;
