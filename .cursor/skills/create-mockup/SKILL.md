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

2. **Create Folder Structure**

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

3. **Register Feature**
   - Add entry to assets/data/features.json
   - Add route to mockup routing

4. **Create Identity Content**
   Write identity.md with:
   - Problem Statement
   - User Research Links
   - Jira Ticket URL
   - Technical Constraints

5. **Initialize Annotations**
   Create empty annotations.json:
   { "annotations": [] }

6. **Scaffold Design Component**
   - Import SimulatorBarComponent
   - Add state switch (@switch on simulatorState)
   - Create placeholder content for each state

## File Templates

See .cursor/rules/mockup-structure.mdc for component patterns.
