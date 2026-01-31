---
status: existing
last_updated: 2026-01-31
---

# Feed

## Description
Container for ingredients within a project. Feeds organize ingredients into logical groups.

## Properties
| Property | Type | Description |
|----------|------|-------------|
| id | string | Unique identifier |
| name | string | Feed name |
| description | string | Feed description |
| projectId | string | Parent project ID |

## Relationships
- **Belongs to** Project
- **Has many** Ingredient

## Actions
- Create (superusers)
- Read
- Update (superusers)
- Delete (superusers)

## UI Representation
- Icon: `fa-database`
- Color Token: `--kendo-color-info`
- Common Views: Feed list, Feed details, Ingredient browser

## API Endpoints
- `GET /api/feeds` - List feeds
- `POST /api/feeds` - Create feed
- `GET /api/feeds/{id}` - Get feed details
- `PUT /api/feeds/{id}` - Update feed
- `DELETE /api/feeds/{id}` - Delete feed
