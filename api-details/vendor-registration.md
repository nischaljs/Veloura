# Vendor Registration API

## Endpoint
`POST /api/vendors/register`

## Description
Register as a vendor (requires an authenticated user).

## Request
- **Headers:**
  - `Authorization: Bearer <user_token>`
  - `Content-Type: application/json`
- **Body:**
```json
{
  "businessName": "Test Vendor Biz 3",
  "businessEmail": "vendorregtestbiz3@example.com",
  "businessPhone": "9800000030",
  "description": "A test vendor registration.",
  "website": "https://testvendor3.com"
}
```

## Response
- **Success (200):**
```json
{
  "success": true,
  "message": "Vendor registration submitted for approval",
  "data": {
    "vendor": {
      "id": 7,
      "userId": 17,
      "businessName": "Test Vendor Biz 3",
      "businessEmail": "vendorregtestbiz3@example.com",
      "businessPhone": "9800000030",
      "slug": "test-vendor-biz-3",
      "description": "A test vendor registration.",
      "website": "https://testvendor3.com",
      "isApproved": false,
      ...
    }
  }
}
```

## Example
```bash
curl -X POST http://localhost:5000/api/vendors/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <user_token>" \
  -d '{"businessName": "Test Vendor Biz 3", "businessEmail": "vendorregtestbiz3@example.com", "businessPhone": "9800000030", "description": "A test vendor registration.", "website": "https://testvendor3.com"}'
```

## Notes
- The user must be authenticated (JWT required).
- The backend generates the `slug` from `businessName`.
- `businessEmail` and `userId` must be unique.
- The vendor is created with `isApproved: false` and must be approved by an admin before being active. 