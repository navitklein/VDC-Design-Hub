# VDC Knowledge Base

This directory contains domain knowledge about the VDC product that persists across sessions.

## Directory Structure

- **entities/** - VDC business entity definitions
- **apis/** - Available API endpoints and data models

## How to Use

### Adding a New Entity

Create a markdown file in entities/ with this structure:

# Entity Name

## Description
Brief description of what this entity represents.

## Properties
| Property | Type | Description |
|----------|------|-------------|
| id | string | Unique identifier |
| name | string | Display name |

## Relationships
- Has many [Related Entity]
- Belongs to [Parent Entity]

## UI Representation
- Icon: [Font Awesome icon name]
- Color Token: [token name]
- Common Views: [list of views where this appears]

### Adding API Documentation

Create a markdown file in apis/ with this structure:

# API Endpoint Name

## Endpoint
GET /api/v1/resource

## Request
Parameters, headers, body schema

## Response
Response schema with examples

## Usage in Mockups
How this data is used in the UI

## Updating Knowledge

When working on a new feature:
1. Identify any new entities
2. Document them in entities/
3. Document relevant APIs in apis/
4. Reference in mockup identity.md
