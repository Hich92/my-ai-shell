"use server";

export async function getAppLogs() {
  // Console système neutralisée (en attente du rewrite pg)
  return ["[INFO] Console Système isolée avec succès. La bascule SQL pure est prioritaire sur la journalisation."];
}
