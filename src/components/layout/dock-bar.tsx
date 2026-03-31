"use client";

import { type ReactNode } from "react";

interface DockBarProps {
  children: ReactNode;
}

/**
 * DockBar — Dock macOS fixe en bas au centre de la page.
 * Reçoit les actions (boutons) en children et les affiche
 * dans une pill glassmorphism avec effets de scale au survol.
 */
export function DockBar({ children }: DockBarProps) {
  return (
    <div
      id="entity-dock"
      className="
        fixed bottom-6 left-1/2 -translate-x-1/2 z-40
        flex items-end gap-3 px-5 py-3
        bg-white/80 backdrop-blur-xl
        border border-border/60
        shadow-[0_8px_32px_oklch(0.2_0.02_250_/_0.12),0_2px_8px_oklch(0.2_0.02_250_/_0.06)]
        rounded-2xl
      "
      role="toolbar"
      aria-label="Actions de l'entité"
    >
      {children}
    </div>
  );
}

/**
 * DockItem — Wrapper pour chaque action du Dock.
 * Applique l'effet macOS de scale et tooltip au survol.
 */
export function DockItem({ children }: { children: ReactNode }) {
  return (
    <div
      className="
        group relative flex flex-col items-center
        transition-transform duration-150 ease-out
        hover:-translate-y-1 hover:scale-110
      "
    >
      {children}
    </div>
  );
}
