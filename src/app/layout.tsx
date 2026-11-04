import type { Metadata } from "next";
import { TRPCReactProvider } from "@/trpc/client";
import { Navbar } from "@/components/layout/navbar";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tasks",
  description: "Task management with Next.js and tRPC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US">
      <body className="flex min-h-screen flex-col font-sans">
        <TRPCReactProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-1 flex place-content-center px-6 py-10">
              <section className="w-full max-w-7xl">{children}</section>
            </main>
          </ToastProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
