# User Authentication Technical Implementation Plan

**Feature**: user-auth  
**Version**: 1.0.0  
**Date**: 2025-07-22  
**Status**: Ready for Implementation  
**Dependencies**: core-todo feature (must be completed)

## Table of Contents

1. [Current State Analysis](#1-current-state-analysis)
2. [Proposed Solution Architecture](#2-proposed-solution-architecture)
3. [Implementation Steps](#3-implementation-steps)
4. [Technical Requirements](#4-technical-requirements)
5. [Data/API Considerations](#5-dataapi-considerations)
6. [Testing Plan](#6-testing-plan)
7. [Timeline & Milestones](#7-timeline--milestones)
8. [Risk Assessment](#8-risk-assessment)
9. [Integration Points](#9-integration-points)

## 1. Current State Analysis

### 1.1 Project Overview

The Simple Todo application currently exists as a client-side only application with:

- **Frontend**: Next.js 15.4.2, React 19.1.0, TypeScript
- **State Management**: Zustand 4.5.0 with Immer for immutability
- **Styling**: Tailwind CSS 4
- **Architecture**: Feature-first pattern with clear separation of concerns
- **Data Storage**: localStorage for todo persistence
- **Testing**: Jest setup ready but minimal test coverage

### 1.2 Existing Structure

```
src/
├── app/              # Next.js App Router
├── features/         # Feature modules (currently empty)
├── shared/          # Shared components/utils
└── styles/          # Global styles
```

### 1.3 Missing Components

- No authentication system
- No backend/database integration
- No user management
- No server-side state management
- No API routes implemented
- No security measures

### 1.4 Migration Requirements

- Existing users have todos stored in localStorage
- Must preserve todo data during account creation
- Need seamless migration without data loss
- Critical for user retention

## 2. Proposed Solution Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (Browser)                         │
├─────────────────────────────────────────────────────────────────┤
│  Next.js App                                                    │
│  ├── App Router Pages (/auth/*, /profile/*)                    │
│  ├── Feature Components (features/user-auth/*)                  │
│  └── Zustand Stores (Auth, Session, Profile, Migration)        │
├─────────────────────────────────────────────────────────────────┤
│                      NextAuth.js Layer                          │
│  ├── Providers (Email, Google, GitHub)                         │
│  ├── JWT Session Management                                    │
│  └── CSRF Protection                                          │
├─────────────────────────────────────────────────────────────────┤
│                    API Routes (/api/*)                          │
│  ├── /api/auth/[...nextauth]                                  │
│  ├── /api/profile/*                                           │
│  └── /api/migrate/todos                                       │
├─────────────────────────────────────────────────────────────────┤
│                     Backend Services                            │
│  ├── PostgreSQL (Users, Sessions, Todos)                      │
│  ├── Redis (Rate limiting, Sessions)                          │
│  └── SendGrid (Email delivery)                                │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Feature-First Implementation

```
src/features/user-auth/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   ├── PasswordResetForm.tsx
│   │   └── EmailVerificationPrompt.tsx
│   ├── oauth/
│   │   ├── OAuthButtons.tsx
│   │   ├── GoogleButton.tsx
│   │   └── GitHubButton.tsx
│   ├── profile/
│   │   ├── ProfileCard.tsx
│   │   ├── ProfileEditForm.tsx
│   │   └── AvatarUpload.tsx
│   ├── security/
│   │   ├── TwoFactorSetup.tsx
│   │   ├── TwoFactorVerify.tsx
│   │   ├── SessionList.tsx
│   │   └── SecuritySettings.tsx
│   └── migration/
│       ├── MigrationPrompt.tsx
│       ├── MigrationProgress.tsx
│       └── MigrationSummary.tsx
├── stores/
│   ├── authStore.ts         # Authentication state
│   ├── sessionStore.ts      # Session management
│   ├── profileStore.ts      # User profile
│   └── migrationStore.ts    # Todo migration
├── hooks/
│   ├── useAuth.ts          # Auth operations
│   ├── useSession.ts       # Session hooks
│   ├── useProfile.ts       # Profile management
│   ├── useMigration.ts     # Migration logic
│   └── use2FA.ts           # 2FA operations
├── effects/
│   ├── authEffect.ts       # Auth side effects
│   ├── sessionEffect.ts    # Session monitoring
│   └── migrationEffect.ts  # Migration automation
├── types/
│   ├── auth.types.ts       # Auth interfaces
│   ├── session.types.ts    # Session types
│   ├── profile.types.ts    # Profile types
│   └── migration.types.ts  # Migration types
├── utils/
│   ├── auth/
│   │   ├── validation.ts   # Input validation
│   │   ├── password.ts     # Password utilities
│   │   └── tokens.ts       # Token handling
│   ├── security/
│   │   ├── csrf.ts         # CSRF utilities
│   │   ├── sanitize.ts     # Input sanitization
│   │   └── crypto.ts       # Encryption helpers
│   └── migration/
│       ├── detector.ts     # localStorage detection
│       └── transformer.ts  # Data transformation
└── __tests__/
    ├── components/
    ├── stores/
    ├── hooks/
    └── utils/
```

### 2.3 Zustand Store Architecture

```typescript
// authStore.ts
interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
  
  // Actions
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signUp: (userData: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  
  // OAuth
  signInWithProvider: (provider: OAuthProvider) => Promise<void>;
  linkProvider: (provider: OAuthProvider) => Promise<void>;
  
  // Internal
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: AuthError | null) => void;
}

// sessionStore.ts
interface SessionState {
  sessions: Session[];
  currentSession: Session | null;
  lastActivity: Date | null;
  
  fetchSessions: () => Promise<void>;
  revokeSession: (sessionId: string) => Promise<void>;
  revokeAllSessions: () => Promise<void>;
  updateActivity: () => void;
}

// profileStore.ts
interface ProfileState {
  profile: UserProfile | null;
  preferences: UserPreferences;
  isUpdating: boolean;
  
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
  exportData: () => Promise<UserDataExport>;
}

// migrationStore.ts
interface MigrationState {
  localTodos: Todo[];
  migrationStatus: MigrationStatus;
  progress: number;
  errors: MigrationError[];
  
  detectLocalTodos: () => void;
  startMigration: () => Promise<void>;
  skipMigration: () => void;
  rollbackMigration: () => Promise<void>;
}
```

## 3. Implementation Steps

### 3.1 Phase 1: Foundation Setup (Week 1-2)

#### Step 1.1: Database & Infrastructure Setup
```bash
# 1. Install core dependencies
npm install next-auth@beta @auth/prisma-adapter prisma @prisma/client
npm install bcryptjs jsonwebtoken speakeasy qrcode
npm install @sendgrid/mail ioredis
npm install --save-dev @types/bcryptjs @types/jsonwebtoken @types/speakeasy

# 2. Initialize Prisma
npx prisma init

# 3. Set up environment variables
cp .env.example .env.local
```

#### Step 1.2: Database Schema Creation
```prisma
// prisma/schema.prisma
model User {
  id                String    @id @default(cuid())
  email             String    @unique
  emailVerified     DateTime?
  password          String?
  name              String?
  image             String?
  twoFactorEnabled  Boolean   @default(false)
  twoFactorSecret   String?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  deletedAt         DateTime?
  
  accounts          Account[]
  sessions          Session[]
  todos             Todo[]
  verificationTokens VerificationToken[]
  passwordResetTokens PasswordResetToken[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  ipAddress    String?
  userAgent    String?
  
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Todo {
  id          String    @id @default(cuid())
  userId      String
  title       String
  completed   Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  dueDate     DateTime?
  
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

#### Step 1.3: NextAuth.js Configuration
```typescript
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import { authOptions } from "@/features/user-auth/utils/auth/nextauth"

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

// src/features/user-auth/utils/auth/nextauth.ts
import { NextAuthOptions } from "next-auth"
import EmailProvider from "next-auth/providers/email"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })
        
        if (!user || !user.password) {
          throw new Error("Invalid credentials")
        }
        
        const isValid = await bcrypt.compare(credentials.password, user.password)
        
        if (!isValid) {
          throw new Error("Invalid credentials")
        }
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image
        }
      }
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.emailVerified = user.emailVerified
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.emailVerified = token.emailVerified as boolean
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify',
    newUser: '/auth/welcome'
  }
}
```

### 3.2 Phase 2: Core Authentication (Week 3-4)

#### Step 2.1: Create Auth Pages
```typescript
// src/app/auth/signin/page.tsx
import { LoginForm } from '@/features/user-auth/components/auth/LoginForm'
import { OAuthButtons } from '@/features/user-auth/components/oauth/OAuthButtons'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-3xl font-bold text-center">Welcome back</h2>
        <LoginForm />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white">Or continue with</span>
          </div>
        </div>
        <OAuthButtons />
      </div>
    </div>
  )
}
```

#### Step 2.2: Implement Auth Components
```typescript
// src/features/user-auth/components/auth/LoginForm.tsx
import { useState } from 'react'
import { useAuthStore } from '../../stores/authStore'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn, isLoading, error } = useAuthStore()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await signIn({ email, password })
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="w-full px-4 py-2 border rounded-lg"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        className="w-full px-4 py-2 border rounded-lg"
      />
      {error && (
        <div className="text-red-500 text-sm">{error.message}</div>
      )}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}
```

#### Step 2.3: Create Auth Store
```typescript
// src/features/user-auth/stores/authStore.ts
import { create } from 'zustand'
import { signIn, signOut } from 'next-auth/react'
import { AuthState } from '../types/auth.types'

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  signIn: async (credentials) => {
    set({ isLoading: true, error: null })
    try {
      const result = await signIn('credentials', {
        redirect: false,
        ...credentials
      })
      
      if (result?.error) {
        throw new Error(result.error)
      }
      
      // User will be set by session provider
    } catch (error) {
      set({ error: error as AuthError })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },
  
  signUp: async (userData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }
      
      // Auto sign in after signup
      await get().signIn({
        email: userData.email,
        password: userData.password
      })
    } catch (error) {
      set({ error: error as AuthError })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },
  
  signOut: async () => {
    set({ isLoading: true })
    try {
      await signOut({ redirect: false })
      set({ user: null, isAuthenticated: false })
    } finally {
      set({ isLoading: false })
    }
  },
  
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error })
}))
```

### 3.3 Phase 3: Todo Migration (Week 5-6)

#### Step 3.1: Migration Detection
```typescript
// src/features/user-auth/hooks/useMigration.ts
import { useEffect } from 'react'
import { useMigrationStore } from '../stores/migrationStore'
import { useAuthStore } from '../stores/authStore'

export function useMigration() {
  const { user } = useAuthStore()
  const { 
    localTodos, 
    detectLocalTodos, 
    startMigration,
    skipMigration,
    migrationStatus 
  } = useMigrationStore()
  
  useEffect(() => {
    if (user && migrationStatus === 'idle') {
      detectLocalTodos()
    }
  }, [user, migrationStatus, detectLocalTodos])
  
  return {
    hasTodosToMigrate: localTodos.length > 0,
    todoCount: localTodos.length,
    startMigration,
    skipMigration,
    migrationStatus
  }
}
```

#### Step 3.2: Migration Component
```typescript
// src/features/user-auth/components/migration/MigrationPrompt.tsx
import { useMigration } from '../../hooks/useMigration'

export function MigrationPrompt() {
  const { hasTodosToMigrate, todoCount, startMigration, skipMigration } = useMigration()
  
  if (!hasTodosToMigrate) return null
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md">
        <h3 className="text-xl font-bold mb-4">Migrate Your Todos</h3>
        <p className="mb-4">
          We found {todoCount} todos in your browser. Would you like to add them to your account?
        </p>
        <div className="flex gap-4">
          <button
            onClick={startMigration}
            className="flex-1 py-2 bg-blue-500 text-white rounded"
          >
            Yes, Migrate
          </button>
          <button
            onClick={skipMigration}
            className="flex-1 py-2 border rounded"
          >
            Skip for Now
          </button>
        </div>
      </div>
    </div>
  )
}
```

#### Step 3.3: Migration API
```typescript
// src/app/api/migrate/todos/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/features/user-auth/utils/auth/nextauth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const { todos } = await request.json()
    
    // Validate todos
    if (!Array.isArray(todos)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }
    
    // Create todos in database
    const createdTodos = await prisma.todo.createMany({
      data: todos.map(todo => ({
        ...todo,
        userId: session.user.id
      }))
    })
    
    return NextResponse.json({ 
      success: true, 
      count: createdTodos.count 
    })
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json(
      { error: 'Migration failed' }, 
      { status: 500 }
    )
  }
}
```

### 3.4 Phase 4: Advanced Security (Week 7-8)

#### Step 4.1: Two-Factor Authentication
```typescript
// src/features/user-auth/components/security/TwoFactorSetup.tsx
import { useState } from 'react'
import QRCode from 'qrcode'
import { use2FA } from '../../hooks/use2FA'

export function TwoFactorSetup() {
  const [qrCode, setQrCode] = useState<string>('')
  const [verificationCode, setVerificationCode] = useState('')
  const { setupTwoFactor, verifyTwoFactor, isLoading } = use2FA()
  
  const handleSetup = async () => {
    const { secret, otpauth } = await setupTwoFactor()
    const qr = await QRCode.toDataURL(otpauth)
    setQrCode(qr)
  }
  
  const handleVerify = async () => {
    await verifyTwoFactor(verificationCode)
  }
  
  return (
    <div className="space-y-4">
      {!qrCode ? (
        <button
          onClick={handleSetup}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Enable Two-Factor Authentication
        </button>
      ) : (
        <>
          <div className="text-center">
            <img src={qrCode} alt="2FA QR Code" className="mx-auto" />
            <p className="mt-2 text-sm">
              Scan this QR code with your authenticator app
            </p>
          </div>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter verification code"
            className="w-full px-4 py-2 border rounded"
          />
          <button
            onClick={handleVerify}
            disabled={isLoading}
            className="w-full py-2 bg-green-500 text-white rounded"
          >
            Verify and Enable
          </button>
        </>
      )}
    </div>
  )
}
```

#### Step 4.2: Session Management
```typescript
// src/features/user-auth/components/security/SessionList.tsx
import { useSessionStore } from '../../stores/sessionStore'
import { useEffect } from 'react'

export function SessionList() {
  const { sessions, fetchSessions, revokeSession } = useSessionStore()
  
  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Active Sessions</h3>
      {sessions.map((session) => (
        <div key={session.id} className="border p-4 rounded">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{session.userAgent}</p>
              <p className="text-sm text-gray-500">{session.ipAddress}</p>
              <p className="text-sm text-gray-500">
                Last active: {new Date(session.lastActivity).toLocaleString()}
              </p>
            </div>
            {!session.isCurrent && (
              <button
                onClick={() => revokeSession(session.id)}
                className="text-red-500 text-sm"
              >
                Revoke
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
```

### 3.5 Phase 5: Testing & Deployment (Week 9-10)

#### Step 5.1: Unit Tests
```typescript
// src/features/user-auth/__tests__/stores/authStore.test.ts
import { renderHook, act } from '@testing-library/react'
import { useAuthStore } from '../../stores/authStore'

describe('AuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    })
  })
  
  it('should sign in user', async () => {
    const { result } = renderHook(() => useAuthStore())
    
    await act(async () => {
      await result.current.signIn({
        email: 'test@example.com',
        password: 'password123'
      })
    })
    
    expect(result.current.isAuthenticated).toBe(true)
  })
  
  it('should handle sign in error', async () => {
    const { result } = renderHook(() => useAuthStore())
    
    await act(async () => {
      try {
        await result.current.signIn({
          email: 'invalid@example.com',
          password: 'wrong'
        })
      } catch (error) {
        // Expected error
      }
    })
    
    expect(result.current.error).toBeDefined()
  })
})
```

#### Step 5.2: Integration Tests
```typescript
// src/features/user-auth/__tests__/integration/authFlow.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SignInPage } from '@/app/auth/signin/page'

describe('Authentication Flow', () => {
  it('should complete full sign in flow', async () => {
    render(<SignInPage />)
    
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'password123')
    await userEvent.click(submitButton)
    
    await waitFor(() => {
      expect(window.location.pathname).toBe('/dashboard')
    })
  })
})
```

## 4. Technical Requirements

### 4.1 Dependencies

#### Production Dependencies
```json
{
  "dependencies": {
    "next": "15.4.2",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "next-auth": "^5.0.0-beta",
    "@auth/prisma-adapter": "^1.0.0",
    "prisma": "^5.0.0",
    "@prisma/client": "^5.0.0",
    "zustand": "^4.5.0",
    "immer": "^10.0.3",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "speakeasy": "^2.0.0",
    "qrcode": "^1.5.0",
    "@sendgrid/mail": "^7.7.0",
    "ioredis": "^5.3.0",
    "zod": "^3.22.0"
  }
}
```

#### Development Dependencies
```json
{
  "devDependencies": {
    "@types/bcryptjs": "^2.4.2",
    "@types/jsonwebtoken": "^9.0.0",
    "@types/speakeasy": "^2.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "msw": "^2.0.0",
    "playwright": "^1.40.0"
  }
}
```

### 4.2 Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/simpletodo"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# OAuth Providers
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# Email
EMAIL_SERVER_HOST="smtp.sendgrid.net"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="apikey"
EMAIL_SERVER_PASSWORD=""
EMAIL_FROM="noreply@simpletodo.com"

# Redis
REDIS_URL="redis://localhost:6379"

# Security
ENCRYPTION_KEY=""
JWT_SECRET=""
```

### 4.3 Security Configuration

#### Rate Limiting
```typescript
// src/lib/rate-limit.ts
import { Redis } from 'ioredis'

const redis = new Redis(process.env.REDIS_URL!)

export async function rateLimit(
  identifier: string,
  limit: number = 5,
  window: number = 900 // 15 minutes
) {
  const key = `rate-limit:${identifier}`
  const current = await redis.incr(key)
  
  if (current === 1) {
    await redis.expire(key, window)
  }
  
  return {
    limit,
    remaining: Math.max(0, limit - current),
    reset: new Date(Date.now() + window * 1000)
  }
}
```

#### CSRF Protection
```typescript
// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  
  // Protect API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    if (!token && !request.nextUrl.pathname.startsWith('/api/auth/')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
  }
  
  // Protect authenticated pages
  if (request.nextUrl.pathname.startsWith('/profile')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*', '/profile/:path*']
}
```

## 5. Data/API Considerations

### 5.1 API Routes Structure

```
/api/
├── auth/
│   ├── [...nextauth]/         # NextAuth handlers
│   ├── signup/                # Custom signup
│   ├── verify-email/          # Email verification
│   ├── reset-password/        # Password reset
│   └── 2fa/                   # 2FA endpoints
├── profile/
│   ├── index                  # Get/update profile
│   ├── avatar/                # Avatar upload
│   ├── preferences/           # User preferences
│   └── export/                # Data export
├── sessions/
│   ├── index                  # List sessions
│   └── [id]/                  # Revoke session
└── migrate/
    └── todos/                 # Todo migration
```

### 5.2 Data Models

#### User Model Extensions
```typescript
interface User {
  id: string
  email: string
  emailVerified: boolean
  password?: string
  name?: string
  image?: string
  twoFactorEnabled: boolean
  twoFactorSecret?: string
  preferences: UserPreferences
  metadata: UserMetadata
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  emailNotifications: boolean
  timezone: string
  language: string
  todoSortOrder: 'newest' | 'oldest' | 'alphabetical'
}

interface UserMetadata {
  signupSource: 'email' | 'google' | 'github'
  migrationCompleted: boolean
  lastPasswordChange?: Date
  failedLoginAttempts: number
  accountLocked: boolean
}
```

### 5.3 API Response Standards

```typescript
// Success Response
interface ApiResponse<T> {
  success: true
  data: T
  meta?: {
    page?: number
    total?: number
    timestamp: string
  }
}

// Error Response
interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: any
  }
  meta: {
    timestamp: string
    requestId: string
  }
}
```

## 6. Testing Plan

### 6.1 Test Coverage Requirements

- **Unit Tests**: 90% coverage minimum
- **Integration Tests**: All critical user flows
- **E2E Tests**: Happy paths and edge cases
- **Security Tests**: OWASP compliance
- **Performance Tests**: Load and stress testing

### 6.2 Test Categories

#### Unit Tests
```
src/features/user-auth/__tests__/
├── components/           # Component tests
├── stores/              # Store logic tests
├── hooks/               # Custom hook tests
├── utils/               # Utility function tests
└── api/                 # API handler tests
```

#### Integration Tests
- Authentication flow (signup → verify → signin)
- OAuth flow (authorize → callback → profile)
- Password reset flow (request → email → reset)
- Todo migration flow (detect → migrate → verify)
- 2FA flow (setup → verify → login)

#### E2E Tests
```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('complete signup flow', async ({ page }) => {
    await page.goto('/auth/signup')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'SecurePass123!')
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL('/auth/verify')
    // Simulate email verification
    await page.goto('/auth/verify?token=valid-token')
    
    await expect(page).toHaveURL('/dashboard')
  })
})
```

### 6.3 Security Testing

#### OWASP Compliance
- [ ] SQL Injection prevention
- [ ] XSS protection
- [ ] CSRF tokens
- [ ] Authentication bypass
- [ ] Session fixation
- [ ] Insecure direct object references
- [ ] Security misconfiguration
- [ ] Sensitive data exposure
- [ ] Missing access control
- [ ] Using components with known vulnerabilities

#### Security Test Suite
```typescript
// tests/security/auth.test.ts
describe('Security Tests', () => {
  test('prevents SQL injection', async () => {
    const maliciousEmail = "admin'--"
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({
        email: maliciousEmail,
        password: 'any'
      })
    })
    
    expect(response.status).toBe(401)
  })
  
  test('implements rate limiting', async () => {
    // Make 6 requests (limit is 5)
    for (let i = 0; i < 6; i++) {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'wrong'
        })
      })
      
      if (i === 5) {
        expect(response.status).toBe(429)
      }
    }
  })
})
```

## 7. Timeline & Milestones

### 7.1 Development Timeline (10 Weeks)

#### Week 1-2: Foundation Setup
- [ ] Database setup and schema
- [ ] NextAuth.js configuration
- [ ] Basic registration/login UI
- [ ] Email service integration
- [ ] Rate limiting implementation

**Milestone**: Basic auth working with email/password

#### Week 3-4: OAuth & Password Management
- [ ] Google OAuth integration
- [ ] GitHub OAuth integration
- [ ] Password reset flow
- [ ] Email verification
- [ ] Account linking

**Milestone**: Complete authentication flows

#### Week 5-6: Todo Migration & Profile
- [ ] Migration detection logic
- [ ] Migration UI/UX
- [ ] Profile management
- [ ] User preferences
- [ ] Avatar upload

**Milestone**: Users can migrate and manage profiles

#### Week 7-8: Advanced Security
- [ ] 2FA implementation
- [ ] Session management
- [ ] Security alerts
- [ ] Audit logging
- [ ] CSRF protection

**Milestone**: Advanced security features complete

#### Week 9-10: Testing & Deployment
- [ ] Comprehensive testing
- [ ] Security audit
- [ ] Performance optimization
- [ ] Documentation
- [ ] Production deployment

**Milestone**: Production-ready release

### 7.2 Critical Milestones

1. **Week 2**: Basic authentication operational
2. **Week 4**: OAuth providers integrated
3. **Week 6**: Todo migration complete
4. **Week 8**: Security features implemented
5. **Week 10**: Production deployment

### 7.3 Success Metrics

#### Technical Metrics
- Authentication response time < 500ms
- 99.9% uptime for auth services
- Zero critical security vulnerabilities
- 90%+ test coverage
- < 0.1% authentication failures

#### User Metrics
- 80% registration completion rate
- 95% login success rate
- 30% OAuth adoption
- 70% todo migration success
- < 1% support tickets

## 8. Risk Assessment

### 8.1 Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| NextAuth.js learning curve | High | Medium | Early prototyping, team training |
| Database performance | High | Low | Indexing, connection pooling |
| Email delivery issues | Medium | Medium | Multiple providers, retry logic |
| OAuth misconfiguration | Medium | Medium | Thorough testing, staging env |
| Migration data loss | High | Low | Transactions, backups, validation |
| Security vulnerabilities | Critical | Medium | Continuous scanning, audits |
| Session management complexity | Medium | Medium | Clear architecture, monitoring |
| 2FA implementation issues | Low | Medium | Well-tested libraries, fallbacks |

### 8.2 Business Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Low user adoption | High | Medium | Simple onboarding, clear value |
| Complex UX | Medium | High | User testing, iterative design |
| GDPR compliance | High | Low | Legal review, privacy by design |
| Support burden | Medium | Medium | Good docs, self-service options |
| Scope creep | Medium | High | Strict prioritization, MVP focus |

### 8.3 Mitigation Strategies

#### Technical Mitigations
1. **Early Prototyping**: Build proof-of-concepts for complex features
2. **Incremental Rollout**: Feature flags for gradual deployment
3. **Monitoring**: Comprehensive logging and alerting
4. **Backup Systems**: Fallback authentication methods
5. **Security First**: Security review at each phase

#### Process Mitigations
1. **Daily Standups**: Quick issue identification
2. **Weekly Security Reviews**: Continuous security focus
3. **Sprint Demos**: Regular stakeholder feedback
4. **Code Reviews**: Mandatory peer reviews
5. **Documentation**: Keep docs updated throughout

## 9. Integration Points

### 9.1 Existing System Integration

#### Core-Todo Feature
```typescript
// Integration with existing todo store
import { useTodoStore } from '@/features/core-todo/stores/todoStore'
import { useAuthStore } from '@/features/user-auth/stores/authStore'

// Modify todo store to include userId
const todoStore = (set, get) => ({
  createTodo: async (todo) => {
    const { user } = useAuthStore.getState()
    
    if (user) {
      // Create in database with userId
      const response = await fetch('/api/todos', {
        method: 'POST',
        body: JSON.stringify({ ...todo, userId: user.id })
      })
      // ...
    } else {
      // Fallback to localStorage
      // ...
    }
  }
})
```

#### localStorage Migration
```typescript
// Detect and migrate existing todos
const detectLocalTodos = () => {
  const stored = localStorage.getItem('todos')
  if (stored) {
    try {
      const todos = JSON.parse(stored)
      return Array.isArray(todos) ? todos : []
    } catch {
      return []
    }
  }
  return []
}
```

### 9.2 External Service Integration

#### SendGrid Email Integration
```typescript
// src/lib/email.ts
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export async function sendVerificationEmail(to: string, token: string) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`
  
  await sgMail.send({
    to,
    from: process.env.EMAIL_FROM!,
    subject: 'Verify your email',
    html: `
      <h1>Welcome to Simple Todo!</h1>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verifyUrl}">Verify Email</a>
    `
  })
}
```

#### Redis Session Management
```typescript
// src/lib/session-store.ts
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL!)

export const sessionStore = {
  async get(sessionId: string) {
    const data = await redis.get(`session:${sessionId}`)
    return data ? JSON.parse(data) : null
  },
  
  async set(sessionId: string, data: any, ttl: number) {
    await redis.set(
      `session:${sessionId}`,
      JSON.stringify(data),
      'EX',
      ttl
    )
  },
  
  async destroy(sessionId: string) {
    await redis.del(`session:${sessionId}`)
  }
}
```

### 9.3 Future Integration Points

#### Notification System
```typescript
// Integration point for future notifications feature
interface AuthNotificationEvents {
  'user.registered': { userId: string; email: string }
  'user.login': { userId: string; ip: string; device: string }
  'password.reset': { userId: string; email: string }
  'security.alert': { userId: string; type: string; details: any }
}

// Event emitter for notifications
export const authEvents = new EventEmitter<AuthNotificationEvents>()
```

#### Analytics Integration
```typescript
// Track authentication events
export const trackAuthEvent = (event: string, properties: any) => {
  // Future integration with analytics service
  if (window.analytics) {
    window.analytics.track(event, properties)
  }
}
```

---

## Conclusion

This implementation plan provides a comprehensive roadmap for building a secure, scalable authentication system for Simple Todo. The plan emphasizes:

1. **Security First**: Every decision prioritizes user security
2. **User Experience**: Smooth flows with clear feedback
3. **Maintainability**: Clean architecture with clear separation
4. **Scalability**: Built to handle growth from day one
5. **Testing**: Comprehensive coverage for confidence

The feature-first architecture with Zustand state management ensures the codebase remains organized and maintainable as the application grows. The phased approach allows for iterative development with clear milestones and risk mitigation strategies.

Success depends on careful execution, continuous testing, and maintaining focus on the core user needs while building a robust foundation for future features.