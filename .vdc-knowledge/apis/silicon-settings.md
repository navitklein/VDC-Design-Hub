---
status: existing
last_updated: 2026-01-31
---

# Silicon Settings API

## Base URL
```
/api/siliconsettings
```

## Endpoints

### List Silicon Settings
```
GET /api/siliconsettings
GET /api/siliconsettings?category={category}
```
Returns silicon settings, optionally filtered by category.

**Response:**
```json
{
  "items": [
    {
      "id": "string",
      "name": "string",
      "value": "string",
      "category": "string",
      "description": "string",
      "isActive": "boolean"
    }
  ]
}
```

### Create Silicon Setting
```
POST /api/siliconsettings
```
Creates a new silicon setting.

**Request:**
```json
{
  "name": "string",
  "value": "string",
  "category": "string",
  "description": "string"
}
```

### Get Silicon Setting
```
GET /api/siliconsettings/{id}
```
Returns setting details.

### Update Silicon Setting
```
PUT /api/siliconsettings/{id}
```
Updates a silicon setting.

### Delete Silicon Setting
```
DELETE /api/siliconsettings/{id}
```
Deletes a silicon setting.

## Unified Patch Settings

### List Unified Patch Settings
```
GET /api/siliconsettings/unified-patch
```
Returns unified patch silicon settings.

### Create Unified Patch Setting
```
POST /api/siliconsettings/unified-patch
```
Creates a unified patch setting.

**Request:**
```json
{
  "siliconSettingId": "string",
  "patchName": "string",
  "configuration": {},
  "isEnabled": "boolean"
}
```

### Update Unified Patch Setting
```
PUT /api/siliconsettings/unified-patch/{id}
```
Updates a unified patch setting.

## Authorization
- **Read**: Project_Users or higher
- **Create/Update/Delete**: System_Admins

## Usage in Mockups
- Silicon configuration page
- Workflow configuration
- Test configuration
