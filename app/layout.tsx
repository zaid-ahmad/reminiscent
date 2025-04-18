import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./context/theme-provider";
import { FileContextProvider } from "./context/file-provider";
import { NameContextProvider } from "./context/name-provider";
import { ChatHistoryProvider } from "./context/chat-provider";
import { TypingStatusProvider } from "./context/typing-status-provider";
import Script from "next/script";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Reminiscent",
    description: "",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en' suppressHydrationWarning>
            <head>
                <Script id='theme-script' strategy='beforeInteractive'>
                    {`
                        try {
                            if (localStorage.getItem('app-theme') === 'dark' || (!localStorage.getItem('app-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                                document.documentElement.classList.add('dark');
                            } else {
                                document.documentElement.classList.remove('dark');
                            }
                        } catch (e) {}
                    `}
                </Script>
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                suppressHydrationWarning
            >
                <ThemeProvider
                    attribute='class'
                    defaultTheme='light'
                    enableSystem
                    disableTransitionOnChange
                    storageKey='app-theme'
                >
                    <FileContextProvider>
                        <NameContextProvider>
                            <ChatHistoryProvider>
                                <TypingStatusProvider>
                                    {children}
                                </TypingStatusProvider>
                            </ChatHistoryProvider>
                        </NameContextProvider>
                    </FileContextProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
