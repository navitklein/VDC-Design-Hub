---
status: existing
last_updated: 2026-01-31
---

# Badge

## Description
Pipeline/build badges associated with ingredient releases. Badges provide visual status indicators from external CI/CD systems.

## Properties
| Property | Type | Description |
|----------|------|-------------|
| id | string | Unique identifier |
| releaseId | string | Parent release ID |
| name | string | Badge name |
| status | BadgeStatus | Badge status |
| url | string | Link to external system |
| imageUrl | string | Badge image URL |
| createdAt | datetime | Badge creation time |

## Status Values
- **Pending** - Build in progress
- **Passing** - Build succeeded
- **Failing** - Build failed
- **Unknown** - Status unavailable

## Relationships
- **Belongs to** IngredientRelease

## UI Representation
- Icon: `fa-certificate`
- Color Token: varies by status
- Common Views: Release details, Badge row

## API Endpoints
- `GET /api/feeds/{feed}/ingredients/{name}/releases/{version}/badges` - List badges
- `POST /api/feeds/{feed}/ingredients/{name}/releases/{version}/badges` - Add badge
