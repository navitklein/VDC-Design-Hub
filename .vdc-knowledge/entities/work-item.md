---
status: existing
last_updated: 2026-01-31
---

# WorkItem

## Description
Associated bugs, enhancements, or tasks linked to ingredients or releases. Typically synced from external tracking systems (Azure DevOps, Jira).

## Properties
| Property | Type | Description |
|----------|------|-------------|
| id | string | Unique identifier |
| externalId | string | External system ID |
| type | WorkItemType | Bug, Feature, Task, etc. |
| title | string | Work item title |
| status | string | Current status |
| url | string | Link to external system |
| assignedTo | string | Assigned user |
| priority | number | Priority level |

## Work Item Types
- **Bug** - Defect/issue
- **Feature** - New feature request
- **Task** - Work task
- **Enhancement** - Improvement

## Relationships
- **Associated with** Ingredient (many-to-many)
- **Associated with** IngredientRelease (many-to-many)

## Actions
- Link to ingredient/release
- Unlink from ingredient/release
- Sync from external system

## UI Representation
- Icon: varies by type (`fa-bug`, `fa-lightbulb`, `fa-tasks`)
- Color Token: varies by type/priority
- Common Views: Work items list, Release notes, Ingredient details

## API Endpoints
- `GET /api/feeds/{feed}/ingredients/{name}/workitems` - List work items
- `POST /api/feeds/{feed}/ingredients/{name}/workitems` - Link work item
- `DELETE /api/feeds/{feed}/ingredients/{name}/workitems/{id}` - Unlink work item
