"use client";

import { useState, useTransition } from "react";
import { History, MessageSquare, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { createNote } from "@/modules/core/actions";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface Note {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
}

interface ChatterProps {
  entityId: string;
  notes: Note[];
}

export function Chatter({ entityId, notes }: ChatterProps) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    startTransition(async () => {
      const result = await createNote(entityId, content);
      if (result.success) {
        setContent("");
        toast.success("Note added to system logs");
      } else {
        toast.error("Failed to sync note");
      }
    });
  };

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
      {/* SECTION HEADER: CHATTER SOURCE */}
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50 flex items-center gap-2">
          <History className="h-3 w-3" />
          SYSTEM CHATTER · core.t_notes
        </h3>
      </div>

      {/* NOTES LIST: SCROLLABLE */}
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-8 pb-4">
          {notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-20">
              <MessageSquare className="h-8 w-8" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Void Log</p>
            </div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="relative pl-6 border-l border-dashed border-primary/20 hover:border-primary/50 transition-colors group">
                <div className="absolute -left-[5px] top-0 h-2 w-2 rounded-full bg-primary" />
                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-tight text-foreground leading-snug">
                    {note.content}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground uppercase opacity-40 group-hover:opacity-100 transition-opacity">
                      <User className="h-2.5 w-2.5" />
                      {note.author}
                    </span>
                    <span className="text-[9px] font-bold tabular-nums text-muted-foreground/30 uppercase">
                      {formatDistanceToNow(new Date(note.createdAt))} ago
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* FOOTER: QUICK LOG INPUT */}
      <Card className="p-1 border border-dashed bg-muted/40 shadow-none rounded-xl">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Log systemic note..."
            autoComplete="off"
            className="h-10 bg-transparent border-none focus-visible:ring-0 text-[11px] font-medium placeholder:opacity-30"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isPending || !content.trim()}
            className="h-8 w-8 rounded-lg shrink-0"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </form>
      </Card>
      
      <div className="pt-4 border-t border-dashed border-muted-foreground/10 text-center">
        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-20">
          sys_cog.nexus · Operational Log
        </p>
      </div>
    </div>
  );
}
