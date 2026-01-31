---
name: create-mockup
description: Create a new mockup feature for VDC Design Hub. Use when the user wants to add a new mockup, create a new feature, or scaffold a new design view.
---

# Create Mockup Feature

## Workflow

1. **Gather Information**
   - Feature name (will be converted to slug)
   - Brief description for identity.md
   - Problem statement
   - Any Jira ticket or research links

2. **Propose Kendo Components** (REQUIRED)
   
   Before implementing, present a component proposal table:
   
   ```markdown
   ## Proposed Kendo Components
   
   | UI Element | Kendo Component | Module |
   |------------|-----------------|--------|
   | Example | kendo-component | ModuleName |
   
   **Kendo Documentation:**
   - [Component Name](https://www.telerik.com/kendo-angular-ui/components/...)
   
   Shall I proceed with this implementation?
   ```
   
   **WAIT for explicit user approval before proceeding.**
   
   Also check for new icons - if using icons not in `assets/tokens/vdc-icons.json`, add them first.

4. **Create Folder Structure**

   src/app/features/mockups/[slug]/
     [slug].routes.ts
     identity/
       identity.component.ts
       identity.component.html
     design/
       design.component.ts
       design.component.html
     component-spec/
       spec.component.ts
       spec.component.html

   content/mockups/[slug]/
     identity.md
     annotations.json

5. **Register Feature**
   - Add entry to assets/data/features.json
   - Add route to mockup routing

6. **Create Identity Content**
   Write identity.md with:
   - Problem Statement
   - User Research Links
   - Jira Ticket URL
   - Technical Constraints

7. **Initialize Annotations**
   Create empty annotations.json:
   { "annotations": [] }

8. **Scaffold Design Component**
   - Import SimulatorBarComponent
   - Add state switch (@switch on simulatorState)
   - Create placeholder content for each state

9. **Document Components** (REQUIRED)
   
   After implementation, update `assets/data/components.json` for any new VDC components:
   
   ```json
   {
     "name": "VdcComponentName",
     "slug": "vdc-component-name",
     "description": "Component description",
     "kendoBase": ["kendo-component"],
     "kendoDocs": "https://www.telerik.com/kendo-angular-ui/components/...",
     "templateChanges": ["List of VDC-specific modifications"],
     "designDecisions": ["Design decisions made during mockup"],
     "status": "draft",
     "category": "Category"
   }
   ```

## File Templates

See .cursor/rules/mockup-structure.mdc for component patterns.
See .cursor/rules/component-workflow.mdc for component approval and documentation workflow.
