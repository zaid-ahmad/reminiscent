import { ChatInterface } from "@/components/component/chat-interface";
import Navbar from "@/components/custom/navbar";

export default function Home() {
    return (
        <>
            <header>
                <Navbar />
            </header>
            <main className='flex flex-col items-center justify-center'>
                <ChatInterface />
            </main>
        </>
    );
}
