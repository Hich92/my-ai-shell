"use client";

import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Sparkles, Send, StickyNote, Activity } from "lucide-react";
import { getChatHistory, sendMessage, MessageDto } from "@/modules/chat/actions";
import { NotesTab } from "./notes-tab";
import { ActivityTab } from "./activity-tab";

// ═══════════════════════════════════════════════════════
// Sous-composant : Onglet BETH AI (chat existant)
// ═══════════════════════════════════════════════════════
function BethAiTab() {
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        const history = await getChatHistory();
        setMessages(
          history.length === 0
            ? [
                {
                  id: "init-1",
                  role: "assistant",
                  content:
                    "Bonjour ! Je suis Beth, votre assistante IA souveraine. Comment puis-je vous aider ?",
                  createdAt: new Date(),
                },
              ]
            : history
        );
      } catch {
        // silently fail — beth is optional
      } finally {
        setIsInitialized(true);
      }
    }
    loadHistory();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const text = input.trim();
    const optimistic: MessageDto = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: text,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setInput("");
    setIsLoading(true);
    try {
      const newMsgs = await sendMessage(text);
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== optimistic.id),
        ...newMsgs,
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: "Liaison interrompue. Réessayez dans un instant.",
          createdAt: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <ScrollArea className="flex-1 px-4 py-3">
        <div className="flex flex-col gap-4">
          {!isInitialized && (
            <div className="flex justify-center py-8 text-xs text-muted-foreground animate-pulse">
              Synchronisation…
            </div>
          )}
          {messages.map((msg) =>
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
                <div className="h-8 w-8 rounded-full bg-accent border border-border shrink-0 flex items-center justify-center font-bold text-primary text-[10px]">
                  HA
                </div>
                <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-tr-sm text-sm shadow-sm whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </div>
              </div>
            )
          )}
          {isLoading && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="h-8 w-8 rounded-full bg-primary shrink-0 flex items-center justify-center text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="bg-card shadow-sm p-3 rounded-2xl rounded-tl-sm text-sm border flex items-center gap-2 text-muted-foreground italic">
                <span className="animate-spin h-3 w-3 border-2 border-primary border-t-transparent rounded-full" />
                En cours de traitement…
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Zone de saisie */}
      <div className="shrink-0 p-3 border-t border-border bg-card">
        <div className="flex items-center gap-2">
          <Input
            id="beth-chat-input"
            placeholder="Discuter avec Beth…"
            className="flex-1 rounded-full bg-muted/50 border-muted-foreground/20 px-4 h-10 text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isLoading || !isInitialized}
          />
          <Button
            id="beth-send-btn"
            onClick={handleSend}
            disabled={isLoading || !input.trim() || !isInitialized}
            size="icon"
            className="rounded-full shrink-0 h-10 w-10 bg-primary hover:bg-primary/90"
            aria-label="Envoyer"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// CompanionPanel — SheetContent principal à 3 onglets
// ═══════════════════════════════════════════════════════
interface CompanionPanelProps {
  /** UUID de l'entité contextualisée (Contact, Projet…). Optionnel hors fiche. */
  targetId?: string;
}

export function CompanionPanel({ targetId }: CompanionPanelProps) {
  return (
    <SheetContent className="w-[420px] sm:w-[480px] flex flex-col p-0 border-l border-border bg-card">
      {/* En-tête identitaire */}
      <SheetHeader className="px-4 pt-4 pb-0 shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="text-left">
            <SheetTitle className="font-semibold text-base leading-tight">
              Compagnon
            </SheetTitle>
            <SheetDescription className="text-[11px] leading-tight">
              Beth AI · Notes · Journal d&apos;activité
            </SheetDescription>
          </div>
        </div>
      </SheetHeader>

      {/* Onglets — occupent tout l'espace restant */}
      <Tabs defaultValue="beth" className="flex flex-col flex-1 min-h-0">
        {/* TabsList collée sous le header */}
        <TabsList className="shrink-0 mx-4 mb-1 h-9 bg-muted/60 rounded-lg grid grid-cols-3 gap-1 p-0.5">
          <TabsTrigger
            id="tab-beth"
            value="beth"
            className="
              h-full text-xs font-semibold rounded-md gap-1.5
              data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
              data-[state=inactive]:text-muted-foreground
              transition-all duration-150
            "
          >
            <Sparkles className="h-3 w-3" />
            Beth AI
          </TabsTrigger>
          <TabsTrigger
            id="tab-notes"
            value="notes"
            className="
              h-full text-xs font-semibold rounded-md gap-1.5
              data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
              data-[state=inactive]:text-muted-foreground
              transition-all duration-150
            "
          >
            <StickyNote className="h-3 w-3" />
            Notes
          </TabsTrigger>
          <TabsTrigger
            id="tab-activity"
            value="activity"
            className="
              h-full text-xs font-semibold rounded-md gap-1.5
              data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
              data-[state=inactive]:text-muted-foreground
              transition-all duration-150
            "
          >
            <Activity className="h-3 w-3" />
            Activité
          </TabsTrigger>
        </TabsList>

        {/* Contenu des onglets — height contrainte pour permettre le scroll interne */}
        <TabsContent value="beth" className="flex-1 flex flex-col min-h-0 mt-0 data-[state=inactive]:hidden">
          <BethAiTab />
        </TabsContent>

        <TabsContent value="notes" className="flex-1 flex flex-col min-h-0 mt-0 data-[state=inactive]:hidden">
          <NotesTab targetId={targetId} />
        </TabsContent>

        <TabsContent value="activity" className="flex-1 flex flex-col min-h-0 mt-0 data-[state=inactive]:hidden">
          <ActivityTab targetId={targetId} />
        </TabsContent>
      </Tabs>
    </SheetContent>
  );
}
