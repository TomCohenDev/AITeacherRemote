# AI Teacher Assistant - Webapp Client

A professional React webapp for connecting to AI Teacher Assistant sessions. Built with modern web technologies and optimized for both mobile and desktop experiences.

## 🚀 Features

- **Manual Code Entry**: Enter 5-letter session codes with enhanced input validation
- **Manual Connect Button**: Click to connect with full user control over connection attempts
- **Real API Integration**: Connected to n8n backend with proper error handling
- **Device Detection**: Automatic mobile/desktop detection for optimal experience
- **Single Attempt Connection**: No auto-retry - users control when to retry
- **Responsive Design**: Mobile-first design that works perfectly on phones, tablets, and desktops
- **Real-time Connection**: Live connection status and session management
- **Modern UI**: Beautiful, accessible interface with smooth animations
- **TypeScript**: Full type safety and better development experience

## 🛠️ Technology Stack

- **React 18** with **TypeScript**
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Zustand** - Lightweight state management
- **Axios** - HTTP client for API requests
- **React Icons** - Beautiful icon library
- **React Hot Toast** - Toast notifications for user feedback

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Common components (Button, Input, Card)
│   ├── CodeInput.tsx    # Enhanced 5-letter code input component
│   └── layout/          # Layout components (Header, Footer)
├── pages/               # Page components
│   ├── ConnectionPage.tsx    # Main connection page
│   ├── SessionPage.tsx       # Session view after connection
│   └── NotFoundPage.tsx      # 404 page
├── services/            # API and service logic
│   └── api.ts          # Real n8n backend API integration
├── store/               # State management
│   └── sessionStore.ts  # Session state with Zustand
├── types/               # TypeScript type definitions
│   └── index.ts        # All type definitions
├── utils/               # Utility functions
│   └── helpers.ts      # Helper functions
├── styles/              # Global styles
│   └── index.css       # Tailwind imports and custom styles
├── App.tsx              # Main app component with routing
└── main.tsx             # App entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd AITeacherRemote
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables** (Optional)

   ```bash
   cp .env.example .env
   ```

   The app is pre-configured to use the production n8n backend. No environment setup required for basic usage.

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 📱 Usage

### Connecting to a Session

1. **Manual Code Entry**:

   - Type the 5-letter session code in the input boxes
   - Code will auto-format to uppercase
   - All 5 boxes must be filled to enable the Connect button
   - Click "Connect to Session" button to attempt connection
   - If connection fails, click "Connect" again to retry

2. **Connection Process**:
   - Single API call per button click (no auto-retry)
   - Real-time connection status feedback
   - Success/error toast notifications
   - Automatic navigation to session page on success

### Session Features

- View connection status and session information
- Device type detection (Mobile/Desktop)
- Access teacher's screen (when available)
- Use session controls (raise hand, ask questions, etc.)
- Disconnect from session
- Real-time API integration with n8n backend

## 🎨 Design System

### Colors

- **Primary**: `#667eea` (Purple-blue)
- **Secondary**: `#764ba2` (Purple)
- **Success**: `#48bb78` (Green)
- **Error**: `#f56565` (Red)
- **Background**: `#F5F7FA` (Light gray)
- **Text**: `#2d3748` (Dark gray)

### Responsive Breakpoints

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Touch Targets

- Minimum 44px for all interactive elements
- Optimized for mobile touch interaction

## 🔧 Configuration

### Environment Variables

| Variable                 | Description          | Default                                        |
| ------------------------ | -------------------- | ---------------------------------------------- |
| `VITE_API_URL`           | Backend API URL      | `https://n8n.yarden-zamir.com/webhook/ita/api` |
| `VITE_APP_NAME`          | Application name     | `AI Teacher Assistant`                         |
| `VITE_ENABLE_DEBUG_MODE` | Enable debug logging | `false`                                        |

### Tailwind Configuration

The app uses a custom Tailwind configuration with:

- Custom color palette
- Extended spacing and sizing
- Custom component classes
- Mobile-first responsive design

## 🧪 Testing

### Manual Testing Checklist

- [ ] **Mobile (320px - 480px)**

  - [ ] Manual code entry works correctly
  - [ ] Connect button enables/disables properly
  - [ ] Touch targets are properly sized
  - [ ] Navigation works smoothly
  - [ ] API connection works

- [ ] **Tablet (768px - 1024px)**

  - [ ] Layout adapts correctly
  - [ ] All features work as expected
  - [ ] Touch and mouse interaction work
  - [ ] API integration works

- [ ] **Desktop (1280px+)**
  - [ ] Full layout displays correctly
  - [ ] Hover states work properly
  - [ ] Keyboard navigation works
  - [ ] API connection works

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🚀 Deployment

### Production Build

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Deployment Options

1. **Static Hosting** (Netlify, Vercel, GitHub Pages)
2. **CDN** (Cloudflare, AWS CloudFront)
3. **Web Server** (Nginx, Apache)

### Environment Setup

The app is pre-configured for production with the n8n backend. No additional environment variables required.

## 🔮 Future Features

- [ ] QR code scanning functionality
- [ ] Real-time teacher screen sharing
- [ ] Voice/video communication
- [ ] Chat functionality
- [ ] File sharing
- [ ] Session recording
- [ ] Offline support
- [ ] Push notifications
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 📝 Changelog

### v1.1.0 (2024-12-19)

- **BREAKING**: Removed QR code scanning functionality
- **NEW**: Manual Connect button for user-controlled connection attempts
- **NEW**: Real n8n backend API integration
- **NEW**: Device type detection (mobile/desktop)
- **NEW**: Single attempt connection (no auto-retry)
- **IMPROVED**: Enhanced code input component with better UX
- **IMPROVED**: Simplified session management
- **IMPROVED**: Better error handling and user feedback

### v1.0.0 (2024-10-01)

- Initial release
- Manual code entry
- Responsive design
- Session management
- Modern UI with Tailwind CSS

---

**Built with ❤️ for better education**
