import React from "react";
import NavigationSidebar from "@/components/navigations/navigation-sidebar";
import '../globals.css'

interface IMainLayoutProps {
  children: React.ReactNode;
}
export default async function MainLayout({ children }: IMainLayoutProps) {
  return (

    <div className="h-full">
      <div className="hidden md:flex flex-col z-30 h-full w-[72px] fixed inset-y-0">
     <NavigationSidebar/>
      </div>
      <main className="md:pl-[72px] h-full">
      {children}
      </main>

    </div>
  );
}