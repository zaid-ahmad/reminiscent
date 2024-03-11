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
            <div className='flex flex-col sm:flex-row items-center gap-2 justify-around w-full'>
                <h2 className='text-xl font-bold'>
                    DrUnk<span className='italic text-red-600'>s</span>
                    hIgHhherrr
                </h2>
                <div className='flex items-center'>
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
            </div>
            <ModeToggle />
        </header>
    );
};

export default Navbar;
