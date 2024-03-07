"use client";

import React, { useRef, useState } from "react";
import axios from "axios";
import { IoIosClose } from "react-icons/io";

enum UploadStatus {
    Select = "select",
    Uploading = "uploading",
    Done = "done",
}

const FileUpload: React.FC = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [uploadStatus, setUploadStatus] = useState<UploadStatus>(
        UploadStatus.Select
    );

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setSelectedFile(files[0]);
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
            if (selectedFile) {
                formData.append("file", selectedFile);

                await axios.post("http://localhost:5328/api/upload", formData, {
                    onUploadProgress: (progressEvent: any) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setProgress(percentCompleted);
                    },
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
            {!selectedFile && (
                <button
                    className='w-82 h-37 text-lg font-medium flex flex-col items-center justify-center gap-4 text-indigo-600 bg-white border-2 border-dashed border-indigo-600 rounded-lg cursor-pointer transition-all duration-300 ease-in-out hover:bg-white hover:text-indigo-600'
                    onClick={onChooseFile}
                >
                    <span className='material-symbols-outlined text-3xl bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center'>
                        upload
                    </span>
                    Upload File
                </button>
            )}
            {selectedFile && (
                <>
                    <div className='w-75 flex items-center gap-4 text-black bg-white border border-indigo-200 rounded-md p-2'>
                        <div className='flex-1 flex items-center gap-4'>
                            <div className='flex-1'>
                                <h6 className='text-sm font-normal'>
                                    {selectedFile?.name}
                                </h6>
                                <div className='w-full h-1 bg-gray-200 rounded-full mt-2'>
                                    <div
                                        className='h-1 bg-indigo-600 rounded-full'
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>
                            {uploadStatus === UploadStatus.Select ? (
                                <button
                                    onClick={clearFileInput}
                                    className='w-9 h-9 flex items-center justify-center text-sm text-indigo-800 bg-purple-100 rounded-full'
                                >
                                    <span className='material-symbols-outlined text-2xl'>
                                        <IoIosClose />
                                    </span>
                                </button>
                            ) : (
                                <div className='w-9 h-9 flex items-center justify-center text-sm text-indigo-800 bg-purple-100 rounded-full'>
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
                        className='w-82 text-sm font-medium text-white bg-indigo-500 rounded-md p-2 mt-4 cursor-pointer'
                        onClick={handleUpload}
                    >
                        {uploadStatus === UploadStatus.Select ||
                        uploadStatus === UploadStatus.Uploading
                            ? "Upload"
                            : "Done"}
                    </button>
                </>
            )}
        </div>
    );
};

export default FileUpload;
