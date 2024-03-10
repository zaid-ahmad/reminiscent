import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import {
    ChatHistoryProvider,
    FileProvider,
    NameProvider,
    TypingStatusProvider,
} from "./context/context-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Reminiscent",
    description: "Talk to an AI. in disguise of a person.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang='en'>
            <body className={inter.className}>
                <FileProvider>
                    <NameProvider>
                        <ChatHistoryProvider>
                            <TypingStatusProvider>
                                <ThemeProvider
                                    attribute='class'
                                    defaultTheme='system'
                                    enableSystem
                                    disableTransitionOnChange
                                >
                                    {children}
                                </ThemeProvider>
                            </TypingStatusProvider>
                        </ChatHistoryProvider>
                    </NameProvider>
                </FileProvider>
            </body>
        </html>
    );
}
