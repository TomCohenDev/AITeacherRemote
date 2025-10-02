# Changelog

All notable changes to the AI Teacher Assistant webapp will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Nothing yet

### Changed

- Nothing yet

### Deprecated

- Nothing yet

### Removed

- Nothing yet

### Fixed

- Nothing yet

### Security

- Nothing yet

## [1.1.0] - 2024-12-19

### Added

- **Manual Connect Button**: Users now click a "Connect to Session" button instead of auto-submit
- **Real n8n Backend Integration**: Connected to production n8n API at `https://n8n.yarden-zamir.com/webhook/ita/api`
- **Device Type Detection**: Automatic detection of mobile vs desktop devices
- **Single Attempt Connection**: No automatic retries - users control when to retry
- **Enhanced CodeInput Component**: Improved 5-letter code input with better UX
- **Toast Notifications**: Success/error feedback with react-hot-toast
- **API Error Handling**: Comprehensive error handling with user-friendly messages
- **Session State Management**: Simplified session store with proper state tracking

### Changed

- **BREAKING**: Removed QR code scanning functionality
- **BREAKING**: Removed auto-submit on code completion
- **BREAKING**: Removed automatic retry logic
- **IMPROVED**: Code input now requires manual button click to connect
- **IMPROVED**: Better loading states and user feedback
- **IMPROVED**: Simplified connection flow

### Removed

- **QR Code Scanner**: Removed @yudiel/react-qr-scanner dependency
- **Auto-Submit**: Code no longer submits automatically when 5 letters are entered
- **Auto-Retry**: No more automatic retry attempts after failed connections
- **Complex Animation**: Removed success animation in favor of simple toast

### Fixed

- **Toast Spam**: Fixed multiple success/error toast notifications
- **State Management**: Improved session state handling
- **Error Messages**: Better error message display and handling
- **Loading States**: Cleaner loading state management

### Technical Details

- **API Service**: Complete rewrite with real n8n backend integration
- **TypeScript Types**: Updated interfaces for API responses
- **Session Store**: Simplified store structure
- **Component Architecture**: Enhanced CodeInput component with better props
- **Error Handling**: Comprehensive error handling with specific error types

## [1.0.0] - 2024-10-01

### Added

- Initial release of AI Teacher Assistant webapp
- QR code scanning functionality using @yudiel/react-qr-scanner
- Manual 5-letter session code entry with auto-focus
- Responsive design optimized for mobile, tablet, and desktop
- Modern UI built with Tailwind CSS
- TypeScript support for type safety
- State management with Zustand
- React Router for client-side navigation
- Toast notifications with react-hot-toast
- Camera permission handling
- Session connection and disconnection
- Real-time connection status display
- Professional project structure
- Comprehensive documentation
- Environment configuration
- Error handling and validation
- Touch-friendly interface (44px minimum touch targets)
- Accessibility features (ARIA labels, semantic HTML)
- Loading states and animations
- Gradient backgrounds and modern styling
- Mobile-first responsive design
- Cross-browser compatibility

### Technical Details

- React 18 with TypeScript
- Vite build tool for fast development
- Tailwind CSS for styling
- Zustand for lightweight state management
- Axios for HTTP requests (prepared for n8n backend)
- React Icons for beautiful icons
- Custom component library (Button, Input, Card)
- Utility functions for validation and helpers
- Professional folder structure
- ESLint and TypeScript configuration
- Environment variable support
- Production-ready build configuration

### Features

- **ConnectionPage**: Main landing page with QR scanner and manual code entry
- **SessionPage**: Session view with connection status and controls
- **NotFoundPage**: 404 error page
- **QR Scanner**: Camera-based QR code scanning with permission handling
- **Code Entry**: 5-letter session code input with validation
- **Session Management**: Connect, disconnect, and status tracking
- **Responsive Layout**: Works on all device sizes
- **Modern UI**: Beautiful gradients, animations, and interactions
- **Error Handling**: Comprehensive error messages and validation
- **Loading States**: Visual feedback for all async operations

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Mobile Support

- iOS Safari 14+
- Chrome Mobile 90+
- Samsung Internet 14+
- Firefox Mobile 88+

---

## Version Numbering

- **Major** (X.0.0): Breaking changes
- **Minor** (0.X.0): New features, backward compatible
- **Patch** (0.0.X): Bug fixes, backward compatible

## Release Process

1. Update version numbers in package.json
2. Update this CHANGELOG.md
3. Create a git tag
4. Push to repository
5. Create GitHub release

## Contributing

When adding new features or fixing bugs, please update this changelog in the [Unreleased] section.
