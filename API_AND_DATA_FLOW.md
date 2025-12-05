# API & Data Flow Documentation

## 1. API Design (Firebase Integration)

The application uses **Firebase** as its backend-as-a-service (BaaS), utilizing **Firebase Authentication** for user management and **Cloud Firestore** for the NoSQL database.

### Authentication Endpoints (Firebase Auth)

#### Login
*   **Method:** `signInWithEmailAndPassword` (SDK function)
*   **Request Parameters:**
    *   `email`: string
    *   `password`: string
*   **Response Body:** `UserCredential` object containing `user` details (uid, email, etc.)
*   **Status Codes:**
    *   `200 OK`: Success
    *   `400 Bad Request`: Invalid email/password (`auth/invalid-credential`)
    *   `403 Forbidden`: Account disabled

#### Register
*   **Method:** `createUserWithEmailAndPassword` (SDK function)
*   **Request Parameters:**
    *   `email`: string
    *   `password`: string
*   **Response Body:** `UserCredential` object
*   **Status Codes:**
    *   `200 OK`: Success
    *   `400 Bad Request`: Email already in use (`auth/email-already-in-use`)

### Data Endpoints (Cloud Firestore)

The application interacts with Firestore collections: `donors`, `requests`, `appointments`.

#### Get Requests
*   **Method:** `getDocs` (SDK function)
*   **Collection:** `requests`
*   **Query Parameters (Filters):**
    *   `status`: 'active' | 'fulfilled'
    *   `bloodType`: string
*   **Response Body:** Array of `Request` objects
*   **Status Codes:**
    *   `200 OK`: Success
    *   `500 Internal Server Error`: Permission denied or network error

#### Create Request
*   **Method:** `addDoc` (SDK function)
*   **Collection:** `requests`
*   **Request Body:**
    ```json
    {
      "hospitalName": "General Hospital",
      "bloodType": "A+",
      "quantity": 2,
      "urgency": "urgent",
      "status": "active",
      "createdAt": "2023-10-27T10:00:00Z"
    }
    ```
*   **Response Body:** `DocumentReference` (contains new ID)

---

## 2. React Query Implementation

The application uses **TanStack Query (React Query)** for server state management, caching, and synchronization.

### Provider Configuration
Located in `app/providers/QueryProvider.tsx`.
*   **Client:** `QueryClient` initialized with default options.
*   **Stale Time:** `5 minutes` (Data is considered fresh for 5 minutes).
*   **GC Time:** `10 minutes` (Unused data remains in cache for 10 minutes).
*   **Refetch on Window Focus:** `false` (Prevents unnecessary network requests).
*   **Retry:** `1` (Retries failed requests once).

### Query Keys
Structured query keys are defined in `app/hooks/queries/queryKeys.ts` to ensure consistency and enable effective cache invalidation.

```typescript
export const queryKeys = {
  auth: {
    user: ['auth', 'user'],
  },
  requests: {
    all: ['requests'],
    list: (filters) => ['requests', 'list', filters],
    detail: (id) => ['requests', 'detail', id],
  },
  donors: {
    all: ['donors'],
    list: (filters) => ['donors', 'list', filters],
    detail: (id) => ['donors', 'detail', id],
  },
  // ...
};
```

### Error Handling
*   **Global Level:** React Query's `useQuery` and `useMutation` hooks return an `error` object.
*   **Component Level:** Components check `isError` and display user-friendly messages based on `error.message`.
*   **Service Level:** API functions in `lib/api.js` catch Firebase errors and return a standardized response object `{ success: boolean, error?: string }` or throw errors that are caught by React Query.

---

## 3. Fetched Data Structure

The data fetched from the API is typed using TypeScript interfaces in `types/api.ts`.

### Request Object
```typescript
interface Request {
  id: string;
  hospitalName: string;
  bloodType: string;
  quantity: number;
  urgency: 'normal' | 'urgent' | 'critical';
  notes?: string;
  status: 'active' | 'fulfilled';
  createdAt: string;
  matchedDonors: number;
}
```

### Donor Object
```typescript
interface Donor {
  id: string;
  name: string;
  email: string;
  bloodType: string;
  contact: string;
  address: string;
  barangay: string;
  status: 'active' | 'inactive';
  lastDonation?: string;
}
```
