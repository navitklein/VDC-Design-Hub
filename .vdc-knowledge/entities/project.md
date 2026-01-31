---
status: existing
last_updated: 2026-01-31
---

# Project

## Description
Top-level organizational unit in VDC. Projects contain feeds, workflows, and define permissions for users.

## Properties
| Property | Type | Description |
|----------|------|-------------|
| id | string | Unique identifier |
| name | string | Project name |
| description | string | Project description |
| users | User[] | Users with access |
| admins | User[] | Project administrators |
| superUsers | User[] | Users with elevated permissions |

## Relationships
- **Has many** Feed
- **Has many** Workflow
- **Has many** User (via permissions)
- **Has many** IngredientType permissions

## Actions
- Create (admin only)
- Read
- Update (admin only)
- Delete (admin only)
- Create personal project
- Get users/admins/superusers
- Manage ingredient type permissions

## UI Representation
- Icon: `fa-folder-open`
- Color Token: `--kendo-color-primary`
- Common Views: Project list, Project dashboard, Settings

## API Endpoints
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/{id}` - Get project details
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project
