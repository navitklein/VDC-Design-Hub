# VDC APIs Index

This file lists all documented VDC API endpoints.

## Architecture Overview

- **ASP.NET Core 8.0** with Minimal APIs
- **GraphQL** (HotChocolate) for complex queries
- **REST** for commands and simple queries
- **CQRS** pattern via MediatR

## API Categories (12 Groups)

| Category | File | Status | Description |
|----------|------|--------|-------------|
| GraphQL | [graphql.md](./graphql.md) | existing | Unified query endpoint |
| Projects | [projects.md](./projects.md) | existing | Project management |
| Feeds | [feeds.md](./feeds.md) | existing | Feed operations |
| Ingredients | [ingredients.md](./ingredients.md) | existing | Ingredient CRUD |
| Releases | [releases.md](./releases.md) | existing | Release queries & downloads |
| Submissions | [submissions.md](./submissions.md) | existing | Release submission workflow |
| Workflows | [workflows.md](./workflows.md) | existing | Workflow definitions |
| Workflow Runs | [workflow-runs.md](./workflow-runs.md) | existing | Execution & tests |
| Ingredient Types | [ingredient-types.md](./ingredient-types.md) | existing | Type management |
| Silicon Settings | [silicon-settings.md](./silicon-settings.md) | existing | Silicon configuration |
| Users | [users.md](./users.md) | existing | User & token management |
| NGA | [nga.md](./nga.md) | existing | NGA/Flexit integration |

## Endpoint Patterns

### Base URLs
```
/api/projects
/api/feeds
/api/feeds/{feed}/ingredients
/api/feeds/{feed}/ingredients/{name}/releases
/api/feeds/{feed}/ingredients/{name}/submissions
/api/workflows
/api/workflowruns
/api/ingredienttypes
/api/siliconsettings
/api/users
/api/nga
/graphql
```

## Authentication

### Azure AD JWT Bearer Token (Primary)
```
Authorization: Bearer <jwt-token>
```

### VDC Custom Token (Service/CLI)
```
Authorization: VDC <vdc-token>
```

## Permission Levels

| Level | Access |
|-------|--------|
| Project_Users | Read |
| Project_SuperUsers | Create/Modify |
| Project_Admins | Manage Project |
| System_Admins | Global Admin |

## Common Patterns

### List Response
```json
{
  "items": [...],
  "totalCount": 100,
  "pageSize": 20,
  "page": 1
}
```

### Error Response
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": []
  }
}
```

## Adding API Documentation

When you discover a new VDC API:
1. Create `[api-name].md` in this directory
2. Update this index
3. Include request/response schemas

## API Template

See [../README.md](../README.md) for template.
