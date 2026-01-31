# VDC Production Changelog

This file tracks changes to the VDC production system as reported during sprint releases.
Updates here should be reflected in the corresponding entity and API files.

## How to Update

When a new VDC sprint is released:
1. Add a new version section below with the release date
2. List added, changed, and deprecated items
3. Update the corresponding entity/API files with new status or properties
4. Update `last_updated` dates in affected files

---

## Unreleased

_Changes that have been documented but not yet released to production._

---

## Initial Baseline (2026-01-31)

### Documented
All 17 core entities and 12 API categories documented from existing VDC production:

**Entities:**
- Project, Feed, Ingredient, IngredientType
- IngredientRelease, IngredientReleaseSubmission, Package
- Workflow, WorkflowRun, StageRun, StepRun, Test
- Badge, WorkItem, SiliconSetting, UnifiedPatchSiliconSetting, UserToken

**APIs:**
- GraphQL, Projects, Feeds, Ingredients, Releases, Submissions
- Workflows, Workflow Runs, Ingredient Types, Silicon Settings, Users, NGA

---

<!-- Template for future releases:

## vX.Y.Z (YYYY-MM-DD)

### Added
- New `EntityName` entity - [entities/entity-name.md](./entities/entity-name.md)
- `GET /api/new-endpoint` endpoint - [apis/api-name.md](./apis/api-name.md)

### Changed
- `Entity.property` now supports new values
- `GET /api/endpoint` response includes new field

### Deprecated
- `OldEntity` - use `NewEntity` instead
- `GET /api/old-endpoint` - will be removed in vX.Y.Z

### Removed
- `RemovedEntity` entity
- `DELETE /api/removed` endpoint

-->
