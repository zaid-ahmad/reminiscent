"use client";

import { TypingStatusContextType } from "@/lib/types";
import React, { createContext, useContext, useState } from "react";

const TypingStatusContext = createContext<TypingStatusContextType | undefined>(
    undefined
);

export const useTypingStatus = () => {
    const context = useContext(TypingStatusContext);

    if (!context) {
        throw new Error(
            "useTypingStatus must be used within TypingContextProvider."
        );
    }

    return context;
};

export const TypingStatusProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [status, setStatus] = useState<boolean>(false);

    return (
        <TypingStatusContext.Provider value={{ status, setStatus }}>
            {children}
        </TypingStatusContext.Provider>
    );
};
