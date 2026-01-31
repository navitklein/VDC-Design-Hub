---
status: existing
last_updated: 2026-01-31
---

# WorkflowRun

## Description
Execution instance of a workflow. Represents a single run through the workflow stages and steps.

## Properties
| Property | Type | Description |
|----------|------|-------------|
| id | string | Unique identifier |
| workflowId | string | Parent workflow ID |
| status | RunStatus | Current run status |
| startedAt | datetime | Run start time |
| completedAt | datetime | Run completion time |
| triggeredBy | string | User or system that triggered |
| parameters | object | Run parameters |

## Status Values
- **Pending** - Queued, not started
- **Running** - In progress
- **Succeeded** - All steps completed successfully
- **Failed** - One or more steps failed
- **Cancelled** - Run was aborted

## Relationships
- **Belongs to** Workflow
- **Has many** StageRun
- **Produces** IngredientRelease (via build steps)

## Actions
- Create run
- Read
- Delete
- Abort step
- Upload/download logs
- Mark build step completed

## UI Representation
- Icon: `fa-play-circle`
- Color Token: varies by status
- Common Views: Run list, Run details, Pipeline progress, Logs viewer

## API Endpoints
- `GET /api/workflowruns` - List runs
- `POST /api/workflows/{id}/runs` - Create run
- `GET /api/workflowruns/{id}` - Get run details
- `DELETE /api/workflowruns/{id}` - Delete run
- `POST /api/workflowruns/{id}/abort` - Abort run
- `GET /api/workflowruns/{id}/logs` - Download logs
- `POST /api/workflowruns/{id}/logs` - Upload logs
