import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface LuxMenuItem {
  label: string;
  href: string;
  number: string;
}

interface LuxPageWrapperProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  items: LuxMenuItem[];
  className?: string;
}

export function LuxPageWrapper({
  title,
  subtitle,
  icon: Icon,
  items,
  className,
}: LuxPageWrapperProps) {
  return (
    <div className={cn("max-w-4xl mx-auto px-8 pt-24 pb-48 animate-in fade-in duration-1000", className)}>
      {/* Header Central Minimaliste */}
      <div className="flex flex-col items-center text-center space-y-8 mb-24">
        <div className="h-12 w-12 border-[0.5px] border-border flex items-center justify-center grayscale opacity-50">
          <Icon className="h-5 w-5" strokeWidth={1} />
        </div>
        <div className="space-y-3">
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[10px] font-light tracking-[0.4em] uppercase text-muted-foreground opacity-60">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Menu Typographique "Étoilé" */}
      <nav className="max-w-md mx-auto">
        <ul className="space-y-0 border-t-[0.5px] border-border">
          {items.map((item) => (
            <li key={item.href} className="border-b-[0.5px] border-border">
              <a
                href={item.href}
                className="
                  group flex items-center justify-between py-8 px-4
                  hover:bg-accent transition-all duration-500
                "
              >
                <div className="flex items-center gap-8">
                  <span className="text-[10px] font-black opacity-20 group-hover:opacity-100 transition-opacity">
                    {item.number}
                  </span>
                  <span className="text-sm font-light tracking-[0.2em] uppercase group-hover:tracking-[0.3em] transition-all duration-700">
                    {item.label}
                  </span>
                </div>
                <div className="h-px w-0 bg-foreground group-hover:w-12 transition-all duration-1000 opacity-20" />
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Finition Bas de Page */}
      <div className="mt-32 text-center">
        <div className="inline-block h-12 w-px bg-border opacity-20" />
      </div>
    </div>
  );
}
