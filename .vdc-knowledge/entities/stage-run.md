---
status: existing
last_updated: 2026-01-31
---

# StageRun

## Description
Stage execution within a workflow run. Represents the execution of a single stage containing multiple steps.

## Properties
| Property | Type | Description |
|----------|------|-------------|
| id | string | Unique identifier |
| workflowRunId | string | Parent workflow run ID |
| stageName | string | Name of the stage |
| status | RunStatus | Current stage status |
| startedAt | datetime | Stage start time |
| completedAt | datetime | Stage completion time |
| order | number | Stage execution order |

## Status Values
- **Pending** - Waiting for previous stage
- **Running** - In progress
- **Succeeded** - All steps completed
- **Failed** - One or more steps failed
- **Skipped** - Stage was skipped

## Relationships
- **Belongs to** WorkflowRun
- **Has many** StepRun

## UI Representation
- Icon: `fa-layer-group`
- Color Token: varies by status
- Common Views: Pipeline visualization, Stage details

## API Endpoints
- Accessed via WorkflowRun endpoints
- `GET /api/workflowruns/{runId}/stages` - List stage runs
- `GET /api/workflowruns/{runId}/stages/{stageId}` - Get stage details
