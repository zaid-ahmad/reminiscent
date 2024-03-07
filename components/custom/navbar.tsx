import { FunctionComponent } from "react";
import { ModeToggle } from "../ui/mode-toggle";

interface NavbarProps {}

const Navbar: FunctionComponent<NavbarProps> = () => {
    return (
        <header className='flex justify-around py-7'>
            <h2 className='text-xl font-bold'>
                Remini<span className='italic text-red-600'>s</span>cent
            </h2>
            <ModeToggle />
        </header>
    );
};

export default Navbar;

/*
    TODO:
    1. User should be able to send messages only after the txt file is uploaded.
    2. User should be able to upload the .txt file with the progress bar.
    3. Follow the same pattern as the supabase's chat prompt appplication. (links: https://www.youtube.com/watch?v=xmfNUCjszh4 | https://github.com/supabase-community/nextjs-openai-doc-search/blob/main/components/SearchDialog.tsx)
*/
