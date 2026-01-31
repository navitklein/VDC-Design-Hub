---
status: existing
last_updated: 2026-01-31
---

# Test

## Description
Individual NGA/Flexit test execution. Tests are run against ingredient releases as part of test steps in workflows.

## Properties
| Property | Type | Description |
|----------|------|-------------|
| id | string | Unique identifier |
| stepRunId | string | Parent step run ID |
| name | string | Test name |
| status | TestStatus | Test execution status |
| result | TestResult | Pass/Fail/Skip result |
| startedAt | datetime | Test start time |
| completedAt | datetime | Test completion time |
| duration | number | Execution time in ms |
| errorMessage | string | Error details if failed |
| reviewStatus | ReviewStatus | Review state |
| reviewedBy | string | Reviewer user ID |

## Status Values
- **Pending** - Queued for execution
- **Running** - In progress
- **Completed** - Finished execution
- **Aborted** - Was cancelled

## Result Values
- **Pass** - Test passed
- **Fail** - Test failed
- **Skip** - Test was skipped
- **Error** - Test encountered error

## Review Status
- **NotReviewed** - Needs review
- **Approved** - Reviewed and approved
- **Rejected** - Reviewed and rejected
- **Waived** - Known issue, waived

## Relationships
- **Belongs to** StepRun
- **Tests** IngredientRelease (many-to-many)

## Actions
- Submit test
- Rerun test
- Abort test
- Review test results
- Update test properties
- Rerun discovery

## UI Representation
- Icon: `fa-vial`
- Color Token: varies by result (green/red/yellow)
- Common Views: Test list, Test details, Test results grid, Review panel

## API Endpoints
- `GET /api/workflowruns/{runId}/steps/{stepId}/tests` - List tests
- `POST /api/workflowruns/{runId}/steps/{stepId}/tests/submit` - Submit tests
- `POST /api/workflowruns/{runId}/steps/{stepId}/tests/{testId}/rerun` - Rerun test
- `POST /api/workflowruns/{runId}/steps/{stepId}/tests/{testId}/abort` - Abort test
- `PUT /api/workflowruns/{runId}/steps/{stepId}/tests/{testId}/review` - Review test
