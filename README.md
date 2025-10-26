# Escalei Management System

A comprehensive church management application built with React, TypeScript, and modern web technologies. The app includes features for scale management, user availability tracking, and administrative functions.

## Project Info

**URL**: https://escalei.com.br

## Features

- **Scale Management**: Create, view, and manage church service scales
- **User Availability**: Set weekly availability and exception dates
- **Invites & Approvals**: Send invites and approve self-registered users by area
- **Area/Function Management**: Create and manage church areas and functions
- **Authentication System**: User login and profile management
- **Responsive Design**: Mobile-first design with optimized layouts
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
- **App ID**: `com.escalei.app`
- **App Name**: `escalei`
- **Hot Reload**: Enabled for development

## How to Edit This Code

### Using Your Preferred IDE

Clone this repo and start developing. All changes will be reflected in the application.

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
│   ├── schedules/     # Schedule management components
│   ├── availability/  # Availability management
│   └── common/        # Shared components
├── hooks/             # Custom React hooks
├── pages/             # Page components
│   ├── setup/        # Setup and configuration pages
│   └── ...           # Main application pages
└── utils/             # Utility functions
```

## Deployment

### Web Deployment

Deploy your application using your preferred hosting service.

### Custom Domain

Navigate to Project → Settings → Domains and click Connect Domain.

Configure your custom domain through your hosting provider.


