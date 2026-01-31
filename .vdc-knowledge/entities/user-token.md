---
status: existing
last_updated: 2026-01-31
---

# UserToken

## Description
API authentication tokens for users. Used for service accounts and CLI access to VDC APIs.

## Properties
| Property | Type | Description |
|----------|------|-------------|
| id | string | Unique identifier |
| userId | string | Owner user ID |
| name | string | Token name/description |
| token | string | The actual token (shown once) |
| createdAt | datetime | Token creation time |
| expiresAt | datetime | Token expiration time |
| lastUsedAt | datetime | Last usage timestamp |
| isActive | boolean | Whether token is active |
| scopes | string[] | Permission scopes |

## Relationships
- **Belongs to** User

## Actions
- Create token
- List tokens
- Revoke token
- Regenerate token

## UI Representation
- Icon: `fa-key`
- Color Token: `--kendo-color-warning`
- Common Views: Token management, User settings

## API Endpoints
- `GET /api/users/tokens` - List user tokens
- `POST /api/users/tokens` - Create token
- `DELETE /api/users/tokens/{id}` - Revoke token
