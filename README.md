# 🤖 AI-Shell OS | Système Opérationnel Intelligent (ERP)

> **Statut du Projet :** Phase 1 - Fondations & Module ORG (Opérationnel)  
> **Architecture :** Next.js 16 (Turbopack) | PostgreSQL (Multi-Schema) | Tailwind v4 (OKLCH)

---

## 📍 1. État des Lieux : "Où en sommes-nous ?"

Le projet a franchi avec succès la **Phase de Fondations Critiques**. Contrairement à un ERP standard, cet OS repose sur une base de données **Souveraine**, **Typée** et entièrement **Auditable**.

### ✅ Fondations Techniques (Terminées)
- **Base de Données Relationnelle** : Implémentation de PostgreSQL avec une stratégie de nommage industrielle.
- **Architecture UUID** : Migration complète vers des IDs de type UUID (`gen_random_uuid()`) pour une sécurité accrue et une scalabilité facilitée.
- **Système d'Audit Centralisé** : Chaque écriture (`INSERT`, `UPDATE`) est tracée dans le schéma `core.t_audit` (Contenu : UserID, Action, Timestamp, Détails JSON).
- **Design System "Blue Enterprise"** : Identité visuelle haute performance basée sur le format **OKLCH** (Luminosité perçue constante) offrant un rendu "SaaS Premium" sur fond blanc pur.

### ✅ Module ORG - Registre des Contacts (Opérationnel)
- **Gestion des Entités** : CRUD complet (Création, Lecture, Mise à jour, Archivage).
- **Logique Parent/Enfant** : Capacité native de lier des individus (collaborateurs) à des sociétés (B2B Ready).
- **Soft-Delete (Archive)** : Système d'archivage sécurisé permettant la restauration des données sans rupture d'intégrité référentielle.
- **Dashboard Contextuel** : Interface de pilotage avec recherche dynamique (Search Scope) et filtrage.

---

## 🚀 2. Roadmap : "Ce qu'on va faire"

L'objectif est de transformer ce registre en un **Système Opérationnel complet**. Voici les prochaines étapes prioritaires :

### 🔐 Phase 2 : Sécurité & Souveraineté (À venir)
- **Authentification Native (Auth.js v5)** : Intégration d'un système de login sécurisé sans dépendance SaaS tierce (Données stockées localement).
- **RBAC (Role-Based Access Control)** : Gestion des droits d'accès (Admin, Manager, User) synchronisée avec le module ORG.
- **Audit Identifié** : Liaison de chaque log d'audit à l'utilisateur connecté pour une traçabilité totale.

### 📄 Phase 3 : Module DMS (Document Management System)
- **Ingestion Intelligente** : Upload de documents et liaison automatique avec les entités du registre.
- **Validation Workflow** : Système d'approbation et de signature via Beth (IA contextuelle).

### 💰 Phase 4 : Module FIN (Finance & Extraction)
- **Extraction Automatique** : Analyse OCR de factures et documents financiers.
- **Registre de Paiement** : Liaison entre les flux monétaires et les entités du module ORG.

---

## 🛠️ Stack Technique

| Composant | Technologie |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router) |
| **Base de données** | PostgreSQL 16+ (Dockerized) |
| **Style** | Tailwind CSS v4 |
| **Format Couleur** | OKLCH (Enterprise Blue) |
| **Composants** | Shadcn/UI |
| **Icônes** | Lucide React |
| **Audit** | Logique SQL Native (Schema `core`) |

---

## 📂 Structure du Projet

```text
src/
 ├── app/               # Navigation & Pages (Dashboard, Contacts)
 ├── components/        # UI Components (Shadcn, Shared)
 ├── lib/               # Drivers de base de données (Pool PG)
 ├── modules/           # Logique métier par domaine (Actions Server-side)
 └── .agents/           # Workflows d'automatisation et d'audit de code
