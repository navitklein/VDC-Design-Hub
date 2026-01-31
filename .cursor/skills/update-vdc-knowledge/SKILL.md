---
name: update-vdc-knowledge
description: Update VDC knowledge base when sprint releases happen. Use when the user shares what changed in VDC production, wants to update entities/APIs, or mentions a new VDC release.
---

# Update VDC Knowledge Base

## When to Use

- User says "VDC released v2.X" or "new sprint release"
- User shares changes from production
- User wants to mark proposed entities as existing
- User wants to deprecate old entities/APIs

## Workflow

### 1. Gather Release Information

Ask for:
- Version number (e.g., v2.5.0)
- Release date
- What was added/changed/deprecated

### 2. Update CHANGELOG.md

Add new version section to `.vdc-knowledge/CHANGELOG.md`.

### 3. Update Entity/API Files

For each change:

**New entities:**
- Create file in `.vdc-knowledge/entities/`
- Set `status: existing` and `since: vX.Y.Z`
- Update `entities/INDEX.md`

**Promoted from proposed:**
- Change `status: proposed` to `status: existing`
- Add `since: vX.Y.Z`
- Remove `proposed_in`
- Update `last_updated`

**Deprecated:**
- Change `status` to `deprecated`
- Add deprecation notice at top of file

### 4. Update INDEX Files

- Add new entries with status column
- Update status for changed items

## File Locations

- CHANGELOG: `.vdc-knowledge/CHANGELOG.md`
- Entities: `.vdc-knowledge/entities/`
- APIs: `.vdc-knowledge/apis/`
