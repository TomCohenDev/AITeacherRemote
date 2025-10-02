# API Configuration

## Quick Switch Between Production and Test APIs

To switch between production and test APIs, simply change **one variable** in `src/config/api.ts`:

```typescript
// 🧪 API Configuration - Change this to switch between production and test APIs
export const USE_TEST_API = false; // Set to true for test API, false for production
```

## API URLs

- **Production**: `https://n8n.yarden-zamir.com/webhook/ita/api`
- **Test**: `https://n8n.yarden-zamir.com/webhook-test/ita/api`

## How to Switch

1. Open `src/config/api.ts`
2. Change `USE_TEST_API` to `true` for test API or `false` for production
3. Save the file
4. The MessageComposer will automatically use the new API

## Visual Indicator

The MessageComposer shows which API is currently being used:

- **PRODUCTION API**: `https://n8n.yarden-zamir.com/webhook/ita/api`
- **TEST API**: `https://n8n.yarden-zamir.com/webhook-test/ita/api`

## Files Affected

- `src/config/api.ts` - Main configuration file
- `src/services/api.ts` - Session connection API (uses the config)
- `src/services/promptApi.ts` - Prompt sending API (uses the config)
- `src/components/MessageComposer.tsx` - Shows current API

## APIs Controlled

Both APIs are now controlled by the same configuration:

- **Session Connection**: `POST /sessions/connect`
- **Prompt Sending**: `POST /sessions/prompt`

## No Environment Variables Needed

The API URLs are hardcoded, so no `.env` file configuration is required.
