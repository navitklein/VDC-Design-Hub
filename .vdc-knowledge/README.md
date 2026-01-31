# VDC Knowledge Base

This directory contains domain knowledge about the VDC (Validation Data Center) product that persists across sessions.

## Quick Start

- **[SYSTEM-OVERVIEW.md](./SYSTEM-OVERVIEW.md)** - High-level architecture and concepts
- **[entities/INDEX.md](./entities/INDEX.md)** - All 17 business entities
- **[apis/INDEX.md](./apis/INDEX.md)** - All 12 API categories
- **[CHANGELOG.md](./CHANGELOG.md)** - VDC production release history

## Directory Structure

- **SYSTEM-OVERVIEW.md** - Architecture, tech stack, hierarchies
- **CHANGELOG.md** - VDC production release changelog
- **entities/** - VDC business entity definitions (17 entities)
- **apis/** - Available API endpoints and data models (12 categories)

## Status Tracking

Each entity and API file includes a YAML frontmatter with status information:

```yaml
---
status: existing | proposed | deprecated
since: v2.4.0              # Version when added (for existing)
proposed_in: mockup-name   # Which mockup proposed it (for proposed)
last_updated: 2026-01-31
---
```

### Status Values

| Status | Description |
|--------|-------------|
| `existing` | Currently in VDC production |
| `proposed` | Designed in mockups, not yet implemented |
| `deprecated` | Being phased out, avoid using |

## Workflow

### When Designing a Mockup

1. If the mockup requires a new entity or API:
   - Create the entity/API file with `status: proposed`
   - Add `proposed_in: mockup-slug` to reference the mockup
2. In the mockup's `identity.md`, add a "Proposed Entities/APIs" section:
   ```markdown
   ## Proposed Entities/APIs
   - `NewEntity` - [entities/new-entity.md](../../.vdc-knowledge/entities/new-entity.md)
   - `GET /api/new-endpoint` - [apis/new-api.md](../../.vdc-knowledge/apis/new-api.md)
   ```

### When VDC Production Releases

1. Share what changed in the sprint release
2. Update CHANGELOG.md with the new version
3. Update affected entity/API files:
   - Change `status: proposed` to `status: existing`
   - Add `since: vX.Y.Z` with the release version
   - Update `last_updated` date
4. Update INDEX.md files if entities/APIs were added or removed

### When Features Are Deprecated

1. Update the entity/API file with `status: deprecated`
2. Add a deprecation notice at the top of the file
3. Document in CHANGELOG.md under "Deprecated"

## Templates

### Adding a New Entity

Create a markdown file in `entities/` with this structure:

```markdown
---
status: proposed
proposed_in: mockup-slug
last_updated: 2026-01-31
---

# Entity Name

## Description
Brief description of what this entity represents.

## Properties
| Property | Type | Description |
|----------|------|-------------|
| id | string | Unique identifier |
| name | string | Display name |

## Relationships
- Has many [Related Entity]
- Belongs to [Parent Entity]

## Actions
- List available actions

## UI Representation
- Icon: [Font Awesome icon name]
- Color Token: [token name]
- Common Views: [list of views where this appears]

## API Endpoints
- List relevant endpoints
```

### Adding API Documentation

Create a markdown file in `apis/` with this structure:

```markdown
---
status: proposed
proposed_in: mockup-slug
last_updated: 2026-01-31
---

# API Endpoint Name

## Base URL
\`\`\`
/api/resource
\`\`\`

## Endpoints
Document each endpoint with request/response schemas

## Authorization
Required permission levels

## Usage in Mockups
How this data is used in the UI
```
