---
status: existing
last_updated: 2026-01-31
---

# StepRun

## Description
Step execution within a stage run. Can be a Build, Test, or Deploy step. Test steps contain individual test executions.

## Properties
| Property | Type | Description |
|----------|------|-------------|
| id | string | Unique identifier |
| stageRunId | string | Parent stage run ID |
| stepType | StepType | Build, Test, or Deploy |
| stepName | string | Name of the step |
| status | RunStatus | Current step status |
| startedAt | datetime | Step start time |
| completedAt | datetime | Step completion time |
| logs | string | Step execution logs |
| artifactUrl | string | Output artifact location |

## Step Types
- **Build** - Compiles and produces an IngredientRelease
- **Test** - Runs NGA/Flexit tests against releases
- **Deploy** - Deploys artifacts to target environment

## Relationships
- **Belongs to** StageRun
- **Has many** Test (for test steps)
- **Produces** IngredientRelease (for build steps)
- **Tests** IngredientRelease (many-to-many for test steps)

## Actions
- Abort step
- View logs
- Mark completed (build steps)
- Submit tests (test steps)

## UI Representation
- Icon: varies by type (`fa-hammer`, `fa-vial`, `fa-rocket`)
- Color Token: varies by status
- Common Views: Step details, Logs viewer, Test results

## API Endpoints
- `GET /api/workflowruns/{runId}/steps/{stepId}` - Get step details
- `POST /api/workflowruns/{runId}/steps/{stepId}/abort` - Abort step
- `POST /api/workflowruns/{runId}/steps/{stepId}/complete` - Mark build complete
- `POST /api/workflowruns/{runId}/steps/{stepId}/tests/submit` - Submit tests
