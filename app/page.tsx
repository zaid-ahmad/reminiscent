import { ChatInterface } from "@/components/component/chat-interface";
import Navbar from "@/components/custom/navbar";

export default function Home() {
    return (
        <main>
            <Navbar />
            <section className='flex flex-col items-center'>
                <ChatInterface />
            </section>
        </main>
    );
}
