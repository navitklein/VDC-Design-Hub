---
status: existing
last_updated: 2026-01-31
---

# SiliconSetting

## Description
Silicon/chip configuration settings. Defines parameters specific to silicon validation targets.

## Properties
| Property | Type | Description |
|----------|------|-------------|
| id | string | Unique identifier |
| name | string | Setting name |
| value | string | Setting value |
| category | string | Setting category |
| description | string | Setting description |
| isActive | boolean | Whether setting is active |

## Relationships
- Used by workflows and tests

## UI Representation
- Icon: `fa-microchip`
- Color Token: `--kendo-color-tertiary`
- Common Views: Settings list, Configuration editor

## API Endpoints
- `GET /api/siliconsettings` - List silicon settings
- `POST /api/siliconsettings` - Create setting
- `GET /api/siliconsettings/{id}` - Get setting details
- `PUT /api/siliconsettings/{id}` - Update setting
- `DELETE /api/siliconsettings/{id}` - Delete setting
