# VDC Entities Index

This file lists all documented VDC entities.

## Hierarchical Overview

### Ingredient Hierarchy
```
Project → Feed → Ingredient → IngredientRelease
                                   ├─ Packages
                                   ├─ Dependencies
                                   ├─ Badges
                                   └─ WorkItems
```

### Workflow Hierarchy
```
Project → Workflow → WorkflowRun → StageRun → StepRun → Test
```

## Core Entities (17 Total)

### Organization
| Entity | File | Status | Description |
|--------|------|--------|-------------|
| Project | [project.md](./project.md) | existing | Top-level organizational unit |
| Feed | [feed.md](./feed.md) | existing | Container for ingredients |

### Ingredients
| Entity | File | Status | Description |
|--------|------|--------|-------------|
| IngredientType | [ingredient-type.md](./ingredient-type.md) | existing | Schema definition |
| Ingredient | [ingredient.md](./ingredient.md) | existing | Software component |
| IngredientRelease | [ingredient-release.md](./ingredient-release.md) | existing | Versioned release |
| IngredientReleaseSubmission | [ingredient-release-submission.md](./ingredient-release-submission.md) | existing | Release request |
| Package | [package.md](./package.md) | existing | File artifact |

### Workflows
| Entity | File | Status | Description |
|--------|------|--------|-------------|
| Workflow | [workflow.md](./workflow.md) | existing | Automation definition |
| WorkflowRun | [workflow-run.md](./workflow-run.md) | existing | Execution instance |
| StageRun | [stage-run.md](./stage-run.md) | existing | Stage execution |
| StepRun | [step-run.md](./step-run.md) | existing | Step execution |
| Test | [test.md](./test.md) | existing | NGA/Flexit test |

### Supporting Entities
| Entity | File | Status | Description |
|--------|------|--------|-------------|
| Badge | [badge.md](./badge.md) | existing | Pipeline status badge |
| WorkItem | [work-item.md](./work-item.md) | existing | Bug/feature tracking |
| SiliconSetting | [silicon-setting.md](./silicon-setting.md) | existing | Chip configuration |
| UnifiedPatchSiliconSetting | [unified-patch-silicon-setting.md](./unified-patch-silicon-setting.md) | existing | Patch config |
| UserToken | [user-token.md](./user-token.md) | existing | API authentication |

## Key Relationships

- **Project ↔ Feed** (1:Many)
- **Feed ↔ Ingredient** (1:Many)
- **Ingredient ↔ IngredientRelease** (1:Many)
- **IngredientRelease ↔ IngredientRelease** (Many:Many via Dependencies)
- **IngredientRelease ↔ Baseline** (Many:1 for comparison)
- **Project ↔ Workflow** (1:Many)
- **Workflow ↔ WorkflowRun** (1:Many)
- **BuildStep → IngredientRelease** (produces)
- **TestStep ↔ IngredientRelease** (Many:Many - tests releases)
- **StepRun ↔ Test** (1:Many for test steps)

## Adding New Entities

When you discover a new VDC entity:
1. Create `[entity-name].md` in this directory
2. Update this index
3. Include icon mapping and color token

## Entity Template

See [../README.md](../README.md) for template.
