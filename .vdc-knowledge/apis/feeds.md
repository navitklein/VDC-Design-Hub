---
status: existing
last_updated: 2026-01-31
---

# Feeds API

## Base URL
```
/api/feeds
```

## Endpoints

### List Feeds
```
GET /api/feeds
GET /api/feeds?projectId={projectId}
```
Returns feeds, optionally filtered by project.

**Response:**
```json
{
  "items": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "projectId": "string"
    }
  ]
}
```

### Create Feed
```
POST /api/feeds
```
Creates a new feed in a project. Requires superuser permissions.

**Request:**
```json
{
  "name": "string",
  "description": "string",
  "projectId": "string"
}
```

### Get Feed
```
GET /api/feeds/{id}
```
Returns feed details including ingredient count.

### Update Feed
```
PUT /api/feeds/{id}
```
Updates feed details. Requires superuser permissions.

### Delete Feed
```
DELETE /api/feeds/{id}
```
Deletes a feed and all its ingredients. Requires superuser permissions.

## Authorization
- **Read**: Project_Users or higher
- **Create/Update/Delete**: Project_SuperUsers or higher

## Usage in Mockups
- Feed list/grid
- Feed selector
- Ingredient browser sidebar
