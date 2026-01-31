---
name: implement-component
description: Enforce standard workflow for implementing new UI components in VDC Design Hub using Kendo UI. Use this skill when the user asks to create, implement, or add a new component.
---

# Implement Component Workflow

## Purpose
To ensure all new UI components in VDC Design Hub follow a strict "Check Kendo -> Propose -> Implement -> Document" workflow, minimizing custom overrides and maximizing Kendo UI usage.

## Workflow Steps

### 1. Search & Analyze
Before writing any code:
- **Search Kendo UI:** Identify which Kendo Angular component provides the required functionality.
- **Check Existing:** Verify if a VDC wrapper already exists in `assets/data/components.json` or `src/app/vdc-library`.
- **Identify Icons:** Determine which icons are needed and check `assets/tokens/vdc-icons.json` for availability.

### 2. Propose Plan
Present a plan to the user detailing:
- **Kendo Component:** The specific Kendo component(s) to be used (e.g., `kendo-grid`, `kendo-drawer`).
- **New Icons:** Any new icons that need to be added to the collection.
- **Implementation Strategy:** How the component will be integrated (wrapper vs. direct use).
- **Wait for Approval:** Do NOT proceed until the user approves the proposed components.

### 3. Implement
Once approved:
- **Scaffold:** Create the component structure.
- **Integrate:** Use the Kendo component with VDC styling tokens.
- **Avoid Overrides:** Only apply minimal CSS overrides to match VDC branding (colors, fonts). Do not fight the Kendo layout engine.

### 4. Register Icons
If new icons are used:
- Add them to `assets/tokens/vdc-icons.json` under the appropriate category.

### 5. Document
Update `assets/data/components.json` with a new entry:
```json
{
  "name": "VdcComponentName",
  "slug": "vdc-component-slug",
  "description": "Brief description of usage",
  "kendoBase": "kendo-component-name",
  "status": "ready",
  "category": "Component Category",
  "docsUrl": "https://www.telerik.com/kendo-angular-ui/..."
}
```
