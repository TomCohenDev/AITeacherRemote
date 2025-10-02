# MessageComposer Integration

## Overview

The MessageComposer component allows users to send text messages and images to the AI Teacher Assistant through the n8n backend.

## Features

- **Text Input**: Optional text message (required if no image)
- **Image Upload**: Camera capture or file selection with client-side resizing
- **Auto-Resize**: Images are automatically resized to ≤1920px for optimal performance
- **Base64 Encoding**: Images are converted to raw base64 PNG (no data prefix)
- **Real-time Preview**: Image preview before sending
- **Toast Notifications**: Success/error feedback

## API Integration

Sends data to n8n backend:

```
POST ${VITE_API_URL}/sessions/prompt?code={CODE}
Body: { text?: string, image?: string (raw base64 PNG) }
```

## Files Added

- `src/utils/image.ts` - Image processing utilities
- `src/services/promptApi.ts` - API client for prompt sending
- `src/components/MessageComposer.tsx` - Main component
- `src/pages/_sessionCodeHelper.ts` - Session code helper hook

## Usage

The MessageComposer is automatically integrated into the SessionPage. It receives the session code from the URL parameters.

### Manual Integration

If you need to add it elsewhere, use:

```tsx
import MessageComposer from "../components/MessageComposer";

function MyComponent() {
  const sessionCode = "ABCDE"; // Get from store, params, or props

  return (
    <div>
      {/* Your content */}
      <MessageComposer sessionCode={sessionCode} />
    </div>
  );
}
```

### Props

- `sessionCode: string` - 5-letter session code (required)
- `title?: string` - Optional title (default: "Send to Assistant")

## Image Processing

Images are processed client-side:

1. File is converted to canvas
2. Resized to max 1920px on longest edge
3. Converted to PNG format
4. Encoded as raw base64 (no data: prefix)

## Error Handling

- Invalid session code validation
- File upload errors
- API request failures
- Network connectivity issues

All errors are displayed as toast notifications.

## Styling

Uses Tailwind CSS classes consistent with the existing design system:

- White background with border
- Indigo color scheme for buttons
- Responsive design
- Mobile-friendly touch targets
