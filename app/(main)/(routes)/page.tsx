import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@clerk/nextjs/app-beta";
export default function Home() {
  return (
    <main className="px-2">

  <UserButton afterSignOutUrl="/"/>
 <ModeToggle />
    </main>
  );
}
