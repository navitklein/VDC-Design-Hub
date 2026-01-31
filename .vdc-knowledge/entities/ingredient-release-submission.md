---
status: existing
last_updated: 2026-01-31
---

# IngredientReleaseSubmission

## Description
Request to create a new ingredient release. Submissions go through a state machine workflow before becoming a release.

## Properties
| Property | Type | Description |
|----------|------|-------------|
| id | string | Unique identifier |
| ingredientId | string | Target ingredient ID |
| version | string | Proposed version |
| state | SubmissionState | Current state |
| createdAt | datetime | Submission timestamp |
| createdBy | string | User who submitted |
| errorMessage | string | Error details if failed |

## State Machine
```
Init → Staged → Processing → Completed
                    ↓
                  Failed
```

### States
- **Init** - Submission created, awaiting files
- **Staged** - Files uploaded, ready for processing
- **Processing** - Release being created
- **Completed** - Release successfully created
- **Failed** - Release creation failed

## Relationships
- **Belongs to** Ingredient
- **Creates** IngredientRelease (on completion)
- **Has many** Package (uploaded files)

## Actions
- Create submission
- Upload package files
- Read
- Delete
- Trigger processing (state transition)

## UI Representation
- Icon: `fa-upload`
- Color Token: `--kendo-color-warning`
- Common Views: Submission form, Upload progress, Submission status

## API Endpoints
- `POST /api/feeds/{feed}/ingredients/{name}/submissions` - Create submission
- `GET /api/feeds/{feed}/ingredients/{name}/submissions/{id}` - Get submission status
- `POST /api/feeds/{feed}/ingredients/{name}/submissions/{id}/packages` - Upload package
- `DELETE /api/feeds/{feed}/ingredients/{name}/submissions/{id}` - Cancel submission
