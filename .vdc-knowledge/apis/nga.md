---
status: existing
last_updated: 2026-01-31
---

# NGA Integration API

## Base URL
```
/api/nga
```

## Description
API endpoints for NGA (Next-Gen Automation) plugin integration. These endpoints are used by the NGA test execution framework.

## Endpoints

### Register Test Suite
```
POST /api/nga/suites
```
Registers a test suite with VDC.

**Request:**
```json
{
  "name": "string",
  "version": "string",
  "tests": [
    {
      "name": "string",
      "category": "string",
      "parameters": {}
    }
  ]
}
```

### Report Test Start
```
POST /api/nga/tests/{testId}/start
```
Reports that a test has started execution.

### Report Test Result
```
POST /api/nga/tests/{testId}/result
```
Reports test execution result.

**Request:**
```json
{
  "result": "Pass|Fail|Skip|Error",
  "duration": "number (ms)",
  "errorMessage": "string|null",
  "artifacts": [
    {
      "name": "string",
      "url": "string",
      "type": "log|screenshot|report"
    }
  ]
}
```

### Get Test Configuration
```
GET /api/nga/tests/{testId}/config
```
Gets test configuration and parameters.

### Upload Test Artifacts
```
POST /api/nga/tests/{testId}/artifacts
```
Uploads test artifacts (logs, screenshots, etc.).

### Heartbeat
```
POST /api/nga/heartbeat
```
Keeps the test session alive during long-running tests.

**Request:**
```json
{
  "testId": "string",
  "status": "Running",
  "progress": "number (0-100)"
}
```

## Flexit Integration

Similar endpoints exist for Flexit test framework:

```
POST /api/flexit/suites
POST /api/flexit/tests/{testId}/start
POST /api/flexit/tests/{testId}/result
GET /api/flexit/tests/{testId}/config
```

## Authentication
NGA/Flexit plugins use VDC tokens for authentication:

```
Authorization: VDC <service-token>
```

## Usage in Mockups
- Test results display
- Test progress monitoring
- Artifact viewer
