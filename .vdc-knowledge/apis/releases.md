---
status: existing
last_updated: 2026-01-31
---

# Ingredient Releases API

## Base URL
```
/api/feeds/{feed}/ingredients/{name}/releases
```

## Endpoints

### List Releases
```
GET /api/feeds/{feed}/ingredients/{name}/releases
```
Returns releases for an ingredient.

**Query Parameters:**
- `version` - Filter by version (supports wildcards)
- `from` - Filter releases after date
- `to` - Filter releases before date

**Response:**
```json
{
  "items": [
    {
      "id": "string",
      "version": "string",
      "createdAt": "datetime",
      "createdBy": "string",
      "isLatest": "boolean",
      "packageCount": "number"
    }
  ]
}
```

### Get Release
```
GET /api/feeds/{feed}/ingredients/{name}/releases/{version}
```
Returns release details.

**Response:**
```json
{
  "id": "string",
  "version": "string",
  "createdAt": "datetime",
  "packages": [...],
  "dependencies": [...],
  "badges": [...],
  "workItems": [...]
}
```

### Delete Release
```
DELETE /api/feeds/{feed}/ingredients/{name}/releases/{version}
```
Deletes a release. Requires superuser permissions.

### Download Release Archive
```
GET /api/feeds/{feed}/ingredients/{name}/releases/{version}/download
```
Downloads all packages as a ZIP archive.

### Get Dependencies (Tree)
```
GET /api/feeds/{feed}/ingredients/{name}/releases/{version}/dependencies?format=tree
```
Returns dependency tree structure.

### Get Dependencies (Flat)
```
GET /api/feeds/{feed}/ingredients/{name}/releases/{version}/dependencies?format=flat
```
Returns flat list of all dependencies.

### Get Dependent Ingredients
```
GET /api/feeds/{feed}/ingredients/{name}/releases/{version}/dependents
```
Returns ingredients with releases that depend on this release.

### Get Dependent Releases
```
GET /api/feeds/{feed}/ingredients/{name}/releases/{version}/dependent-releases
```
Returns releases that depend on this release.

### Get IFWI Knobs
```
GET /api/feeds/{feed}/ingredients/{name}/releases/{version}/ifwi-knobs
```
Returns IFWI configuration knobs for this release.

## Authorization
- **Read/Download**: Project_Users or higher
- **Delete**: Project_SuperUsers or higher

## Usage in Mockups
- Release list
- Release details page
- Dependency graph/tree
- Download buttons
