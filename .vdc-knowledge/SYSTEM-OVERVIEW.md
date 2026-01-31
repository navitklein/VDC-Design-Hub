# VDC System Overview

VDC (Validation Data Center) is a sophisticated platform for managing ingredient releases, builds, workflows, and test execution in a chip validation environment.

## Technology Stack

### Backend
- **.NET 8.0** with ASP.NET Core
- **Entity Framework Core** for ORM
- **PostgreSQL** database
- **HotChocolate** GraphQL
- **FluentValidation** for validation
- **MediatR** for CQRS pattern
- **Azure Blob Storage** for file storage

### Frontend
- **Angular** framework
- **TypeScript** with RxJS
- **GraphQL Code Generator**
- **Kendo UI / Telerik** components

## Architecture Patterns

- **CQRS** - Command Query Responsibility Segregation via MediatR
- **Minimal APIs** - ASP.NET Core 8.0 style endpoints
- **GraphQL** - Complex queries via HotChocolate
- **REST** - Commands and simple queries

## Hierarchical Structure

The system is organized in two main hierarchies:

### Ingredient Hierarchy
```
Project
  └── Feed
        └── Ingredient
              └── IngredientRelease
                    ├── Packages
                    ├── Dependencies → Other Releases
                    ├── Badges
                    └── WorkItems
```

### Workflow Hierarchy
```
Project
  └── Workflow
        └── WorkflowRun
              └── StageRun
                    └── StepRun
                          └── Test
```

## Authentication & Authorization

### Methods
- **Azure AD JWT Bearer Token** - Primary authentication
- **VDC Custom Token** - Service accounts and CLI

### Permission Levels (Hierarchical)
1. **Project_Users** - Read access
2. **Project_SuperUsers** - Create/modify
3. **Project_Admins** - Manage project
4. **System_Admins** - Global admin access

## Key Concepts

### Ingredients
Software components/artifacts that are versioned and released. Each ingredient belongs to a feed and has a type that defines its schema.

### Releases
Versioned snapshots of ingredients with packages, dependencies, badges, and work items. Releases can depend on other releases forming a dependency graph.

### Workflows
Build/test automation definitions that orchestrate multi-stage processes. Workflows produce releases and run tests.

### Submissions
The process of creating a new release. Submissions go through states: Init → Staged → Processing → Completed/Failed.
