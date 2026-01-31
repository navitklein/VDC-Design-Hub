---
status: existing
last_updated: 2026-01-31
---

# Projects API

## Base URL
```
/api/projects
```

## Endpoints

### List Projects
```
GET /api/projects
```
Returns all projects the user has access to.

**Response:**
```json
{
  "items": [
    {
      "id": "string",
      "name": "string",
      "description": "string"
    }
  ]
}
```

### Create Project
```
POST /api/projects
```
Creates a new project. Requires admin permissions.

**Request:**
```json
{
  "name": "string",
  "description": "string"
}
```

### Get Project
```
GET /api/projects/{id}
```
Returns project details including users and permissions.

### Update Project
```
PUT /api/projects/{id}
```
Updates project details. Requires admin permissions.

### Delete Project
```
DELETE /api/projects/{id}
```
Deletes a project. Requires admin permissions.

### Create Personal Project
```
POST /api/projects/personal
```
Creates a personal project for the current user.

### Get Project Users
```
GET /api/projects/{id}/users
```
Returns users with access to the project.

### Get Project Admins
```
GET /api/projects/{id}/admins
```
Returns project administrators.

### Get Project SuperUsers
```
GET /api/projects/{id}/superusers
```
Returns project super users.

### Manage Ingredient Type Permissions
```
GET /api/projects/{id}/ingredienttypes
POST /api/projects/{id}/ingredienttypes/{typeId}
DELETE /api/projects/{id}/ingredienttypes/{typeId}
```
Manage which ingredient types are allowed in this project.

## Authorization
- **Read**: Project_Users or higher
- **Create/Update/Delete**: Project_Admins or System_Admins

## Usage in Mockups
- Project selector dropdown
- Project settings page
- Admin dashboard
