"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Percent, ShieldAlert, CheckSquare, Sparkles, Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { askBeth } from "@/lib/beth-service";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init-1",
      role: "assistant",
      content: "Bonjour ! Je suis Beth. J'ai remarqué que vous aviez 24 documents en attente de validation dans l'espace \"Validation Contrats\". Souhaitez-vous que je réalise une pré-analyse sur ce lot pour lever certains doutes ?",
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll vers le bas quand un message s'ajoute
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
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto h-[calc(100vh-8rem)]">
      <div className="flex flex-col gap-1 shrink-0">
        <h1 className="text-3xl font-bold tracking-tight">Pilotage Global</h1>
        <p className="text-muted-foreground italic">Environnement de supervision supervisée et intelligence artificielle</p>
      </div>

      {/* KPIs / Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">14,302</div>
            <p className="text-xs text-muted-foreground mt-1">+12% depuis le mois dernier</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Taux de précision</CardTitle>
            <Percent className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">98.2%</div>
            <p className="text-xs text-muted-foreground mt-1">Modèles souverains v3.1</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">À valider</CardTitle>
            <CheckSquare className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">Nécessite une supervision</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Alertes</CardTitle>
            <ShieldAlert className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1</div>
            <p className="text-xs text-destructive mt-1 font-medium">Anomalie détectée en ingestion</p>
          </CardContent>
        </Card>
      </div>

      {/* Chat Assistant Beth */}
      <div className="flex-1 min-h-0 border bg-card shadow-sm rounded-xl overflow-hidden flex flex-col">
        <div className="bg-primary/5 border-b p-4 flex items-center gap-3 shrink-0">
           <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
              <Sparkles className="h-5 w-5" />
           </div>
           <div>
             <h2 className="font-semibold text-lg">Assistant Beth</h2>
             <p className="text-xs text-muted-foreground">Analyste souveraine de vos données</p>
           </div>
        </div>

        <ScrollArea className="flex-1 p-6">
           <div className="flex flex-col gap-6">
              {messages.map((msg) => (
                msg.role === "assistant" ? (
                  <div key={msg.id} className="flex gap-4 max-w-[80%]">
                     <div className="h-8 w-8 rounded-full bg-primary shrink-0 flex items-center justify-center text-primary-foreground">
                        <Sparkles className="h-4 w-4" />
                     </div>
                     <div className="bg-muted p-4 rounded-2xl rounded-tl-sm text-sm border whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                     </div>
                  </div>
                ) : (
                  <div key={msg.id} className="flex gap-4 max-w-[80%] self-end flex-row-reverse">
                     <div className="h-8 w-8 rounded-full bg-slate-200 border border-slate-300 shrink-0 flex items-center justify-center font-bold text-slate-600 text-xs">
                        HA
                     </div>
                     <div className="bg-primary text-primary-foreground p-4 rounded-2xl rounded-tr-sm text-sm shadow-sm whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                     </div>
                  </div>
                )
              ))}

              {isLoading && (
                  <div className="flex gap-4 max-w-[80%]">
                     <div className="h-8 w-8 rounded-full bg-primary shrink-0 flex items-center justify-center text-primary-foreground">
                        <Sparkles className="h-4 w-4" />
                     </div>
                     <div className="bg-muted p-4 rounded-2xl rounded-tl-sm text-sm border flex items-center gap-2">
                        <span className="animate-spin h-3 w-3 border-2 border-primary border-t-transparent rounded-full"></span>
                        <span className="text-muted-foreground italic font-medium">Beth réfléchit...</span>
                     </div>
                  </div>
              )}
              <div ref={scrollRef} />
           </div>
        </ScrollArea>

        <div className="p-4 bg-card border-t shrink-0">
           <div className="flex items-center gap-3 max-w-5xl mx-auto">
              <Input 
                 placeholder="Demander à Beth d'analyser un flux, générer un rapport de KPI, extraire..." 
                 className="flex-1 rounded-full bg-muted/30 border-muted-foreground/20 px-6 h-12"
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onKeyDown={handleKeyDown}
                 disabled={isLoading}
              />
              <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()} size="icon" className="rounded-full shadow-md shrink-0 h-12 w-12 bg-primary hover:bg-primary/90">
                 <Send className="h-5 w-5" />
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
}