---
status: existing
last_updated: 2026-01-31
---

# Ingredients API

## Base URL
```
/api/feeds/{feed}/ingredients
```

## Endpoints

### List Ingredients
```
GET /api/feeds/{feed}/ingredients
```
Returns ingredients in a feed.

**Query Parameters:**
- `type` - Filter by ingredient type
- `search` - Search by name

**Response:**
```json
{
  "items": [
    {
      "id": "string",
      "name": "string",
      "typeId": "string",
      "description": "string",
      "latestRelease": {
        "version": "string",
        "createdAt": "datetime"
      }
    }
  ]
}
```

### Create Ingredient
```
POST /api/feeds/{feed}/ingredients
```
Creates a new ingredient. Requires superuser permissions.

**Request:**
```json
{
  "name": "string",
  "typeId": "string",
  "description": "string"
}
```

### Get Ingredient
```
GET /api/feeds/{feed}/ingredients/{name}
```
Returns ingredient details.

### Update Ingredient
```
PUT /api/feeds/{feed}/ingredients/{name}
```
Updates ingredient details. Requires superuser permissions.

### Delete Ingredient
```
DELETE /api/feeds/{feed}/ingredients/{name}
```
Deletes ingredient and all releases. Requires superuser permissions.

### Get Dependent Ingredients
```
GET /api/feeds/{feed}/ingredients/{name}/dependents
```
Returns ingredients that depend on this ingredient.

### Get Dependent Releases
```
GET /api/feeds/{feed}/ingredients/{name}/dependent-releases
```
Returns releases that depend on releases of this ingredient.

### Get Work Items
```
GET /api/feeds/{feed}/ingredients/{name}/workitems
```
Returns work items linked to this ingredient.

## Authorization
- **Read**: Project_Users or higher
- **Create/Update/Delete**: Project_SuperUsers or higher

## Usage in Mockups
- Ingredient list/grid
- Ingredient details page
- Dependency graph
