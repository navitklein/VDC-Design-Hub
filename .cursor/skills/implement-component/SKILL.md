---
name: implement-component
description: Enforce standard workflow for implementing new UI components in VDC Design Hub using Kendo UI. Use this skill when the user asks to create, implement, or add a new component.
---

# Implement Component Workflow

## Purpose
To ensure all new UI components in VDC Design Hub follow a strict "Check Kendo -> Propose -> Implement -> Document" workflow, minimizing custom overrides and maximizing Kendo UI usage.

## Pre-Implementation Checklist

Before writing ANY code, complete these steps:

- [ ] Identified the Kendo component(s) needed
- [ ] Checked if VDC wrapper exists in `assets/data/components.json`
- [ ] Listed ALL icons needed and verified against `assets/tokens/vdc-icons.json`
- [ ] Clarified interactive states with user (hover, active, disabled, focus)
- [ ] Presented proposal table and received explicit approval

## Workflow Steps

### 1. Search & Analyze
Before writing any code:
- **Search Kendo UI:** Identify which Kendo Angular component provides the required functionality.
- **Check Existing:** Verify if a VDC wrapper already exists in `assets/data/components.json` or `src/app/vdc-library`.
- **Identify Icons:** Determine which icons are needed and check `assets/tokens/vdc-icons.json` for availability.

### 2. Propose Plan

> **STOP AND WAIT** - You MUST present a proposal and receive approval before coding.

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
- **Document incrementally:** Update components.json as you make design decisions.

### 4. Register Icons
If new icons are used:
- Add them to `assets/tokens/vdc-icons.json` under the appropriate category.
- Do this BEFORE using the icon in code, not after.

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

## Post-Implementation Checklist

- [ ] All icons added to `vdc-icons.json`
- [ ] `components.json` updated with templateChanges and designDecisions
- [ ] Demo documentation reflects actual behavior
- [ ] No linter errors

---

## Common Pitfalls to Avoid

### 1. Skipping the Proposal Step
**Problem:** Jumping straight into implementation without confirming components.
**Solution:** Always present the proposal table and wait for explicit "yes" before coding.

### 2. Forgetting Icon Registration
**Problem:** Using icons that aren't in `vdc-icons.json`.
**Solution:** Check icons FIRST. Add any new ones before using them in code.

### 3. Late Documentation
**Problem:** Waiting until the end to document design decisions.
**Solution:** Update `components.json` incrementally as decisions are made.

### 4. Assuming Default States
**Problem:** Implementing only the default state, then fixing hover/active/disabled later.
**Solution:** Ask about all interactive states upfront before implementing.

### 5. Fighting Kendo Styles
**Problem:** Using excessive `!important` rules to override Kendo defaults.
**Solution:** 
- Target Kendo's inner elements correctly (e.g., `.k-button-text`)
- Use CSS variables for theming
- Accept Kendo's layout patterns rather than fighting them

### 6. Not Referencing Production
**Problem:** Implementing based on assumptions instead of actual VDC production behavior.
**Solution:** Ask for screenshots of production when implementing existing features.

---

## Lessons Learned

These lessons come from real implementation sessions:

1. **Kendo buttons wrap content** in `.k-button-text` - apply flex/gap to this inner element
2. **Flat buttons remove borders** - you need `!important` to add them back
3. **Context colors** should use CSS variables like `--panel-color` for dynamic theming
4. **Panel heights** should align with top nav (48px) for visual consistency
5. **Active states** benefit from subtle background tints using `color-mix()`
6. **Incremental updates** are more efficient than big-bang documentation at the end