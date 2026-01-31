---
status: existing
last_updated: 2026-01-31
---

# IngredientRelease

## Description
Versioned release of an ingredient. Contains packages, dependencies on other releases, badges, and work items.

## Properties
| Property | Type | Description |
|----------|------|-------------|
| id | string | Unique identifier |
| version | string | Semantic version |
| ingredientId | string | Parent ingredient ID |
| createdAt | datetime | Release creation timestamp |
| createdBy | string | User who created the release |
| isLatest | boolean | Whether this is the latest release |
| baseline | IngredientRelease | Baseline release for comparison |

## Relationships
- **Belongs to** Ingredient
- **Has many** Package
- **Has many** Badge
- **Has many** WorkItem
- **Has many** IngredientRelease (dependencies - many-to-many)
- **Belongs to** IngredientRelease (baseline)
- **Produced by** BuildStep (workflow)

## Actions
- Create (via submission workflow)
- Read
- Delete
- Get dependencies (tree/flat)
- Get dependent ingredients
- Get dependent releases
- Download release archive
- Get IFWI knobs

## UI Representation
- Icon: `fa-tag`
- Color Token: `--kendo-color-success`
- Common Views: Release list, Release details, Dependency graph, Download page

## API Endpoints
- `GET /api/feeds/{feed}/ingredients/{name}/releases` - List releases
- `GET /api/feeds/{feed}/ingredients/{name}/releases/{version}` - Get release details
- `GET /api/feeds/{feed}/ingredients/{name}/releases/{version}/download` - Download archive
- `GET /api/feeds/{feed}/ingredients/{name}/releases/{version}/dependencies` - Get dependencies
- `DELETE /api/feeds/{feed}/ingredients/{name}/releases/{version}` - Delete release
