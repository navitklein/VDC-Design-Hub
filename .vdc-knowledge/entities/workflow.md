---
status: existing
last_updated: 2026-01-31
---

# Workflow

## Description
Build/test automation definition. Workflows orchestrate multi-stage processes that can build ingredients and run tests.

## Properties
| Property | Type | Description |
|----------|------|-------------|
| id | string | Unique identifier |
| name | string | Workflow name |
| projectId | string | Parent project ID |
| description | string | Workflow description |
| stages | Stage[] | Ordered list of stages |
| isEnabled | boolean | Whether workflow is active |

## Stage Structure
```
Workflow
  └── Stage
        └── Step (Build | Test | Deploy)
```

## Step Types
- **BuildStep** - Produces an IngredientRelease
- **TestStep** - Runs tests against releases
- **DeployStep** - Deployment actions

## Relationships
- **Belongs to** Project
- **Has many** WorkflowRun
- **Has many** Stage
- **Stages have many** Step

## Actions
- Create (superusers)
- Read
- Update (superusers)
- Delete (superusers)
- Get workflow metadata
- Trigger run

## UI Representation
- Icon: `fa-project-diagram`
- Color Token: `--kendo-color-info`
- Common Views: Workflow list, Workflow editor, Pipeline visualization

## API Endpoints
- `GET /api/workflows` - List workflows
- `POST /api/workflows` - Create workflow
- `GET /api/workflows/{id}` - Get workflow details
- `PUT /api/workflows/{id}` - Update workflow
- `DELETE /api/workflows/{id}` - Delete workflow
- `POST /api/workflows/{id}/runs` - Start workflow run
