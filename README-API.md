# API Configuration Guide

## Setup

1. **Configure API Base URL**: Edit `src/api/config.ts` and change the `API_BASE_URL` to your backend API endpoint:

```typescript
export const API_BASE_URL = 'https://your-api-domain.com/api';
```

## Available Services

### AuthService (`src/api/services/authService.ts`)
- `login(credentials)` - User authentication
- `logout()` - User logout
- `getCurrentUser()` - Get current user info
- `forgotPassword(email)` - Request password reset
- `resetPassword(token, newPassword)` - Reset password
- `verifyCode(code)` - Verify recovery code

### ScaleService (`src/api/services/scaleService.ts`)
- `getConfirmedScales()` - Get user's confirmed scales
- `getPendingScales()` - Get user's pending scales
- `getAllScales(page, limit)` - Get all scales (paginated)
- `createScale(scale)` - Create new scale
- `updateScale(id, scale)` - Update existing scale
- `deleteScale(id)` - Delete scale
- `confirmParticipation(scaleId)` - Confirm participation
- `rejectParticipation(scaleId)` - Reject participation

### UserService (`src/api/services/userService.ts`)
- `getProfile()` - Get user profile
- `updateProfile(userData)` - Update user profile
- `getAllUsers(page, limit)` - Get all users (admin)
- `createUser(userData)` - Create new user
- `changePassword(current, new)` - Change password

### AvailabilityService (`src/api/services/availabilityService.ts`)
- `getWeeklyAvailability()` - Get weekly availability
- `updateWeeklyAvailability(availability)` - Update weekly availability
- `getExceptionDates()` - Get exception dates
- `addExceptionDate(exception)` - Add exception date
- `deleteExceptionDate(id)` - Remove exception date

## Usage Examples

### Using with React Hooks

```typescript
import { useApi, useMutation } from '@/hooks/useApi';
import { scaleService } from '@/api';

// GET request
const { data, loading, error, refetch } = useApi(
  () => scaleService.getConfirmedScales(),
  { immediate: true }
);

// POST/PUT/DELETE requests
const { mutate, loading } = useMutation(
  (scaleData) => scaleService.createScale(scaleData),
  {
    onSuccess: () => {
      // Refetch data or show success message
      refetch();
    }
  }
);
```

### Authentication

```typescript
import { useAuth } from '@/hooks/useAuth';

const { login, logout, user, isAuthenticated } = useAuth();

// Login
await login('user@example.com', 'password');

// Logout
logout();
```

## Expected API Endpoints

Your backend should implement these endpoints:

### Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/verify-code` - Verify recovery code

### Scales
- `GET /api/scales/my-scales?status=Confirmada` - Get user's scales
- `GET /api/scales` - Get all scales (paginated)
- `POST /api/scales` - Create scale
- `PUT /api/scales/:id` - Update scale
- `DELETE /api/scales/:id` - Delete scale
- `POST /api/scales/:id/confirm` - Confirm participation
- `POST /api/scales/:id/reject` - Reject participation

### Users
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `POST /api/users/change-password` - Change password

### Availability
- `GET /api/availability/weekly` - Get weekly availability
- `PUT /api/availability/weekly` - Update weekly availability
- `GET /api/availability/exceptions` - Get exception dates
- `POST /api/availability/exceptions` - Add exception
- `DELETE /api/availability/exceptions/:id` - Remove exception

## Response Format

All API responses should follow this format:

```json
{
  "success": true,
  "data": {},
  "message": "Optional message"
}
```

For paginated responses:

```json
{
  "success": true,
  "data": {
    "data": [],
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

## Authentication

The API client automatically:
- Adds JWT token to Authorization header
- Redirects to login on 401 errors
- Handles token refresh if implemented

Make sure your backend accepts `Authorization: Bearer <token>` headers.