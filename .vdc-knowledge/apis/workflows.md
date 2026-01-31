---
status: existing
last_updated: 2026-01-31
---

# Workflows API

## Base URL
```
/api/workflows
```

## Endpoints

### List Workflows
```
GET /api/workflows
GET /api/workflows?projectId={projectId}
```
Returns workflows, optionally filtered by project.

**Response:**
```json
{
  "items": [
    {
      "id": "string",
      "name": "string",
      "projectId": "string",
      "isEnabled": "boolean",
      "stageCount": "number"
    }
  ]
}
```

### Create Workflow
```
POST /api/workflows
```
Creates a new workflow. Requires superuser permissions.

**Request:**
```json
{
  "name": "string",
  "projectId": "string",
  "description": "string",
  "stages": [
    {
      "name": "string",
      "order": "number",
      "steps": [
        {
          "name": "string",
          "type": "Build|Test|Deploy",
          "configuration": {}
        }
      ]
    }
  ]
}
```

### Get Workflow
```
GET /api/workflows/{id}
```
Returns workflow details including stages and steps.

### Update Workflow
```
PUT /api/workflows/{id}
```
Updates workflow definition. Requires superuser permissions.

### Delete Workflow
```
DELETE /api/workflows/{id}
```
Deletes a workflow. Requires superuser permissions.

### Get Workflow Metadata
```
GET /api/workflows/{id}/metadata
```
Returns workflow metadata and statistics.

### Start Workflow Run
```
POST /api/workflows/{id}/runs
```
Creates and starts a new workflow run.

**Request:**
```json
{
  "parameters": {},
  "triggerSource": "string"
}
```

**Response:**
```json
{
  "runId": "string",
  "status": "Pending"
}
```

## Step Types

### Build Step
Compiles and produces an IngredientRelease.
```json
{
  "type": "Build",
  "configuration": {
    "ingredientId": "string",
    "buildScript": "string"
  }
}
```

### Test Step
Runs tests against ingredient releases.
```json
{
  "type": "Test",
  "configuration": {
    "testSuite": "string",
    "releaseIds": ["string"]
  }
}
```

### Deploy Step
Deploys artifacts to target environment.
```json
{
  "type": "Deploy",
  "configuration": {
    "target": "string",
    "artifactPath": "string"
  }
}
```

## Authorization
- **Read**: Project_Users or higher
- **Create/Update/Delete**: Project_SuperUsers or higher
- **Run**: Project_SuperUsers or higher

## Usage in Mockups
- Workflow list
- Workflow editor/designer
- Pipeline visualization
