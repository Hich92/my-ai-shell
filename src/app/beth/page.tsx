"use client";

import { useState, useRef } from "react";
import { Sparkles, Send, History, Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BethContextSidebar } from "@/components/chat/beth-context-sidebar";
import { cn } from "@/lib/utils";

export default function BethHubPage() {
  const [hasStarted, setHasStarted] = useState(false);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    setHasStarted(true);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* 8/12 - MAIN CHAT ZONE */}
      <div className={cn(
        "flex flex-col flex-1 h-full transition-all duration-1000 bg-[#000000] relative",
        hasStarted ? "w-full" : "items-center justify-center text-center"
      )}>
        
        {/* Local Hub Header */}
        <div className="absolute top-0 left-0 right-0 h-16 border-b-[0.5px] border-zinc-900 bg-[#000000]/80 backdrop-blur-md z-10 flex items-center px-12 justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Beth</span>
            <span className="h-4 w-[1px] bg-zinc-900" />
            <span className="text-[10px] font-light uppercase tracking-widest text-zinc-400">
              Session : {hasStarted ? "6F9A2B...42" : "New Instance"}
            </span>
          </div>
          <div className="flex items-center gap-4 opacity-50">
             <Button variant="ghost" size="sm" className="h-8 rounded-none text-[9px] uppercase tracking-widest gap-2">
               <History className="h-3 w-3" /> History
             </Button>
          </div>
        </div>

        {/* CONTENT: INITIAL (CENTERED) vs ACTIVE (THREAD) */}
        {!hasStarted ? (
          <div className="w-full max-w-2xl px-8 flex flex-col items-center animate-in fade-in zoom-in-95 duration-1000">
            <div className="mb-12 flex flex-col items-center space-y-4">
              <div className="h-12 w-12 border-[0.5px] border-zinc-800 flex items-center justify-center opacity-40">
                <Sparkles className="h-5 w-5" strokeWidth={1} />
              </div>
              <h1 className="text-4xl font-black tracking-tighter uppercase leading-none text-zinc-100">
                How can Beth help you today?
              </h1>
              <p className="text-[10px] font-light tracking-[0.4em] uppercase text-zinc-500">
                Cognitive Integration & Sovereign Processing System
              </p>
            </div>
            
            <div className="w-full relative group">
              <Textarea 
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Initialize a systemic request..."
                className="w-full min-h-[140px] bg-zinc-950/50 border-zinc-900 border-[0.5px] rounded-none p-6 text-sm font-light tracking-wide placeholder:text-zinc-700 focus-visible:ring-0 focus-visible:border-zinc-700 transition-all resize-none"
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-3">
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Press Enter to send
                </span>
                <Button 
                  onClick={handleSend}
                  size="icon" 
                  className="h-8 w-8 rounded-none bg-zinc-100 text-black hover:bg-white transition-all shadow-xl"
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-4 w-full opacity-20 hover:opacity-100 transition-opacity duration-700">
               {[
                 "Analyze system entity registry",
                 "Generate monthly activity report",
                 "Audit compliance risk factors",
                 "Extract data from sys_org.m_entities"
               ].map((hint, idx) => (
                 <button 
                   key={idx}
                   onClick={() => setInput(hint)}
                   className="text-left p-4 border-[0.5px] border-zinc-900 hover:border-zinc-700 transition-all text-[10px] font-light tracking-wider uppercase text-zinc-500 hover:text-zinc-100"
                 >
                   {hint}
                 </button>
               ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col w-full h-full pt-16 animate-in slide-in-from-bottom-8 duration-1000">
            {/* Conversation Thread */}
            <div className="flex-1 overflow-auto p-12 space-y-12 pb-32">
              <div className="flex gap-8 max-w-4xl">
                <div className="h-10 w-10 border-[0.5px] border-zinc-800 shrink-0 flex items-center justify-center uppercase text-[10px] font-black italic">User</div>
                <div className="space-y-4 pt-2">
                  <p className="text-sm font-light tracking-wide text-zinc-200 leading-relaxed">
                    Instantiate a full audit of table sys_org.m_entities and identify orphan entries.
                  </p>
                </div>
              </div>

              <div className="flex gap-8 max-w-4xl animate-in fade-in duration-1000 delay-500">
                <div className="h-10 w-10 border-[0.5px] border-zinc-800 bg-zinc-100 text-black shrink-0 flex items-center justify-center uppercase text-[10px] font-black">Beth</div>
                <div className="space-y-4 pt-2">
                  <p className="text-sm font-light tracking-wide text-zinc-200 leading-relaxed text-balance">
                    Processing... I have identified 14 active entries requiring parentage verification. 
                    <br/><br/>
                    The registry indicates that 3 entities located in Lyon (France) do not have a valid parent ID in the current schema. Would you like me to generate a correction report?
                  </p>
                </div>
              </div>
            </div>

            {/* Sticky Bottom Input */}
            <div className="absolute bottom-0 left-0 right-0 p-8 pt-0 bg-gradient-to-t from-[#000000] via-[#000000]/95 to-transparent">
              <div className="max-w-4xl mx-auto relative group">
                <Textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Beth anything..."
                  className="w-full min-h-[60px] max-h-[200px] bg-zinc-950 border-zinc-900 border-[0.5px] rounded-none p-4 pr-24 text-sm font-light tracking-wide placeholder:text-zinc-700 focus-visible:ring-0 focus-visible:border-zinc-700 transition-all resize-none"
                />
                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-900">
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={handleSend}
                    size="icon" 
                    className="h-8 w-8 rounded-none bg-zinc-100 text-black hover:bg-white transition-all shadow-xl"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="text-center mt-3">
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-700 opacity-50">
                  Tier 4 AI Echelon · Secured by AI-Shell
                </span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 4/12 - CONTEXT SIDEBAR */}
      <BethContextSidebar />
    </div>
  );
}
