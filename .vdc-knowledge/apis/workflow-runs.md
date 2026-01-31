---
status: existing
last_updated: 2026-01-31
---

# Workflow Runs API

## Base URL
```
/api/workflowruns
```

## Endpoints

### List Runs
```
GET /api/workflowruns
GET /api/workflowruns?workflowId={workflowId}
GET /api/workflowruns?status={status}
```
Returns workflow runs with optional filters.

**Response:**
```json
{
  "items": [
    {
      "id": "string",
      "workflowId": "string",
      "workflowName": "string",
      "status": "Pending|Running|Succeeded|Failed|Cancelled",
      "startedAt": "datetime",
      "completedAt": "datetime|null",
      "triggeredBy": "string"
    }
  ]
}
```

### Get Run
```
GET /api/workflowruns/{id}
```
Returns run details including stages and steps.

**Response:**
```json
{
  "id": "string",
  "status": "string",
  "stageRuns": [
    {
      "id": "string",
      "stageName": "string",
      "status": "string",
      "stepRuns": [
        {
          "id": "string",
          "stepName": "string",
          "stepType": "string",
          "status": "string"
        }
      ]
    }
  ]
}
```

### Delete Run
```
DELETE /api/workflowruns/{id}
```
Deletes a workflow run and all associated data.

### Abort Step
```
POST /api/workflowruns/{runId}/steps/{stepId}/abort
```
Aborts a running step.

### Mark Build Step Completed
```
POST /api/workflowruns/{runId}/steps/{stepId}/complete
```
Marks a build step as completed (external completion).

**Request:**
```json
{
  "releaseId": "string",
  "success": "boolean",
  "message": "string"
}
```

### Upload Logs
```
POST /api/workflowruns/{runId}/logs
```
Uploads log files for a run.

### Download Logs
```
GET /api/workflowruns/{runId}/logs
GET /api/workflowruns/{runId}/steps/{stepId}/logs
```
Downloads logs for run or specific step.

## Test Endpoints

### List Tests
```
GET /api/workflowruns/{runId}/steps/{stepId}/tests
```
Returns tests for a test step.

### Submit Tests
```
POST /api/workflowruns/{runId}/steps/{stepId}/tests/submit
```
Submits tests for execution.

**Request:**
```json
{
  "testSuite": "string",
  "releaseIds": ["string"],
  "configuration": {}
}
```

### Rerun Test
```
POST /api/workflowruns/{runId}/steps/{stepId}/tests/{testId}/rerun
```
Reruns a specific test.

### Abort Test
```
POST /api/workflowruns/{runId}/steps/{stepId}/tests/{testId}/abort
```
Aborts a running test.

### Review Test
```
PUT /api/workflowruns/{runId}/steps/{stepId}/tests/{testId}/review
```
Reviews/approves test results.

**Request:**
```json
{
  "status": "Approved|Rejected|Waived",
  "comment": "string"
}
```

### Rerun Discovery
```
POST /api/workflowruns/{runId}/steps/{stepId}/tests/rediscover
```
Re-runs test discovery process.

## Authorization
- **Read**: Project_Users or higher
- **Create/Abort/Delete**: Project_SuperUsers or higher
- **Review**: Project_SuperUsers or higher

## Usage in Mockups
- Run list/history
- Run details page
- Pipeline progress view
- Test results grid
- Logs viewer
