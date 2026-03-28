"use client";

import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Send } from "lucide-react";
import { askBeth } from "@/lib/beth-service";
import { SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export function BethChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init-1",
      role: "assistant",
      content: "Bonjour ! Je suis Beth, votre assistante IA souveraine. En quoi puis-je vous aider ?",
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const bethResponse = await askBeth(userMsg.content);
      const assistantMsg: Message = { id: Date.now().toString() + "-ai", role: "assistant", content: bethResponse };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = { id: Date.now().toString() + "-err", role: "assistant", content: "Désolé, une disjonction est apparue sur la liaison au serveur." };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <SheetContent className="w-[400px] sm:w-[500px] flex flex-col p-0 border-l border-border bg-card">
      <SheetHeader className="p-4 border-b bg-muted/20 shrink-0">
        <div className="flex items-center gap-3">
           <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
              <Sparkles className="h-5 w-5" />
           </div>
           <div className="text-left">
             <SheetTitle className="font-semibold text-lg">Assistant Beth</SheetTitle>
             <SheetDescription className="text-xs">Intelligence Artificielle de votre OS</SheetDescription>
           </div>
        </div>
      </SheetHeader>

      <ScrollArea className="flex-1 p-4 bg-slate-50/50">
        <div className="flex flex-col gap-4">
            {messages.map((msg) => (
            msg.role === "assistant" ? (
                <div key={msg.id} className="flex gap-3 max-w-[85%]">
                    <div className="h-8 w-8 rounded-full bg-primary shrink-0 flex items-center justify-center text-primary-foreground">
                    <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="bg-card shadow-sm p-3 rounded-2xl rounded-tl-sm text-sm border whitespace-pre-wrap leading-relaxed text-foreground">
                    {msg.content}
                    </div>
                </div>
            ) : (
                <div key={msg.id} className="flex gap-3 max-w-[85%] self-end flex-row-reverse">
                    <div className="h-8 w-8 rounded-full bg-slate-200 border border-slate-300 shrink-0 flex items-center justify-center font-bold text-slate-600 text-[10px]">
                    HA
                    </div>
                    <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-tr-sm text-sm shadow-sm whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                    </div>
                </div>
            )
            ))}

            {isLoading && (
                <div className="flex gap-3 max-w-[85%]">
                    <div className="h-8 w-8 rounded-full bg-primary shrink-0 flex items-center justify-center text-primary-foreground">
                    <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="bg-card shadow-sm p-3 rounded-2xl rounded-tl-sm text-sm border flex items-center gap-2 text-muted-foreground italic font-medium">
                    <span className="animate-spin h-3 w-3 border-2 border-primary border-t-transparent rounded-full"></span>
                    En cours de traitement...
                    </div>
                </div>
            )}
            <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="p-4 bg-card border-t shrink-0">
        <div className="flex items-center gap-2">
            <Input 
                placeholder="Discuter avec Beth..." 
                className="flex-1 rounded-full bg-muted/50 border-muted-foreground/20 px-4 h-11"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
            />
            <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()} size="icon" className="rounded-full shadow-md shrink-0 h-11 w-11 bg-primary hover:bg-primary/90">
                <Send className="h-4 w-4" />
            </Button>
        </div>
      </div>
    </SheetContent>
  );
}
