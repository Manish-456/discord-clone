import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";

import { cn } from "../lib/utils";
import { ThemeProvider } from "@/providers/theme-provider";
import { ModalProvider } from "@/providers/modal-provider";
import { SocketContextProvider } from "@/providers/socket-provider";
import {QueryProvider} from "@/providers/query-provider";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Discord_Clone",
  description: "Generated by Manish Tamang",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ClerkProvider>
        <body className={cn(font.className, "bg-white dark:bg-[#313338]")}>
          <ThemeProvider
            attribute="class"
            storageKey="discord-theme"
            enableSystem
            defaultTheme="system"
          >
            <SocketContextProvider>
              <ModalProvider />
              <QueryProvider>{children}</QueryProvider>
            </SocketContextProvider>
          </ThemeProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
