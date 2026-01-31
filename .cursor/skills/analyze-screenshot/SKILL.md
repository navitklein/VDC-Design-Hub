---
name: analyze-screenshot
description: Analyze a screenshot of VDC production UI to identify Kendo components and recreate in Angular. Use when the user provides an image to reverse-engineer or wants to recreate an existing view.
---

# Analyze Screenshot Workflow

## Purpose

When the user provides a screenshot of existing VDC production UI, follow this workflow to recreate it using VDC Design Hub components.

## Step 1: Analyze the Image

Identify in the screenshot:
- **Layout Structure**: Grid, flex, sidebar, header patterns
- **Kendo Components**: Grid, Button, Dropdown, DatePicker, Dialog, etc.
- **Data Patterns**: Tables, forms, cards, lists
- **State Indicators**: Loading spinners, empty states, error messages
- **Icons**: Font Awesome icons used

## Step 2: Check Component Library

For each identified component, check if VDC wrapper exists:
- Look in src/app/vdc-library/
- Check assets/data/components.json

If component is MISSING:
1. Create the VDC wrapper first
2. Document in Component Explorer
3. Define Do's and Don'ts

## Step 3: Identify VDC Entities

Look for business entities in the UI:
- Check .vdc-knowledge/entities/ for existing definitions
- If new entity found, document it
- Map icons to entities per iconography standards

## Step 4: Generate Angular Markup

Create the component with:
- VDC library components (not raw Kendo)
- Tailwind for layout
- Support for all simulator states (loading, empty, data, error)
- Annotation placeholders for key elements

## Step 5: Handoff

Provide to user:
- Generated component code
- List of any new VDC components created
- List of any new entities identified
- Suggestions for annotations

## Output Template

### Component Analysis
- Layout: [description]
- Kendo Components: [list]
- VDC Entities: [list]
- Missing Components: [list]

### Generated Code
[Angular component code]

### Next Steps
[What user should do next]
