---
status: existing
last_updated: 2026-01-31
---

# IngredientType

## Description
Schema definition for ingredients. Defines the structure and validation rules for ingredients of this type.

## Properties
| Property | Type | Description |
|----------|------|-------------|
| id | string | Unique identifier |
| name | string | Type name |
| schema | object | JSON schema for ingredient structure |
| description | string | Type description |

## Relationships
- **Has many** Ingredient

## Actions
- Create
- Read
- Update
- Delete
- Manage permissions per project

## UI Representation
- Icon: `fa-cube`
- Color Token: `--kendo-color-tertiary`
- Common Views: Ingredient type list, Schema editor

## API Endpoints
- `GET /api/ingredienttypes` - List ingredient types
- `POST /api/ingredienttypes` - Create type
- `GET /api/ingredienttypes/{id}` - Get type details
- `PUT /api/ingredienttypes/{id}` - Update type
- `DELETE /api/ingredienttypes/{id}` - Delete type
