---
status: existing
last_updated: 2026-01-31
---

# GraphQL API

## Endpoint
```
POST /graphql
```

## Description
Unified query endpoint using HotChocolate GraphQL. Supports complex queries with filtering, sorting, and pagination.

## Architecture
- **Technology**: HotChocolate GraphQL for .NET
- **Pattern**: Query-only (commands use REST)
- **Features**: Filtering, sorting, pagination, projections

## Available Queries

### Projects
```graphql
query {
  projects(
    where: { name: { contains: "search" } }
    order: { name: ASC }
  ) {
    nodes {
      id
      name
      description
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

### Feeds
```graphql
query {
  feeds(projectId: "project-id") {
    nodes {
      id
      name
      ingredients {
        totalCount
      }
    }
  }
}
```

### Ingredients
```graphql
# Per-feed query
query {
  ingredients(feedId: "feed-id") {
    nodes {
      id
      name
      latestRelease {
        version
      }
    }
  }
}

# Global query
query {
  allIngredients(where: { name: { contains: "search" } }) {
    nodes {
      id
      name
      feed {
        name
      }
    }
  }
}
```

### Ingredient Releases
```graphql
# Per-ingredient query
query {
  ingredientReleases(ingredientId: "ingredient-id") {
    nodes {
      id
      version
      createdAt
      packages {
        name
        size
      }
      dependencies {
        version
        ingredient {
          name
        }
      }
    }
  }
}

# Global query with filtering
query {
  allReleases(
    where: { createdAt: { gte: "2024-01-01" } }
    order: { createdAt: DESC }
    first: 10
  ) {
    nodes {
      id
      version
    }
  }
}
```

### Submissions
```graphql
query {
  submissions(ingredientId: "ingredient-id") {
    nodes {
      id
      version
      state
      createdAt
    }
  }
}
```

### Workflows
```graphql
query {
  workflows(projectId: "project-id") {
    nodes {
      id
      name
      stages {
        name
        steps {
          name
          type
        }
      }
    }
  }
}
```

### Workflow Runs
```graphql
query {
  workflowRuns(
    workflowId: "workflow-id"
    where: { status: { eq: RUNNING } }
  ) {
    nodes {
      id
      status
      startedAt
      stageRuns {
        stageName
        status
        stepRuns {
          stepName
          status
        }
      }
    }
  }
}
```

### Tests
```graphql
query {
  tests(stepRunId: "step-run-id") {
    nodes {
      id
      name
      status
      result
      duration
      reviewStatus
    }
    totalCount
  }
}
```

## Filtering
All queries support filtering via `where` argument:
- `eq`, `neq` - Equality
- `contains`, `startsWith`, `endsWith` - String matching
- `in`, `nin` - List membership
- `gt`, `gte`, `lt`, `lte` - Comparisons
- `and`, `or` - Logical operators

## Sorting
Use `order` argument with field and direction:
```graphql
order: { fieldName: ASC }
order: [{ field1: ASC }, { field2: DESC }]
```

## Pagination
Cursor-based pagination:
```graphql
query {
  items(first: 20, after: "cursor") {
    nodes { ... }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount
  }
}
```

## Usage in Mockups
- Use `@apollo/client` or Angular GraphQL client
- Generate types with GraphQL Code Generator
- Prefer GraphQL for read operations
- Use REST for mutations/commands
