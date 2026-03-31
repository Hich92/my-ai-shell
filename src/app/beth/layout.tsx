import { ThemeProvider } from "@/components/theme-provider";

export default function BethLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
      <div className="h-full w-full bg-[#000000] text-zinc-100">
        {children}
      </div>
    </ThemeProvider>
  );
}
