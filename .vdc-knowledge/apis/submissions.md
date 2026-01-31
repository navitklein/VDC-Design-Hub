---
status: existing
last_updated: 2026-01-31
---

# Ingredient Release Submissions API

## Base URL
```
/api/feeds/{feed}/ingredients/{name}/submissions
```

## Endpoints

### Create Submission
```
POST /api/feeds/{feed}/ingredients/{name}/submissions
```
Creates a new release submission.

**Request:**
```json
{
  "version": "string",
  "dependencies": [
    {
      "ingredientId": "string",
      "version": "string"
    }
  ],
  "metadata": {}
}
```

**Response:**
```json
{
  "id": "string",
  "state": "Init",
  "uploadUrls": [
    {
      "packageName": "string",
      "url": "string"
    }
  ]
}
```

### Get Submission
```
GET /api/feeds/{feed}/ingredients/{name}/submissions/{id}
```
Returns submission status.

**Response:**
```json
{
  "id": "string",
  "version": "string",
  "state": "Init|Staged|Processing|Completed|Failed",
  "createdAt": "datetime",
  "errorMessage": "string|null",
  "releaseId": "string|null"
}
```

### List Submissions
```
GET /api/feeds/{feed}/ingredients/{name}/submissions
```
Returns all submissions for an ingredient.

### Upload Package
```
POST /api/feeds/{feed}/ingredients/{name}/submissions/{id}/packages
```
Uploads a package file to the submission.

**Request:** Multipart form with file

### Stage Submission
```
POST /api/feeds/{feed}/ingredients/{name}/submissions/{id}/stage
```
Marks submission as staged (all files uploaded), triggers processing.

### Delete Submission
```
DELETE /api/feeds/{feed}/ingredients/{name}/submissions/{id}
```
Cancels/deletes a submission.

## State Machine

```
Init → Staged → Processing → Completed
                    ↓
                  Failed
```

| State | Description |
|-------|-------------|
| Init | Submission created, awaiting file uploads |
| Staged | All files uploaded, queued for processing |
| Processing | Release being created |
| Completed | Release created successfully |
| Failed | Error during processing |

## Authorization
- **Create/Upload**: Project_SuperUsers or higher
- **Read**: Project_Users or higher
- **Delete**: Creator or Project_Admins

## Usage in Mockups
- Release submission wizard
- Upload progress
- Submission status tracker
