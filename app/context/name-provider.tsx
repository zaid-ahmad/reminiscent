"use client";

import { NameContextType } from "@/lib/types";
import React, { createContext, useContext, useState } from "react";

const NameContext = createContext<NameContextType | undefined>(undefined);

export const useName = () => {
    const context = useContext(NameContext);
    if (!context) {
        throw new Error("useName must be used within a NameContextProvider");
    }
    return context;
};

export const NameContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [name, setName] = useState<string>("");

    return (
        <NameContext.Provider value={{ name, setName }}>
            {children}
        </NameContext.Provider>
    );
};
