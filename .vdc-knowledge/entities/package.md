---
status: existing
last_updated: 2026-01-31
---

# Package

## Description
File package within ingredient releases. Packages are the actual binary/file artifacts that make up a release.

## Properties
| Property | Type | Description |
|----------|------|-------------|
| id | string | Unique identifier |
| releaseId | string | Parent release ID |
| name | string | Package name |
| fileName | string | Original file name |
| size | number | File size in bytes |
| checksum | string | File hash/checksum |
| uploadedAt | datetime | Upload timestamp |
| contentType | string | MIME type |
| blobUrl | string | Azure Blob Storage URL |

## Relationships
- **Belongs to** IngredientRelease
- **Stored in** Azure Blob Storage

## Actions
- Upload (during submission)
- Download
- Delete (with release)

## UI Representation
- Icon: `fa-file-archive`
- Color Token: `--kendo-color-base`
- Common Views: Package list, Download links, Upload progress

## API Endpoints
- `GET /api/feeds/{feed}/ingredients/{name}/releases/{version}/packages` - List packages
- `GET /api/feeds/{feed}/ingredients/{name}/releases/{version}/packages/{id}` - Download package
- `POST /api/feeds/{feed}/ingredients/{name}/submissions/{id}/packages` - Upload package
