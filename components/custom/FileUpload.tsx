"use client";

import React, { useRef, useState } from "react";
import axios from "axios";
import { IoIosClose } from "react-icons/io";
import {
    useChatHistoryContext,
    useFileContext,
    useNameContext,
} from "@/app/context/context-provider";

enum UploadStatus {
    Select = "select",
    Uploading = "uploading",
    Done = "done",
}

const FileUpload: React.FC = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { setSelectedFile } = useFileContext();
    const { addMessageToChat } = useChatHistoryContext();
    const { name } = useNameContext();

    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [uploadStatus, setUploadStatus] = useState<UploadStatus>(
        UploadStatus.Select
    );

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setFile(files[0]);
        }
    };

    const onChooseFile = () => {
        inputRef.current?.click();
    };

    const clearFileInput = () => {
        if (inputRef.current) {
            inputRef.current.value = "";
        }
        setSelectedFile(null);
        setFile(null);
        setProgress(0);
        setUploadStatus(UploadStatus.Select);
    };

    const handleUpload = async () => {
        if (uploadStatus === UploadStatus.Done) {
            clearFileInput();
            return;
        }

        try {
            setUploadStatus(UploadStatus.Uploading);
            const formData = new FormData();
            if (file) {
                formData.append("file", file);
                if (
                    name ===
                    "Click to enter the same name saved in your WhatsApp chat"
                ) {
                    alert(
                        "Please type in the name of the person saved in your WhatsApp."
                    );
                    return;
                }
                formData.append("name", name);
                formData.append("firstTime", String(1));

                await axios
                    .post("http://localhost:5328/api/upload", formData, {
                        onUploadProgress: (progressEvent: any) => {
                            const percentCompleted = Math.round(
                                (progressEvent.loaded * 100) /
                                    progressEvent.total
                            );
                            setProgress(percentCompleted);
                            setSelectedFile(file);
                        },
                    })
                    .then((response) => {
                        addMessageToChat("CHATBOT", response.data);
                    });

                setUploadStatus(UploadStatus.Done);
            }
        } catch (error) {
            setUploadStatus(UploadStatus.Select);
        }
    };

    return (
        <div>
            <input
                ref={inputRef}
                type='file'
                onChange={handleFileChange}
                className='hidden'
            />
            {!file && (
                <button
                    className='py-2 px-4 w-full text-red-600 bg-white dark:bg-zinc-800 border-2 border-dashed border-red-600 rounded-lg cursor-pointer transition-all duration-300 ease-in-out hover:bg-white hover:text-red-600'
                    onClick={onChooseFile}
                >
                    Upload File
                </button>
            )}
            {file && (
                <>
                    <div className='w-75 flex items-center gap-4 text-black bg-white border rounded-md p-2 dark:border-zinc-900 dark:bg-zinc-800 dark:text-zinc-200'>
                        <div className='flex-1 flex items-center gap-4'>
                            <div className='flex-1'>
                                <h6 className='text-sm font-normal'>
                                    {file?.name}
                                </h6>
                                <div className='w-full h-1 bg-gray-200 rounded-full mt-2'>
                                    <div
                                        className='h-1 bg-red-600 rounded-full'
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>
                            {uploadStatus === UploadStatus.Select ? (
                                <button
                                    onClick={clearFileInput}
                                    className='w-9 h-9 flex items-center justify-center text-sm text-red-800 bg-red-100 rounded-full'
                                >
                                    <span className='material-symbols-outlined text-2xl'>
                                        <IoIosClose />
                                    </span>
                                </button>
                            ) : (
                                <div className='w-9 h-9 flex items-center justify-center text-sm text-red-800 bg-red-100 rounded-full'>
                                    {uploadStatus === UploadStatus.Uploading ? (
                                        `${progress}%`
                                    ) : uploadStatus === UploadStatus.Done ? (
                                        <span className='material-symbols-outlined text-xl'>
                                            check
                                        </span>
                                    ) : null}
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        className='w-full text-sm font-medium text-white bg-red-500 rounded-md p-2 mt-4 cursor-pointer'
                        onClick={handleUpload}
                    >
                        {uploadStatus === UploadStatus.Select ||
                        uploadStatus === UploadStatus.Uploading
                            ? "Upload and begin chatting!"
                            : "Done"}
                    </button>
                </>
            )}
        </div>
    );
};

export default FileUpload;
