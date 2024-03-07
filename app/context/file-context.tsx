"use client";

import React, { createContext, useContext, useState } from "react";

type FileContextType = {
    selectedFile: File | null;
    setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
};

const FileContext = createContext<FileContextType | undefined>(undefined);

export const useFileContext = () => {
    const context = useContext(FileContext);
    if (!context) {
        throw new Error("useFileContext must be used within a FileProvider");
    }
    return context;
};

export const FileProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    return (
        <FileContext.Provider value={{ selectedFile, setSelectedFile }}>
            {children}
        </FileContext.Provider>
    );
};
