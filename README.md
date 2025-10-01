# AI Teacher Assistant - Webapp Client

A professional React webapp for connecting to AI Teacher Assistant sessions. Built with modern web technologies and optimized for both mobile and desktop experiences.

## 🚀 Features

- **QR Code Scanning**: Connect to sessions by scanning QR codes with your device camera
- **Manual Code Entry**: Enter 5-letter session codes manually with auto-focus and validation
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
- **React Hot Toast** - Toast notifications
- **@yudiel/react-qr-scanner** - QR code scanning

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Common components (Button, Input, Card)
│   └── layout/          # Layout components (Header, Footer)
├── pages/               # Page components
│   ├── ConnectionPage.tsx    # Main connection page
│   ├── SessionPage.tsx       # Session view after connection
│   └── NotFoundPage.tsx      # 404 page
├── services/            # API and service logic
│   └── api.ts          # API calls to n8n backend
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

3. **Setup environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` file with your configuration:

   ```env
   REACT_APP_API_URL=http://localhost:5678
   ```

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

1. **QR Code Method**:

   - Click "Scan QR Code" tab
   - Grant camera permission when prompted
   - Point camera at the QR code
   - Wait for automatic connection

2. **Manual Code Method**:
   - Click "Enter Code" tab
   - Type the 5-letter session code
   - Code will auto-format to uppercase
   - Click "Connect to Session"

### Session Features

- View connection status
- See session information
- Access teacher's screen (when available)
- Use session controls (raise hand, ask questions, etc.)
- Disconnect from session

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

| Variable                      | Description          | Default                 |
| ----------------------------- | -------------------- | ----------------------- |
| `REACT_APP_API_URL`           | Backend API URL      | `http://localhost:5678` |
| `REACT_APP_APP_NAME`          | Application name     | `AI Teacher Assistant`  |
| `REACT_APP_ENABLE_QR_SCANNER` | Enable QR scanning   | `true`                  |
| `REACT_APP_ENABLE_DEBUG_MODE` | Enable debug logging | `false`                 |

### Tailwind Configuration

The app uses a custom Tailwind configuration with:

- Custom color palette
- Extended spacing and sizing
- Custom component classes
- Mobile-first responsive design

## 🧪 Testing

### Manual Testing Checklist

- [ ] **Mobile (320px - 480px)**

  - [ ] QR scanner works with camera permission
  - [ ] Manual code entry works correctly
  - [ ] Touch targets are properly sized
  - [ ] Navigation works smoothly

- [ ] **Tablet (768px - 1024px)**

  - [ ] Layout adapts correctly
  - [ ] All features work as expected
  - [ ] Touch and mouse interaction work

- [ ] **Desktop (1280px+)**
  - [ ] Full layout displays correctly
  - [ ] Hover states work properly
  - [ ] Keyboard navigation works

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

Make sure to set the following environment variables in production:

- `REACT_APP_API_URL` - Your production API URL
- `REACT_APP_APP_NAME` - Your app name
- Any other required variables

## 🔮 Future Features

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

### v1.0.0 (2024-10-01)

- Initial release
- QR code scanning functionality
- Manual code entry
- Responsive design
- Session management
- Modern UI with Tailwind CSS

---

**Built with ❤️ for better education**
