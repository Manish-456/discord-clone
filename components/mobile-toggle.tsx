

import { Menu } from "lucide-react"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { Button } from "./ui/button";
import NavigationSidebar from "@/components/navigations/navigation-sidebar";
import ServerSidebar from "@/components/server/server-sidebar";
export const MobileToggle = ({serverId} : {serverId : string}) => {
    return (
      <Sheet>
        <SheetTrigger asChild>
            <Button variant={'ghost'} size={"icon"} className="md:hidden">
          <Menu />
            </Button>
        </SheetTrigger>
        <SheetContent side={"left"} className="p-0 flex gap-0">
        <div className="w-[72px]">
            <NavigationSidebar />
        </div>
        <ServerSidebar serverId={serverId}/>
        </SheetContent>
      </Sheet>
    )
}