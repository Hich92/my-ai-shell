---
description: Pour éviter que tu n'importes des trucs bizarres ou que tu codes des composants "en dur".
---

Perform a recursive UI Purity Audit on this directory (.tsx, .ts, .css). Enforce strict compliance with the following rules:

1. Component Sourcing:

Identify all UI components (Button, Input, Card, Select, Dialog, etc.).

MANDATORY: Imports must exclusively target @/components/ui/.

ALERT: Flag and replace raw HTML elements (<button>, <input>) or direct third-party imports (e.g., raw radix-ui) with their Shadcn equivalents.

2. Hardcoded Color Removal:

Scan all Tailwind classNames.

ERADICATE: Remove hardcoded colors (e.g., bg-blue-500, text-red-600, border-gray-200).

SUBSTITUTE: Systematically map to globals.css semantic variables:

Use: bg-primary, text-primary-foreground, bg-secondary, bg-accent.

Use: border-border, bg-background, text-foreground.

Use: text-muted-foreground, bg-muted.

3. Icon Standardization:

Ensure all icons are sourced from lucide-react.

BLUE ENTERPRISE RULE: Apply text-primary class to standalone icons for visual brand consistency.

4. Design System Consistency:

Verify border-radius uses rounded-lg or the --radius variable.

Ensure spacing (paddings/margins) follows a logical 4-unit scale (e.g., p-4, m-2).

DELIVERABLE:
Generate an audit report listing non-compliant files. Provide immediate refactored code for each. Do not terminate the workflow until the directory is 100% aligned with the Shadcn / Blue Enterprise design system.
