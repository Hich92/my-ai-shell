# ⚠️ NEXT.JS 16 & PRISMA 7 - PROTOCOLE AGENT

## 1. RUPTURE DE PARADIGME (NEXT.JS 16)

- **STRICT ROUTING** : Le `App Router` standard est obsolète. Réfère-toi exclusivement aux schémas de `node_modules/next/dist/docs/`.
- **DATA FETCHING** : Utilisation exclusive des `Server Components` par défaut. Toute interactivité Client (Beth) doit être isolée dans des fichiers `.client.tsx` (nouvelle convention potentielle).
- **HYDRATION** : Ne jamais utiliser `useEffect` pour corriger l'hydratation ; utiliser les nouveaux hooks natifs de la v16.

## 2. CONFIGURATION PRISMA 7 (BREAKING)

- **SCHEMA ISOLATION** : Le fichier `schema.prisma` ne contient PLUS de secrets ou d'URLs.
- **DYNAMIC ADAPTERS** : La connexion se fait via `prisma.config.ts`. Si tu tentes d'injecter `env("DATABASE_URL")` dans le schéma, tu échoueras (Erreur P1012).
- **SINGLETON PATTERN** : L'instanciation du `PrismaClient` doit obligatoirement passer par un gestionnaire d'état global pour éviter les fuites mémoire en Next.js 16.

## 3. DESIGN SYSTEM "AI-SHELL"

- **COMPOSANTS** : Utilise uniquement les primitives de `/src/components/ui/`.
- **FUTURE-PROOF** : Obligation d'implémenter le mode "Ghost" (`opacity-50`) pour toute feature non-mappée en DB.
