---
status: existing
last_updated: 2026-01-31
---

# UnifiedPatchSiliconSetting

## Description
Unified patch specific silicon configuration. Extended silicon settings for unified patch scenarios.

## Properties
| Property | Type | Description |
|----------|------|-------------|
| id | string | Unique identifier |
| siliconSettingId | string | Base silicon setting ID |
| patchName | string | Patch identifier |
| configuration | object | Patch-specific config |
| isEnabled | boolean | Whether patch is enabled |

## Relationships
- **Extends** SiliconSetting

## UI Representation
- Icon: `fa-microchip`
- Color Token: `--kendo-color-tertiary`
- Common Views: Patch configuration, Settings list

## API Endpoints
- `GET /api/siliconsettings/unified-patch` - List unified patch settings
- `POST /api/siliconsettings/unified-patch` - Create setting
- `PUT /api/siliconsettings/unified-patch/{id}` - Update setting
