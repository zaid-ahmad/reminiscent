import { ChatInterface } from "@/components/chat-interface";
import Navbar from "@/components/navbar";

export default function Home() {
    return (
        <>
            <header>
                <Navbar />
            </header>
            <main className='flex flex-col items-center justify-center pt-20'>
                <ChatInterface />
            </main>
        </>
    );
}
