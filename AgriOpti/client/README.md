# AgriOpti - Modern Sustainable Farming 🌾

AgriOpti is an AI-driven, multilingual platform designed to empower farmers with precision climate intelligence, market analytics, and expert agricultural advice.

## 🚀 Key Features

- **PWA Ready**: Install the platform on any device directly from the browser for offline access and native-like performance.
- **Mobile Native (Android)**: Fully wrapped with Capacitor for a comprehensive mobile experience.
- **Precision Weather**: Real-time climate analysis with specific agricultural insights for crop management.
- **Expert System**: AI-driven Virtual Agronomist for localized pest and disease management strategies.
- **Dynamic Connection**: Fully standardized environment configuration for seamless local and production deployments.

## 📱 Mobile & PWA Support

AgriOpti is now a "complete app":
- **PWA**: Look for the "Install" prompt in your browser to add AgriOpti to your home screen.
- **Android**: The project includes a native Android folder (`android/`) ready for building in Android Studio.

## 🛠️ Development & Deployment

### Environment Setup
Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:8100
VITE_ML_API_URL=http://localhost:8000
```

### Installation
```bash
npm install
npm run dev
```

### Build & Sync
```bash
npm run build
npx cap sync
```

---
*Empowering sustainable farming with artificial intelligence.*
