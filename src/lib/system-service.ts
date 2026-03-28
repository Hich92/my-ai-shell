"use server";

export async function getAppLogs(): Promise<string[]> {
  // Simule une petite latence réseau et d'accès disque
  await new Promise(resolve => setTimeout(resolve, 800));

  const now = new Date();
  const formatTime = (minusMinutes: number) => {
    const d = new Date(now.getTime() - minusMinutes * 60000);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
  };

  const logs = [
    `[INFO] ${formatTime(45)} - Démarrage du système AI-Shell sécurisé v1.2.0`,
    `[INFO] ${formatTime(44)} - Initialisation des modules de gouvernance... OK`,
    `[INFO] ${formatTime(44)} - Montage des volumes de stockage chiffrés... OK`,
    `[DEBUG] ${formatTime(30)} - Appel système: synchronisation des règles d'audit IAM`,
    `[INFO] ${formatTime(15)} - Agent utilisateur local authentifié avec succès via token JWT`,
    `[INFO] ${formatTime(12)} - Démon d'ingestion opérationnel (port 3000)`,
    `[WARN] ${formatTime(10)} - Tolérance réseau faible vers l'API externe (Latence: 124ms observée)`,
    `[INFO] ${formatTime(5)} - Connexion Moondust établie avec succès sur https://api.moondust.cloud`,
    `[DEBUG] ${formatTime(2)} - Extraction document #124 assignée au processeur A100-04`,
    `[INFO] ${formatTime(1)} - LLM (llama3.2:latest) context chargé en mémoire (2.1GB)`,
    `[INFO] ${formatTime(0)} - Requête /chat/completions validée et renvoyée avec succès (823ms)`,
  ];

  // Ajoute 1 à 3 logs aléatoires "en direct"
  const extraEvents = Math.floor(Math.random() * 3) + 1;
  const currentFormat = formatTime(0);
  
  for (let i = 0; i < extraEvents; i++) {
     const types = ['INFO', 'DEBUG'];
     const t = types[Math.floor(Math.random() * types.length)];
     logs.push(`[${t}] ${currentFormat} - Télémétrie système : Ping heartbeat OK (${Math.floor(Math.random() * 20) + 1}ms)`);
  }

  return logs;
}
