"use client";

import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Send } from "lucide-react";
import { SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { getChatHistory, sendMessage, MessageDto } from "@/modules/chat/actions";

export function BethChatPanel() {
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Data fetching: Chargement de l'historique au montage
  useEffect(() => {
    async function loadHistory() {
      try {
        const history = await getChatHistory();
        if (history.length === 0) {
          // Message d'accueil par défaut si la base est vide
          setMessages([
            {
              id: "init-1",
              role: "assistant",
              content: "Bonjour ! Je suis Beth, votre assistante IA souveraine. Historique initialisé.",
              createdAt: new Date()
            }
          ]);
        } else {
          setMessages(history);
        }
      } catch (err) {
        console.error("Impossible de charger l'historique", err);
      } finally {
        setIsInitialized(true);
      }
    }
    loadHistory();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const currentInput = input.trim();
    // Affichage optimiste du message utilisateur
    const optimisticUserMsg: MessageDto = { 
        id: "temp-" + Date.now(), 
        role: "user", 
        content: currentInput,
        createdAt: new Date()
    };
    
    setMessages((prev) => [...prev, optimisticUserMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Exécution de la Server Action (Data Mutation)
      const newMessages = await sendMessage(currentInput);
      
      // On remplace le message optimiste par la réalité de la DB, et on y ajoute la réponse de l'IA.
      setMessages((prev) => {
        const filtered = prev.filter(m => m.id !== optimisticUserMsg.id);
        return [...filtered, ...newMessages];
      });
    } catch (error) {
      console.error(error);
      const errorMsg: MessageDto = { 
          id: "err-" + Date.now(), 
          role: "assistant", 
          content: "Désolé, une disjonction est apparue sur la liaison au serveur. (Audit enregistré)",
          createdAt: new Date()
      };
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
            {!isInitialized && (
                <div className="flex justify-center items-center text-xs text-muted-foreground animate-pulse p-4">
                    Synchronisation avec le noyau central...
                </div>
            )}
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
                disabled={isLoading || !isInitialized}
            />
            <Button onClick={handleSendMessage} disabled={isLoading || !input.trim() || !isInitialized} size="icon" className="rounded-full shadow-md shrink-0 h-11 w-11 bg-primary hover:bg-primary/90">
                <Send className="h-4 w-4" />
            </Button>
        </div>
      </div>
    </SheetContent>
  );
}
