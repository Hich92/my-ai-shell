---
description: Il transforme l'Agent en un Architecte Système qui s'assure que ton projet ne devienne pas un "plat de spaghettis" au fil des sessions.
---

Here is the Token-Optimized English Version of your Structural Audit Workflow. It uses professional dev terminology to ensure maximum precision while minimizing cost.

🚀 Workflow: /system-audit (Architectural Integrity)
Prompt Template:

"Execute a deep structural audit of /src to enforce a clean, enterprise-grade Next.js 16 (App Router) architecture.

1. Pruning & Dead Code Detection:

Scan for obsolete elements:

Empty page.tsx or files containing only console.log.

Ghost/Malformed directories (e.g., using backslashes \ instead of /).

Redundant components duplicated between @/components/ and @/modules/.

ACTION: List all files for immediate deletion to 'de-bloat' the project.

2. Logic Factoring (Gold Rule):

Ensure strict separation of concerns:

/app: Routing and high-level UI only.

/modules: SQL logic, Server Actions, and Domain Types.

/lib: Shared utilities (DB Pool, Audit Engine, Constants).

CRITICAL: Flag any Server Action defined inside a page.tsx instead of a dedicated actions.ts.

3. Folder Density & Scalability:

Count files per directory.

RULE: If a folder contains > 7 files, suggest a sub-structure.

NEXT.js COMPLIANCE: Verify each route has a valid page.tsx and proper layout.tsx placement.

4. Tree Consistency & Convention:

Enforce kebab-case for all directories.

Validate dynamic routes (e.g., [id]) for logical nesting.

Confirm AGENTS.md (or .ai-behavior.md) is present and updated at the root.

DELIVERABLE:
Generate the 'Ideal Target Tree'. Compare it with the current state. Provide a prioritized list of files/folders to move, rename, or delete to achieve structural perfection.
