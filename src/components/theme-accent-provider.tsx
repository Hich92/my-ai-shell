"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type AccentColor = "slate" | "amber" | "emerald" | "cobalt" | "rose" | "red" | "violet" | "green";

interface AccentColorValue {
  l: string;
  c: string;
  h: string;
}

const ACCENT_COLORS: Record<AccentColor, AccentColorValue> = {
  slate: { l: "0.45", c: "0.05", h: "250" }, // Deep Slate (Neutral)
  amber: { l: "0.79", c: "0.15", h: "85" },   // Vivid Gold/Yellow
  emerald: { l: "0.65", c: "0.20", h: "160" }, // Bright Emerald
  cobalt: { l: "0.55", c: "0.25", h: "260" },  // Deep Cobalt Blue
  rose: { l: "0.62", c: "0.22", h: "0" },      // Vibrant Rose
  red: { l: "0.58", c: "0.25", h: "28" },      // Pure Red
  violet: { l: "0.55", c: "0.22", h: "300" },  // Rich Violet
  green: { l: "0.72", c: "0.25", h: "145" },   // Neon Green
};

interface ThemeAccentContextType {
  accent: AccentColor | "monochrome";
  setAccent: (accent: AccentColor | "monochrome") => void;
}

const ThemeAccentContext = createContext<ThemeAccentContextType | undefined>(undefined);

export function ThemeAccentProvider({ children }: { children: ReactNode }) {
  const [accent, setAccentState] = useState<AccentColor | "monochrome">("monochrome");

  // Load from localStorage (Client-only)
  useEffect(() => {
    const savedAccent = localStorage.getItem("ai-shell-accent") as AccentColor | "monochrome";
    if (savedAccent && (ACCENT_COLORS[savedAccent as AccentColor] || savedAccent === "monochrome")) {
      setAccentState(savedAccent);
    }
  }, []);

  const setAccent = (newAccent: AccentColor | "monochrome") => {
    setAccentState(newAccent);
    localStorage.setItem("ai-shell-accent", newAccent);
  };

  // Apply CSS Variables
  useEffect(() => {
    const root = document.documentElement;
    
    if (accent === "monochrome") {
      // Revert to Pure Black/White
      root.style.removeProperty("--primary");
      root.style.removeProperty("--primary-foreground");
      root.style.removeProperty("--border");
      root.style.removeProperty("--ring");
    } else {
      const values = ACCENT_COLORS[accent];
      const isDark = root.classList.contains("dark");
      
      // 1. Primary Accent (Bold)
      const primaryValue = `oklch(${values.l} ${values.c} ${values.h})`;
      root.style.setProperty("--primary", primaryValue);
      root.style.setProperty("--primary-foreground", parseFloat(values.l) > 0.7 ? "oklch(0 0 0)" : "oklch(1 0 0)");
      root.style.setProperty("--ring", primaryValue);

      // 2. Tinted Border (The "Gray Lines" requested by the user)
      // L: very low for dark mode (0.15), very high for light mode (0.92)
      // C: subtle chroma (0.04 - 0.06)
      const borderL = isDark ? "0.15" : "0.92";
      const borderC = isDark ? "0.06" : "0.03";
      root.style.setProperty("--border", `oklch(${borderL} ${borderC} ${values.h})`);
    }
  }, [accent]);

  return (
    <ThemeAccentContext.Provider value={{ accent, setAccent }}>
      {children}
    </ThemeAccentContext.Provider>
  );
}

export function useAccent() {
  const context = useContext(ThemeAccentContext);
  if (context === undefined) {
    throw new Error("useAccent must be used within a ThemeAccentProvider");
  }
  return context;
}
