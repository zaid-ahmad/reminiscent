"use client";

import { useNameContext } from "@/app/context/context-provider";
import React, { useState } from "react";
import { Input } from "../ui/input";

const EditableTextInput = () => {
    const [isEditing, setIsEditing] = useState(false);
    const { name, setName } = useNameContext();

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    return (
        <div className='flex justify-center items-center'>
            {isEditing ? (
                <Input
                    type='text'
                    value={name}
                    onChange={handleTextChange}
                    onBlur={toggleEdit}
                    className='w-full'
                    autoFocus
                />
            ) : (
                <span onClick={toggleEdit} className='cursor-pointer'>
                    {name}
                </span>
            )}
        </div>
    );
};

export default EditableTextInput;
