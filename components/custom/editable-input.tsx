"use client";

import React, { useState } from "react";

const EditableTextInput = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState("ChatGPT");

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    return (
        <div className='flex justify-center items-center'>
            {isEditing ? (
                <input
                    type='text'
                    value={text}
                    onChange={handleTextChange}
                    onBlur={toggleEdit}
                    className='input border border-gray-300 p-2 rounded'
                    autoFocus
                />
            ) : (
                <span onClick={toggleEdit} className='cursor-pointer'>
                    {text}
                </span>
            )}
        </div>
    );
};

export default EditableTextInput;
