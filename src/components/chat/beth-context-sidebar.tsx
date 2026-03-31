"use client";

import { useState } from "react";
import { 
  Book, 
  BarChart3, 
  Gavel, 
  FileText, 
  Settings2, 
  Cpu,
  Info
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const AGENTS = [
  { id: "archivist", name: "Archivist (Beth)", icon: Book, desc: "Knowledge management & archives" },
  { id: "manager", name: "Manager (Reporting)", icon: BarChart3, desc: "Operational analysis & synthesis" },
  { id: "compliance", name: "Compliance (Legal)", icon: Gavel, desc: "Regulatory verification & risk" },
  { id: "presales", name: "Presales (Offers)", icon: FileText, desc: "Proposal & quote generation" },
];

export function BethContextSidebar() {
  const [selectedAgent, setSelectedAgent] = useState("archivist");
  const [temperature, setTemperature] = useState([0.7]);
  const [maxLength, setMaxLength] = useState([2048]);

  const CurrentAgentIcon = AGENTS.find(a => a.id === selectedAgent)?.icon || Cpu;

  return (
    <aside className="h-full flex flex-col bg-background border-l-[0.5px] border-border w-80 animate-in slide-in-from-right duration-700">
      <ScrollArea className="flex-1">
        <div className="p-8 space-y-12">
          
          {/* Agent Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 opacity-40">
              <Settings2 className="h-3 w-3" strokeWidth={1} />
              <span className="text-[9px] font-black uppercase tracking-[0.3em]">Agent Configuration</span>
            </div>
            
            <div className="space-y-4">
              <label className="text-[10px] font-light uppercase tracking-widest text-muted-foreground/60">
                Active Agent
              </label>
              <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                <SelectTrigger className="w-full bg-muted/50 border-border border-[0.5px]">
                  <div className="flex items-center gap-3">
                    <CurrentAgentIcon className="h-3.5 w-3.5 opacity-60" strokeWidth={1} />
                    <SelectValue placeholder="Select an agent" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  <SelectGroup>
                    <SelectLabel>AI Echelon Models</SelectLabel>
                    {AGENTS.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id} className="focus:bg-muted">
                        <div className="flex items-center gap-3">
                          <agent.icon className="h-3 w-3" strokeWidth={1} />
                          <span>{agent.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p className="text-[9px] font-light leading-relaxed text-muted-foreground/40 italic">
                {AGENTS.find(a => a.id === selectedAgent)?.desc}
              </p>
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Parameters Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 opacity-40">
              <Cpu className="h-3 w-3" strokeWidth={1} />
              <span className="text-[9px] font-black uppercase tracking-[0.3em]">Cognitive Engine</span>
            </div>

            {/* Temperature */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-light uppercase tracking-widest text-muted-foreground/60">
                  Temperature
                </label>
                <span className="text-[10px] font-black text-muted-foreground">{temperature[0]}</span>
              </div>
              <Slider 
                value={temperature} 
                onValueChange={setTemperature} 
                max={1.0} 
                step={0.1}
                className="py-4"
              />
              <div className="flex justify-between text-[8px] uppercase tracking-tighter opacity-20 font-black">
                <span>Precision</span>
                <span>Creativity</span>
              </div>
            </div>

            {/* Max Length */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-light uppercase tracking-widest text-muted-foreground/60">
                  Max Tokens
                </label>
                <span className="text-[10px] font-black text-muted-foreground">{maxLength[0]}</span>
              </div>
              <Slider 
                value={maxLength} 
                onValueChange={setMaxLength} 
                min={256}
                max={4096} 
                step={256}
                className="py-4"
              />
            </div>
          </div>

        </div>
      </ScrollArea>

      {/* Footer Info */}
      <div className="p-6 border-t-[0.5px] border-border bg-muted/30">
        <div className="flex items-center gap-3 opacity-20 grayscale">
          <Info className="h-3 w-3" strokeWidth={1} />
          <span className="text-[8px] font-black uppercase tracking-[0.4em]">Sovereignty Validated</span>
        </div>
      </div>
    </aside>
  );
}
