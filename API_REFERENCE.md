# BloodConnect API Reference Guide

**Version**: 1.0  
**Last Updated**: December 5, 2025

Complete reference for all interfaces, hooks, and component props in BloodConnect. This guide prevents API misuse by providing instant, accurate documentation.

---

## Table of Contents

1. [Core Interfaces](#core-interfaces)
2. [React Query Hooks](#react-query-hooks)
3. [API Response Structure](#api-response-structure)
4. [Authentication Types](#authentication-types)
5. [Error Handling](#error-handling)

---

## Core Interfaces

### 1. Donor Interface

**File**: `types/api.ts`

```typescript
interface Donor {
  id: string;
  name: string;
  email: string;
  bloodType: string;
  contact: string;
  address: string;
  barangay: string;
  lastDonation?: string;
  status: DonorStatus;
  emailAlerts: boolean;
}

type DonorStatus = 'active' | 'inactive' | string;
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `string` | ✅ | Unique donor identifier (Firebase UUID) |
| `name` | `string` | ✅ | Donor's full name |
| `email` | `string` | ✅ | Email address for contact |
| `bloodType` | `string` | ✅ | Blood type (e.g., "O+", "A-", "AB+") |
| `contact` | `string` | ✅ | Phone number for notifications |
| `address` | `string` | ✅ | Residential address |
| `barangay` | `string` | ✅ | Barangay/District name |
| `lastDonation` | `string` | ❌ | ISO date of last donation |
| `status` | `DonorStatus` | ✅ | Account status (active/inactive) |
| `emailAlerts` | `boolean` | ✅ | Opt-in for email notifications |

**Usage Example**:
```typescript
import { useDonor } from '@/app/hooks/queries/useDonors';

function DonorProfile({ donorId }: { donorId: string }) {
  const { data: donor, isLoading } = useDonor(donorId);
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>{donor.name}</h1>
      <p>Blood Type: {donor.bloodType}</p>
      <p>Status: {donor.status}</p>
    </div>
  );
}
```

---

### 2. Request Interface (Blood Request)

**File**: `types/api.ts`

```typescript
interface Request {
  id: string;
  hospitalName: string;
  bloodType: string;
  quantity: number;
  urgency: Urgency;
  notes?: string;
  status: RequestStatus;
  createdAt: string;
  matchedDonors: number;
}

type RequestStatus = 'active' | 'fulfilled' | string;
type Urgency = 'normal' | 'urgent' | 'critical' | string;
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `string` | ✅ | Unique request identifier |
| `hospitalName` | `string` | ✅ | Name of requesting hospital |
| `bloodType` | `string` | ✅ | Required blood type |
| `quantity` | `number` | ✅ | Units of blood needed |
| `urgency` | `Urgency` | ✅ | Priority level (normal/urgent/critical) |
| `notes` | `string` | ❌ | Additional notes or requirements |
| `status` | `RequestStatus` | ✅ | Current status (active/fulfilled) |
| `createdAt` | `string` | ✅ | ISO timestamp of creation |
| `matchedDonors` | `number` | ✅ | Count of eligible donors |

**Urgency Levels**:
- `normal` - Regular request, can wait 2-3 days
- `urgent` - Needed within 24 hours
- `critical` - Life-threatening, immediate need

**Usage Example**:
```typescript
import { useRequests } from '@/app/hooks/queries/useRequests';

function RequestsList() {
  // Filter only urgent/critical requests
  const { data: requests } = useRequests({ 
    status: 'active' 
  });
  
  const urgentRequests = requests?.filter(
    r => r.urgency === 'urgent' || r.urgency === 'critical'
  ) || [];
  
  return (
    <div>
      {urgentRequests.map(req => (
        <div key={req.id}>
          <h3>{req.hospitalName}</h3>
          <p>{req.quantity} units {req.bloodType} - {req.urgency}</p>
        </div>
      ))}
    </div>
  );
}
```

---

### 3. Alert Interface

**File**: `types/api.ts`

```typescript
interface Alert {
  id: string;
  title: string;
  message: string;
  hospitalName: string;
  bloodType: string;
  quantity: number;
  sentAt: string;
  status: AlertStatus;
}

type AlertStatus = 'sent' | 'fulfilled' | string;
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `string` | ✅ | Unique alert identifier |
| `title` | `string` | ✅ | Alert title/subject |
| `message` | `string` | ✅ | Alert message content |
| `hospitalName` | `string` | ✅ | Hospital requesting blood |
| `bloodType` | `string` | ✅ | Required blood type |
| `quantity` | `number` | ✅ | Units needed |
| `sentAt` | `string` | ✅ | ISO timestamp of alert send |
| `status` | `AlertStatus` | ✅ | Status (sent/fulfilled) |

---

### 4. Analytics Interface

**File**: `types/api.ts`

```typescript
interface Analytics {
  totalDonors: number;
  activeRequests: number;
  totalRequests: number;
  donorsByBloodType: Record<string, number>;
  donorsByBarangay: Record<string, number>;
  recentActivity: { date: string; event: string; count: number }[];
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `totalDonors` | `number` | ✅ | Total registered donors |
| `activeRequests` | `number` | ✅ | Currently active requests |
| `totalRequests` | `number` | ✅ | All-time requests |
| `donorsByBloodType` | `Record<string, number>` | ✅ | Distribution by blood type |
| `donorsByBarangay` | `Record<string, number>` | ✅ | Distribution by location |
| `recentActivity` | `Activity[]` | ✅ | Last 30 days activity log |

**Usage Example**:
```typescript
import { useAnalytics } from '@/app/hooks/queries/useAnalytics';

function DashboardStats() {
  const { data: analytics } = useAnalytics();
  
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>Total Donors: {analytics?.totalDonors}</div>
      <div>Active Requests: {analytics?.activeRequests}</div>
    </div>
  );
}
```

---

### 5. Appointment Interface

**File**: `types/appointments.ts`

```typescript
interface Appointment {
  id: number | string;
  donorId: number | string;
  donorName: string;
  hospitalId: string;
  hospitalName: string;
  date: string; // ISO date string (YYYY-MM-DD)
  timeSlot: string; // e.g., "09:00-09:30"
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  reminderSent: boolean;
}

type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `number \| string` | ✅ | Unique appointment ID |
| `donorId` | `number \| string` | ✅ | Donor identifier |
| `donorName` | `string` | ✅ | Donor's name (denormalized) |
| `hospitalId` | `string` | ✅ | Hospital identifier |
| `hospitalName` | `string` | ✅ | Hospital name (denormalized) |
| `date` | `string` | ✅ | Appointment date (YYYY-MM-DD) |
| `timeSlot` | `string` | ✅ | Time slot (HH:MM-HH:MM) |
| `status` | `AppointmentStatus` | ✅ | Current status |
| `notes` | `string` | ❌ | Additional notes |
| `createdAt` | `string` | ✅ | Creation timestamp |
| `updatedAt` | `string` | ✅ | Last update timestamp |
| `reminderSent` | `boolean` | ✅ | Reminder sent flag |

---

### 6. DonationRecord Interface

**File**: `types/appointments.ts`

```typescript
interface DonationRecord {
  id: number | string;
  donorId: number | string;
  date: string;
  hospitalId: string;
  hospitalName: string;
  bloodType: string;
  units: number;
  status: 'completed' | 'rejected' | 'deferred';
  notes?: string;
  certificateId?: string;
  createdAt: string;
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `number \| string` | ✅ | Unique record ID |
| `donorId` | `number \| string` | ✅ | Donor identifier |
| `date` | `string` | ✅ | Donation date (ISO) |
| `hospitalId` | `string` | ✅ | Hospital where donated |
| `hospitalName` | `string` | ✅ | Hospital name |
| `bloodType` | `string` | ✅ | Blood type donated |
| `units` | `number` | ✅ | Units collected |
| `status` | `string` | ✅ | completed/rejected/deferred |
| `notes` | `string` | ❌ | Medical notes |
| `certificateId` | `string` | ❌ | Certificate reference |
| `createdAt` | `string` | ✅ | Record creation timestamp |

---

### 7. Badge Interface (Gamification)

**File**: `types/appointments.ts`

```typescript
type BadgeType = 
  | 'first-donation'
  | 'regular-donor'    // 3+ donations
  | 'hero-donor'       // 10+ donations
  | 'life-saver'       // 25+ donations
  | 'legend'           // 50+ donations
  | 'rare-blood'       // Rare blood type donor
  | 'quick-responder'  // Responded to urgent request
  | 'community-champion'; // Referred 5+ donors

interface Badge {
  id: string;
  type: BadgeType;
  name: string;
  description: string;
  icon: string; // SVG or URL
  earnedAt: string; // ISO timestamp
  level?: number; // For progressive badges
}
```

**Badge Requirements**:
| Badge | Type | Requirement |
|-------|------|-------------|
| First Donation | `first-donation` | Complete first donation |
| Regular Donor | `regular-donor` | 3+ donations |
| Hero Donor | `hero-donor` | 10+ donations |
| Life Saver | `life-saver` | 25+ donations |
| Legend | `legend` | 50+ donations |
| Rare Blood | `rare-blood` | Have rare blood type (AB+, AB-, B-) |
| Quick Responder | `quick-responder` | Respond to urgent request within 2 hours |
| Community Champion | `community-champion` | Refer 5+ donors |

---

### 8. DonorStats Interface

**File**: `types/appointments.ts`

```typescript
interface DonorStats {
  totalDonations: number;
  livesSaved: number; // totalDonations * 3
  streakDays: number;
  lastDonation: string | null;
  nextEligibleDate: string | null;
  rank: number; // Leaderboard position
  points: number;
  badges: Badge[];
}
```

| Property | Type | Description |
|----------|------|-------------|
| `totalDonations` | `number` | Total times donor has given blood |
| `livesSaved` | `number` | Calculated as totalDonations × 3 |
| `streakDays` | `number` | Consecutive days of activity |
| `lastDonation` | `string \| null` | ISO date of last donation |
| `nextEligibleDate` | `string \| null` | Date eligible to donate again (56 days) |
| `rank` | `number` | Position in leaderboard (1-indexed) |
| `points` | `number` | Total gamification points |
| `badges` | `Badge[]` | Array of earned badges |

**Usage Example**:
```typescript
function DonorStatsCard({ donorId }: { donorId: string }) {
  const { data: donor } = useDonor(donorId);
  
  return (
    <div>
      <h2>{donor?.name}</h2>
      <p>Donations: {donor?.totalDonations} | Lives Saved: {donor?.livesSaved}</p>
      <p>Rank: #{donor?.rank}</p>
      <div className="badges">
        {donor?.badges.map(badge => (
          <span key={badge.id} title={badge.description}>
            {badge.name}
          </span>
        ))}
      </div>
    </div>
  );
}
```

---

## React Query Hooks

### Donor Hooks

**File**: `app/hooks/queries/useDonors.ts`

#### `useDonors(filters?)`

Fetch all donors with optional filtering.

```typescript
function useDonors(filters?: DonorFilters): UseQueryResult<Donor[]>
```

| Parameter | Type | Optional | Description |
|-----------|------|----------|-------------|
| `filters` | `DonorFilters` | ✅ | Filter by bloodType, barangay, status, search |

**Returns**:
- `data: Donor[]` - Array of donors
- `isLoading: boolean` - Loading state
- `error: Error | null` - Error if fetch fails
- `refetch()` - Manual refetch function

**Usage**:
```typescript
// Fetch all donors
const { data: allDonors } = useDonors();

// Fetch with filters
const { data: o_donors } = useDonors({ bloodType: 'O+' });
const { data: malolos_donors } = useDonors({ barangay: 'Malolos' });
const { data: active } = useDonors({ status: 'active' });
```

---

#### `useDonor(id)`

Fetch a single donor by ID.

```typescript
function useDonor(id: number | string): UseQueryResult<Donor>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | `number \| string` | ✅ | Donor ID |

**Returns**:
- `data: Donor` - Single donor object
- `isLoading: boolean` - Loading state
- `error: Error | null` - Error if fetch fails

**Usage**:
```typescript
const { data: donor } = useDonor('donor-123');

// Query only enabled if ID exists
const { data: donor } = useDonor(donorId || '');
```

---

#### `useDonorEligibility(lastDonationDate)`

Check if donor is eligible to donate again.

```typescript
function useDonorEligibility(
  lastDonationDate: string | null | undefined
): UseQueryResult<{ isEligible: boolean; daysRemaining: number }>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `lastDonationDate` | `string \| null \| undefined` | ✅ | ISO date of last donation |

**Returns**:
- `isEligible: boolean` - Can donate now (56+ days since last donation)
- `daysRemaining: number` - Days until eligible (0 if eligible)
- `daysSinceLastDonation: number` - Days since last donation

**Usage**:
```typescript
const { data: eligibility } = useDonorEligibility(donor.lastDonation);

if (eligibility?.isEligible) {
  return <button>Schedule Donation</button>;
} else {
  return <p>Eligible in {eligibility?.daysRemaining} days</p>;
}
```

---

#### `useCreateDonor()`

Create a new donor.

```typescript
function useCreateDonor(): UseMutationResult<Donor, Error, DonorCreateInput>
```

**Returns**:
- `mutate(data)` - Submit new donor
- `isPending: boolean` - Submission in progress
- `isError: boolean` - Submit failed
- `error: Error | null` - Error message

**Usage**:
```typescript
const { mutate: createDonor, isPending } = useCreateDonor();

const handleSubmit = async (formData) => {
  createDonor(
    {
      name: formData.name,
      email: formData.email,
      bloodType: formData.bloodType,
      contact: formData.phone,
      address: formData.address,
      barangay: formData.barangay,
      emailAlerts: true,
    },
    {
      onSuccess: (newDonor) => {
        toast.success(`${newDonor.name} registered!`);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};
```

---

#### `useUpdateDonor()`

Update an existing donor.

```typescript
function useUpdateDonor(): UseMutationResult<Donor, Error, {
  id: number | string;
  data: Partial<Donor>;
}>
```

**Returns**:
- `mutate({ id, data })` - Submit update
- `isPending: boolean` - Update in progress

**Usage**:
```typescript
const { mutate: updateDonor } = useUpdateDonor();

updateDonor(
  {
    id: donor.id,
    data: { emailAlerts: false },
  },
  {
    onSuccess: () => {
      toast.success('Updated preferences');
    },
  }
);
```

---

#### `useDeleteDonor()`

Deactivate/delete a donor.

```typescript
function useDeleteDonor(): UseMutationResult<any, Error, number | string>
```

**Returns**:
- `mutate(id)` - Delete donor
- `isPending: boolean` - Deletion in progress

**Usage**:
```typescript
const { mutate: deleteDonor } = useDeleteDonor();

if (confirm('Deactivate this donor?')) {
  deleteDonor(donorId);
}
```

---

### Request Hooks

**File**: `app/hooks/queries/useRequests.ts`

#### `useRequests(filters?)`

Fetch blood requests.

```typescript
function useRequests(filters?: RequestFilters): UseQueryResult<Request[]>
```

**Usage**:
```typescript
// All requests
const { data: requests } = useRequests();

// Only active
const { data: active } = useRequests({ status: 'active' });

// By blood type
const { data: o_requests } = useRequests({ bloodType: 'O+' });
```

---

#### `useRequest(id)`

Fetch single request details.

```typescript
function useRequest(id: number | string): UseQueryResult<Request>
```

---

#### `useCreateRequest()`

Create new blood request.

```typescript
const { mutate: createRequest, isPending } = useCreateRequest();

createRequest({
  hospitalName: 'PGH',
  bloodType: 'O-',
  quantity: 10,
  urgency: 'critical',
  notes: 'Emergency surgery',
});
```

---

#### `useUpdateRequest()`

Update request details.

```typescript
const { mutate: updateRequest } = useUpdateRequest();

updateRequest({
  id: requestId,
  data: { quantity: 15, urgency: 'urgent' },
});
```

---

#### `useUpdateRequestStatus()`

Change request status.

```typescript
const { mutate: updateStatus } = useUpdateRequestStatus();

// Mark as fulfilled
updateStatus({
  id: requestId,
  status: 'fulfilled',
});
```

---

#### `useFulfillRequest()`

Mark request as fulfilled.

```typescript
const { mutate: fulfill } = useFulfillRequest();

fulfill(requestId);
```

---

#### `useDeleteRequest()`

Delete request.

```typescript
const { mutate: deleteRequest } = useDeleteRequest();

deleteRequest(requestId);
```

---

### Alert Hooks

**File**: `app/hooks/queries/useAlerts.ts`

#### `useAlerts(filters?)`

Fetch alerts.

```typescript
function useAlerts(filters?: AlertFilters): UseQueryResult<Alert[]>
```

---

#### `useDonorAlerts(donorId)`

Fetch alerts for specific donor.

```typescript
const { data: alerts } = useDonorAlerts(donorId);
```

---

#### `useSendBulkAlert()`

Send alert to multiple donors.

```typescript
const { mutate: sendAlert } = useSendBulkAlert();

sendAlert({
  requestId: 1,
  donorIds: [101, 102, 103],
});
```

---

### Analytics Hooks

**File**: `app/hooks/queries/useAnalytics.ts`

#### `useAnalytics()`

Fetch dashboard analytics.

```typescript
const { data: analytics } = useAnalytics();

// Use data
const totalDonors = analytics?.totalDonors;
const active = analytics?.activeRequests;
```

---

#### `useBloodTypeStats()`

Get blood type distribution.

```typescript
const { data: stats } = useBloodTypeStats();
// Returns: { 'O+': 150, 'A+': 120, 'B+': 95, ... }
```

---

#### `useBarangayStats()`

Get location distribution.

```typescript
const { data: stats } = useBarangayStats();
// Returns: { 'Malolos': 200, 'Hagonoy': 150, ... }
```

---

### Auth Hooks

**File**: `app/hooks/queries/useAuth.ts`

#### `useCurrentUser()`

Get logged-in user.

```typescript
interface AuthUser {
  id: number | string;
  email: string;
  name: string;
  role: 'donor' | 'admin';
  bloodType?: string;
}

const { data: user } = useCurrentUser();
```

---

#### `useLogin()`

Login user.

```typescript
const { mutate: login, isPending } = useLogin();

login({
  email: 'user@example.com',
  password: 'password123',
  role: 'donor',
});
```

---

#### `useRegister()`

Register new user.

```typescript
const { mutate: register } = useRegister();

register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  bloodType: 'O+',
  contact: '09123456789',
  address: '123 Main St',
  barangay: 'Malolos',
  emailAlerts: true,
});
```

---

#### `useLogout()`

Logout user.

```typescript
const { mutate: logout } = useLogout();

logout();
```

---

#### `useIsAuthenticated()`

Check authentication status.

```typescript
const { isAuthenticated, isLoading, user } = useIsAuthenticated();

if (isLoading) return <div>Loading...</div>;

return isAuthenticated ? <Dashboard /> : <Login />;
```

---

## API Response Structure

All API endpoints return a standardized response:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
```

**Example Response (Success)**:
```json
{
  "success": true,
  "data": {
    "id": "donor-123",
    "name": "Juan dela Cruz",
    "bloodType": "O+",
    "status": "active"
  },
  "message": "Donor fetched successfully"
}
```

**Example Response (Error)**:
```json
{
  "success": false,
  "error": "Donor not found",
  "message": "The requested donor does not exist"
}
```

---

## Authentication Types

### LoginCredentials

```typescript
interface LoginCredentials {
  email: string;
  password: string;
}
```

### RegisterData

```typescript
interface RegisterData {
  name: string;
  email: string;
  password: string;
  bloodType: string;
  contact: string;
  address: string;
  barangay: string;
  lastDonation?: string;
  emailAlerts?: boolean;
}
```

### AuthUser

```typescript
interface AuthUser {
  id: number | string;
  email: string;
  name: string;
  role: 'donor' | 'admin';
  bloodType?: string;
}
```

---

## Error Handling

### Common Error Scenarios

| Error | Cause | Solution |
|-------|-------|----------|
| "Failed to fetch donors" | API endpoint down or network error | Check network connection, retry |
| "Donor not found" | Invalid ID passed | Verify donor ID exists |
| "Login failed" | Wrong email/password | Check credentials |
| "Registration failed" | Email already exists | Use different email |
| "Unauthorized" | Missing/invalid auth token | Re-login |

### Best Practices

```typescript
// Always handle errors in mutations
const { mutate: createDonor } = useCreateDonor();

createDonor(donorData, {
  onSuccess: (donor) => {
    console.log('Created:', donor);
    // Refetch or navigate
  },
  onError: (error) => {
    console.error('Failed:', error.message);
    // Show toast/alert to user
    toast.error(error.message);
  },
});

// Check loading state before rendering
const { data: donors, isLoading, error } = useDonors();

if (isLoading) return <Skeleton />;
if (error) return <ErrorAlert message={error.message} />;
if (!donors?.length) return <EmptyState />;

return <DonorsList donors={donors} />;
```

---

## Quick Reference Cheatsheet

### Fetch Donor Data
```typescript
// Get all
useDonors()

// Get one
useDonor(id)

// Check eligibility
useDonorEligibility(lastDonationDate)
```

### Manage Donors
```typescript
// Create
useCreateDonor().mutate(donorData)

// Update
useUpdateDonor().mutate({ id, data })

// Delete
useDeleteDonor().mutate(id)
```

### Fetch Requests
```typescript
// Get all
useRequests()

// Get one
useRequest(id)
```

### Manage Requests
```typescript
// Create
useCreateRequest().mutate(requestData)

// Update
useUpdateRequest().mutate({ id, data })

// Change status
useUpdateRequestStatus().mutate({ id, status })

// Mark fulfilled
useFulfillRequest().mutate(id)

// Delete
useDeleteRequest().mutate(id)
```

### Analytics
```typescript
// Dashboard stats
useAnalytics()

// Blood type dist.
useBloodTypeStats()

// Location dist.
useBarangayStats()
```

### Authentication
```typescript
// Get current user
useCurrentUser()

// Login
useLogin().mutate({ email, password, role })

// Register
useRegister().mutate(registerData)

// Logout
useLogout().mutate()

// Check if logged in
useIsAuthenticated()
```

---

**For more information, refer to**:
- `TECHNICAL_DOCUMENTATION.md` - System architecture and design
- `middleware.ts` - Route protection and auth checks
- `lib/dataFetching.ts` - Data fetching patterns (SSR/SSG/ISR)

