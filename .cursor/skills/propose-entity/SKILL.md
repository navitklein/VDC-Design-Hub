---
name: propose-entity
description: Create a proposed entity or API for a mockup design. Use when designing a feature that needs new entities, APIs, or fields that don't exist in VDC production yet.
---

# Propose Entity/API for Mockup

## When to Use

- Designing a mockup that needs a new entity
- Mockup requires API that doesn't exist
- Adding new fields to existing entities
- User asks to document proposed data model

## Workflow

### 1. Gather Requirements

From the mockup design, identify:
- Entity name and description
- Properties and their types
- Relationships to existing entities
- Required API endpoints
- UI representation (icon, color, views)

### 2. Check Existing Knowledge

Before creating, search `.vdc-knowledge/`:
- Does this entity already exist?
- Is there a similar entity we should extend?
- Are there existing APIs that could be used?

### 3. Create Proposed Entity

Create file in `.vdc-knowledge/entities/[entity-name].md` with frontmatter:
- `status: proposed`
- `proposed_in: [mockup-slug]`
- `last_updated: [today]`

Include: Description, Properties table, Relationships, Actions, UI Representation, API Endpoints.

### 4. Create Proposed API (if needed)

Create file in `.vdc-knowledge/apis/[api-name].md` with same pattern.

### 5. Update INDEX Files

Add entry with `status: proposed` to the relevant INDEX.md.

### 6. Link from Mockup

In the mockup's `content/mockups/[slug]/identity.md`, add a "Proposed Entities/APIs" section linking to the new definitions.

## Tips

- Use existing entity patterns as templates
- Follow naming conventions (PascalCase for entities)
- Include realistic sample data in descriptions
- Think about all CRUD operations needed
