export type ChatMessage = {
    role: "USER" | "CHATBOT";
    message: string;
    metadata?: {
        timestamp?: string;
        sender?: string;
    };
};

export type ChatContextType = {
    chats: ChatMessage[];
    addMessageToChat: (role: "USER" | "CHATBOT", message: string) => void;
    concatChats: (oldChats: ChatMessage[]) => void;
    newChats: ChatMessage[];
    addNewMessageToChat: (role: "USER" | "CHATBOT", message: string) => void;
    clearChats?: () => void;
};

export type FileData = {
    name: string;
    size: number;
    type: string;
    content: string | ArrayBuffer | null;
};

export type FileContextType = {
    selectedFile: FileData | null;
    setSelectedFile: React.Dispatch<React.SetStateAction<FileData | null>>;
    fileType: "WHATSAPP" | "TELEGRAM" | "DISCORD" | null;
    setFileType: React.Dispatch<
        React.SetStateAction<"WHATSAPP" | "TELEGRAM" | "DISCORD" | null>
    >;
};

export type NameContextType = {
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
};

export type TypingStatusContextType = {
    status: boolean;
    setStatus: React.Dispatch<React.SetStateAction<boolean>>;
};
