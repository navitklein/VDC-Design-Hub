---
status: existing
last_updated: 2026-01-31
---

# Ingredient

## Description
Software component or artifact in VDC. Ingredients are versioned through releases and can have dependencies on other ingredients.

## Properties
| Property | Type | Description |
|----------|------|-------------|
| id | string | Unique identifier |
| name | string | Ingredient name (unique within feed) |
| feedId | string | Parent feed ID |
| typeId | string | Ingredient type ID |
| description | string | Ingredient description |
| latestRelease | IngredientRelease | Most recent release |

## Relationships
- **Belongs to** Feed
- **Belongs to** IngredientType
- **Has many** IngredientRelease
- **Has many** WorkItem

## Actions
- Create (superusers)
- Read
- Update (superusers)
- Delete (superusers)
- Get dependent ingredients
- Get dependent releases
- Get work items

## UI Representation
- Icon: `fa-box`
- Color Token: `--kendo-color-success`
- Common Views: Ingredient list, Ingredient details, Release history

## API Endpoints
- `GET /api/feeds/{feed}/ingredients` - List ingredients
- `POST /api/feeds/{feed}/ingredients` - Create ingredient
- `GET /api/feeds/{feed}/ingredients/{name}` - Get ingredient details
- `PUT /api/feeds/{feed}/ingredients/{name}` - Update ingredient
- `DELETE /api/feeds/{feed}/ingredients/{name}` - Delete ingredient
