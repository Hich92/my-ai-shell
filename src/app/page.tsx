"use client";

import { 
  Users, 
  Wallet, 
  FileBox, 
  ShieldCheck, 
  Settings,
  Sparkles,
  type LucideIcon
} from "lucide-react";
import Link from "next/link";

interface NavApp {
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
  isFuture: boolean;
  tag?: string;
}

const apps: NavApp[] = [
  { 
    name: "Global Registry", 
    description: "sys_org.entities · Core Directory",
    icon: Users, 
    href: "/contacts", 
    isFuture: false, 
    tag: "ENTITIES" 
  },
  { 
    name: "Finance Console", 
    description: "sys_fin.ledger · Ledger Processing",
    icon: Wallet, 
    href: "/finance", 
    isFuture: true, 
    tag: "LEDGER" 
  },
  { 
    name: "DMS Storage", 
    description: "sys_io.vault · Archival System",
    icon: FileBox, 
    href: "/dms", 
    isFuture: true, 
    tag: "VAULT" 
  },
  { 
    name: "Audit Trail", 
    description: "sys_log.compliance · Security Logs",
    icon: ShieldCheck, 
    href: "/audit", 
    isFuture: true, 
    tag: "SECURITY" 
  },
  { 
    name: "Beth AI Hub", 
    description: "sys_cog.nexus · Intelligence Hub",
    icon: Sparkles, 
    href: "/beth", 
    isFuture: true, 
    tag: "COGNITIVE" 
  },
  { 
    name: "System Settings", 
    description: "sys_conf.global · Environment",
    icon: Settings, 
    href: "/settings", 
    isFuture: true 
  },
];

function Item({ app }: { app: NavApp }) {
  const Icon = app.icon;
  
  return (
    <Link 
      href={app.href}
      className={`
        group relative flex flex-col p-8 min-h-[14rem]
        border bg-card/40 hover:bg-muted/40 transition-all duration-300 rounded-xl shadow-none
        ${app.isFuture ? "opacity-40 grayscale cursor-not-allowed border-dashed" : "hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5"}
      `}
      onClick={(e) => app.isFuture && e.preventDefault()}
    >
      <div className="flex items-start justify-between mb-auto">
        <div className={`
          flex h-12 w-12 items-center justify-center rounded-lg border bg-background/50 shadow-sm
          transition-all group-hover:scale-110
          ${!app.isFuture && "group-hover:border-primary/30 group-hover:bg-primary/5"}
        `}>
          <Icon className={`h-6 w-6 text-muted-foreground transition-colors ${!app.isFuture && "group-hover:text-primary"}`} />
        </div>
        
        {app.tag && (
          <span className="text-[9px] font-black tracking-[0.2em] text-muted-foreground uppercase opacity-40 group-hover:opacity-100 transition-opacity">
            {app.tag}
          </span>
        )}
      </div>
      
      <div className="mt-8 space-y-1.5">
        <h3 className="text-sm font-bold tracking-tight uppercase group-hover:text-foreground transition-colors">
          {app.name}
        </h3>
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight line-clamp-1 opacity-70">
          {app.description}
        </p>
      </div>

      {!app.isFuture && (
        <div className="absolute top-4 right-4">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        </div>
      )}
    </Link>
  );
}

export default function HomePage() {
  return (
    <main className="container mx-auto max-w-7xl px-8 md:px-12 py-16 space-y-20 animate-in fade-in duration-1000">
      
      {/* Title / Intro */}
      <div className="space-y-4 max-w-xl">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">
          AI Shell Hub
        </h1>
        <p className="text-[10px] font-bold tracking-[0.3em] text-muted-foreground uppercase opacity-40">
          Zen Mode • Master Navigation Hub • Operational Control
        </p>
      </div>

      {/* Grid Launcher - Master Navigation Template */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app) => (
          <Item key={app.name} app={app} />
        ))}
      </div>

      {/* Launcher Footer */}
      <div className="pt-12 flex items-center justify-between border-t border-muted/30">
        <p className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase opacity-25">
          sys_control.m_hub · Standard Release v1.0
        </p>
        <div className="flex items-center gap-4 text-[9px] font-black tracking-[0.2em] text-muted-foreground uppercase opacity-30">
          <span>Staging</span>
          <div className="h-1 w-8 bg-muted rounded-full overflow-hidden">
             <div className="h-full w-1/3 bg-primary" />
          </div>
          <span>Production</span>
        </div>
      </div>
    </main>
  );
}