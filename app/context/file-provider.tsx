"use client";

import { FileContextType, FileData } from "@/lib/types";
import React, { createContext, useContext, useState } from "react";

const FileContext = createContext<FileContextType | undefined>(undefined);

export const useFile = () => {
    const context = useContext(FileContext);
    if (!context) {
        throw new Error("useFile must be used within a FileContextProvider");
    }
    return context;
};

export const FileContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
    const [fileType, setFileType] = useState<
        "WHATSAPP" | "TELEGRAM" | "DISCORD" | null
    >(null);

    return (
        <FileContext.Provider
            value={{
                selectedFile,
                setSelectedFile,
                fileType,
                setFileType,
            }}
        >
            {children}
        </FileContext.Provider>
    );
};
