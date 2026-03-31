"use client";

import { createContext, useContext } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EntityFrameContextValue {
  /** L'entité est en mode lecture (false) ou édition (true) */
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  /** UUID de l'entité courante — repassé aux composants qui en ont besoin */
  targetId?: string;
  /**
   * Enregistre le callback de sauvegarde depuis le formulaire enfant.
   * Le Shell l'invoque via CMD+S et les boutons du Dock.
   */
  registerSave: (fn: (andClose: boolean) => Promise<void>) => void;
  /** Déclenche la sauvegarde (appelé par CMD+S ou bouton Dock) */
  triggerSave: (andClose: boolean) => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

export const EntityFrameContext = createContext<EntityFrameContextValue>({
  isEditing: false,
  setIsEditing: () => {},
  targetId: undefined,
  registerSave: () => {},
  triggerSave: async () => {},
});

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Consommez ce hook dans tout composant enfant de EntityFrame
 * pour accéder à l'état d'édition et au callback de sauvegarde.
 */
export function useEntityFrame() {
  return useContext(EntityFrameContext);
}
