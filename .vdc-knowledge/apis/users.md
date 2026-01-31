---
status: existing
last_updated: 2026-01-31
---

# Users API

## Base URL
```
/api/users
```

## Endpoints

### Get Current User
```
GET /api/users/me
```
Returns the current authenticated user.

**Response:**
```json
{
  "id": "string",
  "email": "string",
  "displayName": "string",
  "roles": ["string"],
  "projects": [
    {
      "projectId": "string",
      "role": "User|SuperUser|Admin"
    }
  ]
}
```

## Token Management

### List User Tokens
```
GET /api/users/tokens
```
Returns all tokens for the current user.

**Response:**
```json
{
  "items": [
    {
      "id": "string",
      "name": "string",
      "createdAt": "datetime",
      "expiresAt": "datetime",
      "lastUsedAt": "datetime|null",
      "isActive": "boolean"
    }
  ]
}
```

### Create Token
```
POST /api/users/tokens
```
Creates a new API token.

**Request:**
```json
{
  "name": "string",
  "expiresIn": "number (days)",
  "scopes": ["read", "write"]
}
```

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "token": "vdc_xxxxx",
  "expiresAt": "datetime"
}
```

> **Note**: The token value is only returned once at creation time.

### Revoke Token
```
DELETE /api/users/tokens/{id}
```
Revokes/deletes a token.

## Authentication Methods

### Azure AD JWT
Primary authentication method for web application.

**Header:**
```
Authorization: Bearer <jwt-token>
```

### VDC Custom Token
For service accounts and CLI tools.

**Header:**
```
Authorization: VDC <vdc-token>
```

## Authorization Levels

| Level | Description |
|-------|-------------|
| Project_Users | Read access to project |
| Project_SuperUsers | Create/modify in project |
| Project_Admins | Manage project settings |
| System_Admins | Global admin access |

## Usage in Mockups
- User profile page
- Token management
- Login/authentication flow
