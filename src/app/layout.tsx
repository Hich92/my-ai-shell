import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/layout/Header";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { AppStatusBar } from "@/components/layout/app-status-bar";
import { ThemeAccentProvider } from "@/components/theme-accent-provider";
import { BreadcrumbProvider } from "@/components/layout/breadcrumb-context";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Shell - Command Center",
  description: "Sovereign Intelligence Processing System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex text-sm transition-all duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeAccentProvider>
            <TooltipProvider>
              <SidebarProvider>
                <BreadcrumbProvider>
                  <AppSidebar />
                  <SidebarInset className="flex flex-col flex-1 h-screen overflow-hidden bg-muted/50">
                    <Suspense fallback={<div className="h-14 border-b bg-background" />}>
                      <Header />
                      <main className="flex-1 overflow-y-auto pb-9">
                        {children}
                      </main>
                    </Suspense>
                    <AppStatusBar />
                  </SidebarInset>
                </BreadcrumbProvider>
              </SidebarProvider>
            </TooltipProvider>
          </ThemeAccentProvider>
        </ThemeProvider>
        <Toaster position="bottom-center" richColors />
      </body>
    </html>
  );
}
