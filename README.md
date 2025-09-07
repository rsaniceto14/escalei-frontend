# E-Church Management System

A comprehensive church management application built with React, TypeScript, and modern web technologies. The app includes features for scale management, user availability tracking, and administrative functions.

## Project Info

**URL**: https://lovable.dev/projects/f093c655-0a0e-401d-9f09-7ea8b859fb3c

## Features

- **Scale Management**: Create, view, and manage church service scales
- **User Availability**: Set weekly availability and exception dates
- **Authentication System**: User login and profile management
- **Responsive Design**: Works on desktop and mobile devices
- **API Integration**: Ready-to-use service layer for backend connectivity
- **Mobile App Support**: Native mobile app capabilities via Capacitor

## Technology Stack

This project is built with:
- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn-ui, Tailwind CSS
- **State Management**: React Hooks, Custom API hooks
- **HTTP Client**: Axios for API communication
- **Mobile**: Capacitor for native mobile apps
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Local Development

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

## API Configuration

The application includes a complete API service layer for backend integration.

### Setup API Connection

1. **Configure API Base URL**: Edit `src/api/config.ts`:

```typescript
export const API_BASE_URL = 'https://your-api-domain.com/api';
```

### Available Services

- **AuthService**: User authentication, login/logout, password management
- **ScaleService**: Scale CRUD operations, participation management
- **UserService**: User profile management, admin functions
- **AvailabilityService**: Weekly availability and exception date management

### Usage Example

```typescript
import { useApi, useMutation } from '@/hooks/useApi';
import { scaleService } from '@/api';

// GET request with loading states
const { data, loading, error, refetch } = useApi(
  () => scaleService.getConfirmedScales(),
  { immediate: true }
);

// POST/PUT/DELETE operations
const { mutate, loading } = useMutation(
  (scaleData) => scaleService.createScale(scaleData),
  {
    onSuccess: () => refetch()
  }
);
```

### Expected Backend Endpoints

Your backend should implement:

- **Authentication**: `/api/auth/*` (login, logout, profile)
- **Scales**: `/api/scales/*` (CRUD operations, participation)
- **Users**: `/api/users/*` (profile, user management)
- **Availability**: `/api/availability/*` (weekly schedule, exceptions)

See `README-API.md` for complete API documentation.

## Mobile App Development

This project supports native mobile app development using Capacitor.

### Development Setup (Hot Reload)

The app is pre-configured for mobile development with hot reload capabilities. Simply run the project and access it from your mobile browser for testing.

### Building for Mobile Devices

To run on physical devices or emulators:

1. **Export to GitHub**: Use the "Export to GitHub" button in Lovable
2. **Clone and install**:
   ```sh
   git clone <your-repo-url>
   cd <project-name>
   npm install
   ```

3. **Add mobile platforms**:
   ```sh
   # For iOS (requires Mac with Xcode)
   npx cap add ios
   
   # For Android (requires Android Studio)
   npx cap add android
   ```

4. **Update and build**:
   ```sh
   npx cap update ios    # or android
   npm run build
   npx cap sync
   ```

5. **Run on device**:
   ```sh
   npx cap run ios       # for iOS
   npx cap run android   # for Android
   ```

### Mobile Configuration

The Capacitor configuration is located in `capacitor.config.ts`:
- **App ID**: `app.lovable.f093c6550a0e401d9f097ea8b859fb3c`
- **App Name**: `e-church`
- **Hot Reload**: Enabled for development

## How to Edit This Code

### Using Lovable (Recommended)

Visit the [Lovable Project](https://lovable.dev/projects/f093c655-0a0e-401d-9f09-7ea8b859fb3c) and start prompting. Changes are automatically committed to this repo.

### Using Your Preferred IDE

Clone this repo and push changes. All changes will be reflected in Lovable.

### GitHub Codespaces

1. Navigate to the repository main page
2. Click "Code" → "Codespaces" → "New codespace"
3. Edit files and commit changes directly

## Project Structure

```
src/
├── api/                 # API service layer
│   ├── config.ts       # Axios configuration
│   ├── types.ts        # TypeScript interfaces
│   └── services/       # Service implementations
├── components/         # Reusable UI components
│   ├── ui/            # shadcn-ui components
│   ├── dashboard/     # Dashboard-specific components
│   └── common/        # Shared components
├── hooks/             # Custom React hooks
├── pages/             # Page components
└── utils/             # Utility functions
```

## Deployment

### Web Deployment

Open [Lovable](https://lovable.dev/projects/f093c655-0a0e-401d-9f09-7ea8b859fb3c) and click Share → Publish.

### Custom Domain

Navigate to Project → Settings → Domains and click Connect Domain.

Read more: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

### Mobile App Store Deployment

After building with Capacitor:
1. **iOS**: Open the project in Xcode and follow Apple's App Store guidelines
2. **Android**: Open in Android Studio and follow Google Play Store guidelines

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (web and mobile if applicable)
5. Submit a pull request

## Support

- [Lovable Documentation](https://docs.lovable.dev/)
- [Lovable Discord Community](https://discord.com/channels/1119885301872070706/1280461670979993613)
- [Troubleshooting Guide](https://docs.lovable.dev/tips-tricks/troubleshooting)

## License

This project is built with Lovable and follows standard web development practices.