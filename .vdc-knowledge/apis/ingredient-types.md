---
status: existing
last_updated: 2026-01-31
---

# Ingredient Types API

## Base URL
```
/api/ingredienttypes
```

## Endpoints

### List Ingredient Types
```
GET /api/ingredienttypes
```
Returns all ingredient types.

**Response:**
```json
{
  "items": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "schema": {}
    }
  ]
}
```

### Create Ingredient Type
```
POST /api/ingredienttypes
```
Creates a new ingredient type.

**Request:**
```json
{
  "name": "string",
  "description": "string",
  "schema": {
    "type": "object",
    "properties": {
      "customField": {
        "type": "string"
      }
    }
  }
}
```

### Get Ingredient Type
```
GET /api/ingredienttypes/{id}
```
Returns ingredient type details.

### Update Ingredient Type
```
PUT /api/ingredienttypes/{id}
```
Updates ingredient type definition.

### Delete Ingredient Type
```
DELETE /api/ingredienttypes/{id}
```
Deletes an ingredient type.

## Schema Definition
Ingredient types use JSON Schema to define the structure:

```json
{
  "type": "object",
  "required": ["buildNumber"],
  "properties": {
    "buildNumber": {
      "type": "string",
      "description": "Build number"
    },
    "platform": {
      "type": "string",
      "enum": ["x64", "arm64"]
    },
    "tags": {
      "type": "array",
      "items": { "type": "string" }
    }
  }
}
```

## Authorization
- **Read**: All authenticated users
- **Create/Update/Delete**: System_Admins

## Usage in Mockups
- Ingredient type selector
- Schema editor
- Admin settings
