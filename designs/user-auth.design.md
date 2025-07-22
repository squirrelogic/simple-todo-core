# User Authentication - Architecture Design Document

**Project**: Simple Todo  
**Feature**: User Authentication System  
**Version**: 1.0.0  
**Date**: 2025-07-22  
**Status**: Draft  

## Executive Summary

This document details the technical architecture for the User Authentication feature of the Simple Todo application. The authentication system will transform the application from a local-only tool to a cloud-enabled platform with secure user accounts, multi-device synchronization, and seamless migration of existing localStorage todos. The architecture leverages NextAuth.js v5 for authentication, PostgreSQL for data persistence, Redis for session caching, and follows the established feature-first architecture pattern with Zustand state management.

### Key Design Goals
- **Security First**: Implement industry-standard security practices including password hashing, JWT tokens, and two-factor authentication
- **Seamless Migration**: Automatically detect and migrate existing localStorage todos to user accounts
- **Multiple Auth Methods**: Support email/password and OAuth providers (Google, GitHub)
- **Enterprise Ready**: GDPR compliance, audit logging, and comprehensive security controls
- **Performance**: Sub-second authentication with horizontal scaling capability
- **User Experience**: Simple, intuitive authentication flows with clear feedback

### Architecture Highlights
- NextAuth.js v5 for authentication framework
- PostgreSQL for user data and session persistence
- Redis for rate limiting and session caching
- Argon2 for password hashing
- JWT tokens with refresh token rotation
- Comprehensive audit logging and security monitoring

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              Client Layer                                │
│  ┌───────────────────┐  ┌──────────────────┐  ┌───────────────────┐   │
│  │   React Components │  │  Zustand Stores  │  │  Effects Layer    │   │
│  │  - Auth Forms      │  │  - authStore     │  │  - authEffect     │   │
│  │  - Profile UI      │  │  - sessionStore  │  │  - sessionMonitor │   │
│  │  - Protected Routes│  │  - profileStore  │  │  - tokenRefresh   │   │
│  └───────────────────┘  └──────────────────┘  └───────────────────┘   │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
┌────────────────────────────────────▼────────────────────────────────────┐
│                           API Gateway Layer                              │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     Next.js API Routes                           │   │
│  │  /api/auth/[...nextauth]  /api/profile/*  /api/migrate/*       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
┌────────────────────────────────────▼────────────────────────────────────┐
│                        Authentication Layer                              │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                        NextAuth.js v5                            │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐     │   │
│  │  │   Providers │  │   Adapters   │  │     Callbacks     │     │   │
│  │  │  - Email    │  │  - Prisma    │  │  - JWT           │     │   │
│  │  │  - Google   │  │  - Database  │  │  - Session       │     │   │
│  │  │  - GitHub   │  │              │  │  - SignIn        │     │   │
│  │  └─────────────┘  └──────────────┘  └───────────────────┘     │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
┌────────────────────────────────────▼────────────────────────────────────┐
│                         Data Persistence Layer                           │
│  ┌──────────────────────┐                    ┌────────────────────┐    │
│  │     PostgreSQL       │                    │       Redis        │    │
│  │  ┌───────────────┐   │                    │  ┌──────────────┐  │    │
│  │  │    Users      │   │                    │  │ Rate Limits  │  │    │
│  │  │   Sessions    │   │                    │  │Session Cache │  │    │
│  │  │   Accounts    │   │                    │  │ 2FA Tokens   │  │    │
│  │  │    Todos      │   │                    │  │   Queues     │  │    │
│  │  │  Audit Logs   │   │                    │  └──────────────┘  │    │
│  │  └───────────────┘   │                    └────────────────────┘    │
│  └──────────────────────┘                                               │
└─────────────────────────────────────────────────────────────────────────┘
                                     │
┌────────────────────────────────────▼────────────────────────────────────┐
│                         External Services                                │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │  SendGrid   │  │ Google OAuth │  │ GitHub OAuth │  │   Sentry   │  │
│  │   (Email)   │  │              │  │              │  │ (Monitoring)│  │
│  └─────────────┘  └──────────────┘  └──────────────┘  └────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Data Flow Architecture

```
User Registration Flow:
─────────────────────

User Input → Validation → Rate Check → Password Hash → Create User
    │             │            │              │              │
    ▼             ▼            ▼              ▼              ▼
Form Data    Schema Val   Redis Check    Argon2 Hash    PostgreSQL
    │             │            │              │              │
    └─────────────┴────────────┴──────────────┴──────────────┘
                              │
                              ▼
                    Send Verification Email
                              │
                              ▼
                    Return Success Response


Authentication Flow:
───────────────────

Login Request → Rate Limit → Verify Credentials → Create Session
      │             │               │                   │
      ▼             ▼               ▼                   ▼
  Email/Pass    Redis Check    DB Lookup + Hash    JWT + Cookie
      │             │               │                   │
      └─────────────┴───────────────┴───────────────────┘
                              │
                              ▼
                    Check 2FA (if enabled)
                              │
                              ▼
                    Return Auth Response


Todo Migration Flow:
───────────────────

Detect Local → Show Prompt → User Consent → Batch Migration
      │             │              │               │
      ▼             ▼              ▼               ▼
 localStorage    UI Modal    Authorization    API + Queue
      │             │              │               │
      └─────────────┴──────────────┴───────────────┘
                              │
                              ▼
                    Progress Updates
                              │
                              ▼
                    Clear localStorage
```

## Component Design

### Core Components

#### Authentication Components
```typescript
// LoginForm Component
interface LoginFormProps {
  redirectTo?: string;
  onSuccess?: () => void;
}

// Features:
// - Email/password inputs with validation
// - Remember me checkbox
// - Forgot password link
// - OAuth provider buttons
// - Loading states and error handling
// - CSRF protection
// - Rate limit feedback

// SignupForm Component
interface SignupFormProps {
  inviteCode?: string;
  onSuccess?: () => void;
}

// Features:
// - Email, password, confirm password
// - Password strength indicator
// - Terms acceptance checkbox
// - OAuth signup options
// - Real-time validation
// - Duplicate email detection
```

#### Profile Management Components
```typescript
// ProfileForm Component
interface ProfileFormProps {
  user: User;
  onUpdate: (data: Partial<UserProfile>) => Promise<void>;
}

// Features:
// - Editable user details
// - Avatar upload with crop
// - Email change with re-verification
// - Timezone and language selection
// - Preference management
// - Unsaved changes detection

// SecuritySettings Component
interface SecuritySettingsProps {
  user: User;
  sessions: Session[];
}

// Features:
// - Password change form
// - Two-factor authentication setup
// - Active session management
// - Security event history
// - Account deletion
// - Data export
```

#### Migration Components
```typescript
// MigrationPrompt Component
interface MigrationPromptProps {
  localTodos: Todo[];
  onMigrate: () => Promise<void>;
  onSkip: () => void;
}

// Features:
// - Todo count display
// - Preview of todos to migrate
// - Clear explanation of benefits
// - One-click migration
// - Skip option with persistence
// - Progress tracking

// MigrationProgress Component
interface MigrationProgressProps {
  total: number;
  completed: number;
  errors: MigrationError[];
}

// Features:
// - Real-time progress bar
// - Success/error counts
// - Error details expansion
// - Retry failed items
// - Cancel migration
// - Completion celebration
```

### State Management

#### Auth Store
```typescript
interface AuthStore {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
  redirectUrl: string | null;
  
  // Core Actions
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: (options?: SignOutOptions) => Promise<void>;
  
  // OAuth Actions
  signInWithProvider: (provider: OAuthProvider) => Promise<void>;
  linkProvider: (provider: OAuthProvider) => Promise<void>;
  unlinkProvider: (provider: OAuthProvider) => Promise<void>;
  
  // Password Management
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  
  // Email Verification
  sendVerificationEmail: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  
  // Two-Factor Authentication
  enable2FA: () => Promise<{ qrCode: string; secret: string; backupCodes: string[] }>;
  verify2FA: (code: string) => Promise<void>;
  disable2FA: (code: string) => Promise<void>;
  
  // State Setters
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: AuthError | null) => void;
  setRedirectUrl: (url: string | null) => void;
  clearError: () => void;
}

// Implementation with Zustand
export const useAuthStore = create<AuthStore>()(
  subscribeWithSelector(
    devtools(
      immer((set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        redirectUrl: null,
        
        // Sign in implementation
        signIn: async (credentials) => {
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });
          
          try {
            // Validate input
            const validated = await validateSignInCredentials(credentials);
            
            // Check rate limit
            await checkRateLimit('signin', credentials.email);
            
            // Attempt authentication
            const result = await signIn('credentials', {
              ...validated,
              redirect: false,
            });
            
            if (result?.error) {
              // Handle specific error types
              if (result.error === 'CredentialsSignin') {
                throw new AuthError('Invalid email or password', 'INVALID_CREDENTIALS');
              }
              throw new AuthError(result.error);
            }
            
            // Handle redirect
            const redirectUrl = get().redirectUrl || '/dashboard';
            router.push(redirectUrl);
            
            set((state) => {
              state.redirectUrl = null;
            });
          } catch (error) {
            set((state) => {
              state.error = error as AuthError;
              state.isLoading = false;
            });
            throw error;
          }
        },
        
        // ... other implementations
      }))
    ),
    {
      name: 'auth-store',
    }
  )
);
```

#### Session Store
```typescript
interface SessionStore {
  // State
  sessions: Session[];
  currentSession: Session | null;
  lastActivity: Date;
  isRefreshing: boolean;
  refreshTimer: NodeJS.Timeout | null;
  
  // Actions
  loadSessions: () => Promise<void>;
  refreshCurrentSession: () => Promise<void>;
  revokeSession: (sessionId: string) => Promise<void>;
  revokeAllOtherSessions: () => Promise<void>;
  updateActivity: () => void;
  
  // Token Management
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  scheduleTokenRefresh: () => void;
  cancelTokenRefresh: () => void;
  
  // Session Monitoring
  startSessionMonitoring: () => void;
  stopSessionMonitoring: () => void;
  checkSessionValidity: () => Promise<boolean>;
}

// Implementation
export const useSessionStore = create<SessionStore>()(
  persist(
    subscribeWithSelector((set, get) => ({
      sessions: [],
      currentSession: null,
      lastActivity: new Date(),
      isRefreshing: false,
      refreshTimer: null,
      
      refreshCurrentSession: async () => {
        const refreshToken = get().getRefreshToken();
        if (!refreshToken) return;
        
        set({ isRefreshing: true });
        
        try {
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });
          
          if (!response.ok) {
            throw new Error('Token refresh failed');
          }
          
          const { accessToken, refreshToken: newRefreshToken, session } = await response.json();
          
          // Update tokens
          secureStorage.setItem('accessToken', accessToken);
          secureStorage.setItem('refreshToken', newRefreshToken);
          
          set({
            currentSession: session,
            isRefreshing: false,
          });
          
          // Schedule next refresh
          get().scheduleTokenRefresh();
        } catch (error) {
          // Token refresh failed, sign out user
          await useAuthStore.getState().signOut();
        }
      },
      
      scheduleTokenRefresh: () => {
        const { cancelTokenRefresh } = get();
        cancelTokenRefresh();
        
        // Refresh 5 minutes before expiry
        const timer = setTimeout(() => {
          get().refreshCurrentSession();
        }, 10 * 60 * 1000); // 10 minutes
        
        set({ refreshTimer: timer });
      },
      
      // ... other implementations
    })),
    {
      name: 'session-store',
      partialize: (state) => ({
        lastActivity: state.lastActivity,
      }),
    }
  )
);
```

#### Profile Store
```typescript
interface ProfileStore {
  // State
  profile: UserProfile | null;
  preferences: UserPreferences;
  isLoading: boolean;
  isUpdating: boolean;
  hasUnsavedChanges: boolean;
  errors: ValidationError[];
  
  // Profile Actions
  loadProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateAvatar: (file: File) => Promise<void>;
  deleteAvatar: () => Promise<void>;
  
  // Preference Actions
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  resetPreferences: () => Promise<void>;
  
  // Account Actions
  changeEmail: (newEmail: string, password: string) => Promise<void>;
  deleteAccount: (password: string, feedback?: string) => Promise<void>;
  exportAccountData: () => Promise<AccountDataExport>;
  
  // Privacy Actions
  updatePrivacySettings: (settings: PrivacySettings) => Promise<void>;
  revokeDataAccess: (serviceId: string) => Promise<void>;
  
  // Validation
  validateProfile: (data: Partial<UserProfile>) => ValidationError[];
  setHasUnsavedChanges: (hasChanges: boolean) => void;
}
```

#### Migration Store
```typescript
interface MigrationStore {
  // State
  localTodos: Todo[];
  migrationStatus: MigrationStatus;
  progress: MigrationProgress;
  errors: MigrationError[];
  
  // Detection
  detectLocalTodos: () => Promise<void>;
  hasLocalTodos: () => boolean;
  
  // Migration Actions
  startMigration: (options?: MigrationOptions) => Promise<void>;
  pauseMigration: () => void;
  resumeMigration: () => void;
  cancelMigration: () => void;
  retryFailedItems: () => Promise<void>;
  
  // Progress Tracking
  updateProgress: (progress: Partial<MigrationProgress>) => void;
  addError: (error: MigrationError) => void;
  
  // Cleanup
  clearLocalStorage: () => void;
  dismissMigrationPrompt: () => void;
}

interface MigrationProgress {
  total: number;
  completed: number;
  failed: number;
  skipped: number;
  currentBatch: number;
  totalBatches: number;
  estimatedTimeRemaining: number;
}
```

### Service Architecture

#### Authentication Service
```typescript
class AuthenticationService {
  private nextAuth: NextAuthInstance;
  private prisma: PrismaClient;
  private redis: RedisClient;
  private emailService: EmailService;
  private auditLogger: AuditLogger;
  
  constructor(config: AuthConfig) {
    this.nextAuth = NextAuth(config);
    this.prisma = new PrismaClient();
    this.redis = new Redis(config.redis);
    this.emailService = new EmailService(config.email);
    this.auditLogger = new AuditLogger();
  }
  
  async signUp(data: SignUpData): Promise<User> {
    // Validate input
    const validated = await this.validateSignUpData(data);
    
    // Check rate limit
    await this.checkRateLimit('signup', data.email);
    
    // Check for existing user
    const existing = await this.prisma.user.findUnique({
      where: { email: validated.email.toLowerCase() },
    });
    
    if (existing) {
      throw new AuthError('Email already registered', 'EMAIL_EXISTS');
    }
    
    // Hash password
    const passwordHash = await argon2.hash(validated.password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });
    
    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: validated.email.toLowerCase(),
        passwordHash,
        name: validated.name,
        preferences: {
          create: this.getDefaultPreferences(),
        },
      },
    });
    
    // Send verification email
    await this.sendVerificationEmail(user);
    
    // Log event
    await this.auditLogger.log({
      event: 'USER_SIGNUP',
      userId: user.id,
      metadata: { email: user.email },
    });
    
    return user;
  }
  
  async verifyCredentials(email: string, password: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { preferences: true },
    });
    
    if (!user || !user.passwordHash) {
      // Prevent timing attacks
      await argon2.hash('dummy-password');
      throw new AuthError('Invalid credentials', 'INVALID_CREDENTIALS');
    }
    
    // Check account status
    if (user.deletedAt) {
      throw new AuthError('Account deleted', 'ACCOUNT_DELETED');
    }
    
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new AuthError('Account locked', 'ACCOUNT_LOCKED');
    }
    
    // Verify password
    const valid = await argon2.verify(user.passwordHash, password);
    
    if (!valid) {
      await this.handleFailedLogin(user);
      throw new AuthError('Invalid credentials', 'INVALID_CREDENTIALS');
    }
    
    // Reset failed attempts
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lastLoginAt: new Date(),
      },
    });
    
    return user;
  }
  
  async createSession(user: User, request: Request): Promise<Session> {
    // Generate tokens
    const sessionToken = generateSecureToken();
    const refreshToken = generateSecureToken();
    
    // Extract device info
    const deviceInfo = this.extractDeviceInfo(request);
    
    // Create session
    const session = await this.prisma.session.create({
      data: {
        userId: user.id,
        sessionToken,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'],
        deviceFingerprint: deviceInfo.fingerprint,
      },
    });
    
    // Cache session
    await this.redis.setex(
      `session:${sessionToken}`,
      7 * 24 * 60 * 60,
      JSON.stringify(session)
    );
    
    // Log event
    await this.auditLogger.log({
      event: 'SESSION_CREATED',
      userId: user.id,
      sessionId: session.id,
      metadata: deviceInfo,
    });
    
    return session;
  }
  
  private async handleFailedLogin(user: User): Promise<void> {
    const attempts = user.failedLoginAttempts + 1;
    const lockThreshold = 5;
    
    const updateData: any = {
      failedLoginAttempts: attempts,
    };
    
    if (attempts >= lockThreshold) {
      updateData.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
      
      // Send security alert
      await this.emailService.sendSecurityAlert(user, {
        type: 'ACCOUNT_LOCKED',
        reason: 'Multiple failed login attempts',
      });
    }
    
    await this.prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });
  }
}
```

#### Session Management Service
```typescript
class SessionManagementService {
  private prisma: PrismaClient;
  private redis: RedisClient;
  private jwtService: JWTService;
  
  async validateSession(token: string): Promise<ValidatedSession> {
    // Check cache first
    const cached = await this.redis.get(`session:${token}`);
    if (cached) {
      return JSON.parse(cached);
    }
    
    // Load from database
    const session = await this.prisma.session.findUnique({
      where: { sessionToken: token },
      include: { user: true },
    });
    
    if (!session) {
      throw new AuthError('Invalid session', 'INVALID_SESSION');
    }
    
    // Check expiry
    if (session.expiresAt < new Date()) {
      await this.revokeSession(session.id);
      throw new AuthError('Session expired', 'SESSION_EXPIRED');
    }
    
    // Update last activity
    await this.updateActivity(session.id);
    
    // Cache session
    await this.redis.setex(
      `session:${token}`,
      300, // 5 minutes
      JSON.stringify(session)
    );
    
    return session;
  }
  
  async refreshSession(refreshToken: string): Promise<RefreshResult> {
    const session = await this.prisma.session.findFirst({
      where: { refreshToken },
      include: { user: true },
    });
    
    if (!session || session.expiresAt < new Date()) {
      throw new AuthError('Invalid refresh token', 'INVALID_REFRESH_TOKEN');
    }
    
    // Rotate refresh token
    const newRefreshToken = generateSecureToken();
    const newSessionToken = generateSecureToken();
    
    await this.prisma.session.update({
      where: { id: session.id },
      data: {
        sessionToken: newSessionToken,
        refreshToken: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    
    // Generate new JWT
    const accessToken = await this.jwtService.sign({
      userId: session.user.id,
      sessionId: session.id,
      email: session.user.email,
    });
    
    return {
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn: 900, // 15 minutes
    };
  }
  
  async getActiveSessions(userId: string): Promise<SessionInfo[]> {
    const sessions = await this.prisma.session.findMany({
      where: {
        userId,
        expiresAt: { gt: new Date() },
      },
      orderBy: { lastActivity: 'desc' },
    });
    
    return sessions.map(session => ({
      id: session.id,
      device: this.parseUserAgent(session.userAgent),
      location: this.getLocationFromIP(session.ipAddress),
      lastActivity: session.lastActivity,
      isCurrent: session.sessionToken === this.getCurrentToken(),
    }));
  }
  
  async revokeSession(sessionId: string): Promise<void> {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });
    
    if (session) {
      // Delete from database
      await this.prisma.session.delete({
        where: { id: sessionId },
      });
      
      // Remove from cache
      await this.redis.del(`session:${session.sessionToken}`);
      
      // Log event
      await this.auditLogger.log({
        event: 'SESSION_REVOKED',
        userId: session.userId,
        sessionId: session.id,
      });
    }
  }
}
```

#### Migration Service
```typescript
class TodoMigrationService {
  private prisma: PrismaClient;
  private queue: Queue;
  private logger: Logger;
  
  constructor() {
    this.queue = new Queue('todo-migration', {
      redis: redisConfig,
    });
    
    this.setupWorkers();
  }
  
  async detectLocalTodos(userId: string): Promise<MigrationDetection> {
    // This is called from the client with localStorage data
    return {
      detected: true,
      count: 0, // Client will provide actual count
      estimatedTime: 0,
    };
  }
  
  async startMigration(userId: string, todos: Todo[]): Promise<MigrationJob> {
    // Validate todos
    const validated = todos.map(todo => this.validateTodo(todo));
    
    // Create migration record
    const migration = await this.prisma.todoMigration.create({
      data: {
        userId,
        status: 'IN_PROGRESS',
        totalTodos: validated.length,
        migratedTodos: 0,
        failedTodos: 0,
      },
    });
    
    // Queue migration job
    const job = await this.queue.add('migrate-todos', {
      migrationId: migration.id,
      userId,
      todos: validated,
    }, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });
    
    return {
      migrationId: migration.id,
      jobId: job.id,
      status: 'QUEUED',
    };
  }
  
  private setupWorkers() {
    this.queue.process('migrate-todos', async (job) => {
      const { migrationId, userId, todos } = job.data;
      const batchSize = 50;
      
      for (let i = 0; i < todos.length; i += batchSize) {
        const batch = todos.slice(i, i + batchSize);
        
        try {
          // Bulk create todos
          await this.prisma.todo.createMany({
            data: batch.map(todo => ({
              ...todo,
              userId,
              migratedAt: new Date(),
            })),
          });
          
          // Update progress
          await this.prisma.todoMigration.update({
            where: { id: migrationId },
            data: {
              migratedTodos: { increment: batch.length },
            },
          });
          
          // Emit progress event
          await job.updateProgress({
            completed: i + batch.length,
            total: todos.length,
          });
        } catch (error) {
          // Log errors but continue
          await this.handleMigrationError(migrationId, batch, error);
        }
      }
      
      // Complete migration
      await this.prisma.todoMigration.update({
        where: { id: migrationId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
        },
      });
    });
  }
  
  private async handleMigrationError(
    migrationId: string,
    todos: Todo[],
    error: Error
  ): Promise<void> {
    await this.prisma.todoMigration.update({
      where: { id: migrationId },
      data: {
        failedTodos: { increment: todos.length },
        errors: {
          push: {
            timestamp: new Date(),
            error: error.message,
            todoIds: todos.map(t => t.id),
          },
        },
      },
    });
  }
}
```

### Security Architecture

#### Password Security
```typescript
class PasswordSecurityService {
  private readonly minLength = 8;
  private readonly maxLength = 128;
  private readonly requireUppercase = true;
  private readonly requireLowercase = true;
  private readonly requireNumbers = true;
  private readonly requireSpecialChars = true;
  
  async hashPassword(password: string): Promise<string> {
    // Validate password strength
    const strength = this.calculateStrength(password);
    if (strength.score < 3) {
      throw new ValidationError('Password too weak', strength.feedback);
    }
    
    // Hash with Argon2id
    return await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536, // 64 MB
      timeCost: 3,
      parallelism: 4,
      hashLength: 32,
      saltLength: 16,
    });
  }
  
  async verifyPassword(hash: string, password: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, password);
    } catch (error) {
      // Invalid hash format
      return false;
    }
  }
  
  calculateStrength(password: string): PasswordStrength {
    const result = zxcvbn(password);
    
    return {
      score: result.score, // 0-4
      feedback: result.feedback.suggestions,
      crackTime: result.crack_times_display.offline_slow_hashing_1e4_per_second,
      warning: result.feedback.warning,
    };
  }
  
  async checkPwnedPassword(password: string): Promise<boolean> {
    // Check against Have I Been Pwned API
    const hash = crypto.createHash('sha1').update(password).digest('hex');
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5).toUpperCase();
    
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const data = await response.text();
    
    return data.includes(suffix);
  }
  
  generateSecurePassword(): string {
    const length = 16;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    const randomBytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
      password += charset[randomBytes[i] % charset.length];
    }
    
    return password;
  }
}
```

#### Two-Factor Authentication
```typescript
class TwoFactorAuthService {
  private readonly issuer = 'Simple Todo';
  private readonly algorithm = 'SHA256';
  private readonly digits = 6;
  private readonly period = 30;
  
  async setupTwoFactor(user: User): Promise<TwoFactorSetup> {
    // Generate secret
    const secret = speakeasy.generateSecret({
      length: 32,
      name: `${this.issuer} (${user.email})`,
      issuer: this.issuer,
    });
    
    // Generate backup codes
    const backupCodes = this.generateBackupCodes();
    
    // Encrypt and store secret
    const encryptedSecret = await this.encryptSecret(secret.base32);
    
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorSecret: encryptedSecret,
        twoFactorBackupCodes: backupCodes.map(code => 
          crypto.createHash('sha256').update(code).digest('hex')
        ),
      },
    });
    
    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);
    
    return {
      secret: secret.base32,
      qrCode,
      backupCodes,
    };
  }
  
  async verifyTwoFactorCode(user: User, code: string): Promise<boolean> {
    if (!user.twoFactorSecret) {
      throw new AuthError('2FA not enabled', '2FA_NOT_ENABLED');
    }
    
    // Decrypt secret
    const secret = await this.decryptSecret(user.twoFactorSecret);
    
    // Verify TOTP code
    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: code,
      window: 2, // Allow 1 step before/after
    });
    
    if (!verified) {
      // Check backup codes
      const hashedCode = crypto.createHash('sha256').update(code).digest('hex');
      const backupCodes = user.twoFactorBackupCodes || [];
      
      if (backupCodes.includes(hashedCode)) {
        // Remove used backup code
        await this.prisma.user.update({
          where: { id: user.id },
          data: {
            twoFactorBackupCodes: backupCodes.filter(c => c !== hashedCode),
          },
        });
        return true;
      }
    }
    
    return verified;
  }
  
  private generateBackupCodes(): string[] {
    const codes: string[] = [];
    
    for (let i = 0; i < 10; i++) {
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      codes.push(`${code.slice(0, 4)}-${code.slice(4)}`);
    }
    
    return codes;
  }
  
  private async encryptSecret(secret: string): Promise<string> {
    const key = await this.getDerivedKey();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    
    let encrypted = cipher.update(secret, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
  }
  
  private async decryptSecret(encrypted: string): Promise<string> {
    const [ivHex, authTagHex, encryptedHex] = encrypted.split(':');
    
    const key = await this.getDerivedKey();
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
```

#### Rate Limiting
```typescript
class RateLimitService {
  private redis: RedisClient;
  
  private limits = {
    signin: { window: 900, max: 5 }, // 5 attempts per 15 minutes
    signup: { window: 3600, max: 3 }, // 3 signups per hour
    password_reset: { window: 3600, max: 3 }, // 3 resets per hour
    api_general: { window: 60, max: 100 }, // 100 requests per minute
  };
  
  async checkRateLimit(
    action: keyof typeof this.limits,
    identifier: string
  ): Promise<RateLimitResult> {
    const limit = this.limits[action];
    const key = `ratelimit:${action}:${identifier}`;
    
    const pipeline = this.redis.pipeline();
    const now = Date.now();
    const window = now - (limit.window * 1000);
    
    // Remove old entries
    pipeline.zremrangebyscore(key, 0, window);
    
    // Count current entries
    pipeline.zcard(key);
    
    // Add new entry
    pipeline.zadd(key, now, `${now}-${crypto.randomBytes(4).toString('hex')}`);
    
    // Set expiry
    pipeline.expire(key, limit.window);
    
    const results = await pipeline.exec();
    const count = results[1][1] as number;
    
    if (count >= limit.max) {
      const oldestEntry = await this.redis.zrange(key, 0, 0, 'WITHSCORES');
      const resetAt = parseInt(oldestEntry[1]) + (limit.window * 1000);
      
      return {
        allowed: false,
        limit: limit.max,
        remaining: 0,
        resetAt: new Date(resetAt),
      };
    }
    
    return {
      allowed: true,
      limit: limit.max,
      remaining: limit.max - count - 1,
      resetAt: new Date(now + (limit.window * 1000)),
    };
  }
  
  async resetRateLimit(action: string, identifier: string): Promise<void> {
    const key = `ratelimit:${action}:${identifier}`;
    await this.redis.del(key);
  }
}
```

### Database Schema

```sql
-- Users table with comprehensive fields
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMP WITH TIME ZONE,
  password_hash VARCHAR(255),
  name VARCHAR(255),
  avatar VARCHAR(500),
  bio TEXT,
  
  -- Security fields
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  two_factor_secret TEXT, -- Encrypted
  two_factor_backup_codes TEXT[], -- Hashed
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  last_password_change TIMESTAMP WITH TIME ZONE,
  password_history TEXT[], -- Hashed previous passwords
  
  -- Metadata
  signup_source VARCHAR(50), -- email, google, github
  signup_ip INET,
  last_login_at TIMESTAMP WITH TIME ZONE,
  last_login_ip INET,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE, -- Soft delete
  
  -- Indexes
  CONSTRAINT email_lowercase CHECK (email = LOWER(email))
);

CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_created_at ON users(created_at);

-- OAuth accounts linking
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL, -- google, github
  provider_account_id VARCHAR(255) NOT NULL,
  
  -- OAuth tokens
  access_token TEXT,
  refresh_token TEXT,
  token_type VARCHAR(50),
  scope TEXT,
  id_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Provider data
  provider_data JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Constraints
  UNIQUE(provider, provider_account_id)
);

CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_accounts_provider ON accounts(provider, provider_account_id);

-- Sessions with detailed tracking
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  refresh_token VARCHAR(255) UNIQUE,
  
  -- Expiry
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  idle_expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Device info
  ip_address INET,
  user_agent TEXT,
  device_fingerprint VARCHAR(255),
  device_name VARCHAR(255),
  device_type VARCHAR(50), -- desktop, mobile, tablet
  browser_name VARCHAR(50),
  browser_version VARCHAR(50),
  os_name VARCHAR(50),
  os_version VARCHAR(50),
  
  -- Location
  country_code VARCHAR(2),
  region VARCHAR(255),
  city VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Activity
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  activity_count INTEGER DEFAULT 1,
  
  -- Security
  is_suspicious BOOLEAN DEFAULT FALSE,
  risk_score DECIMAL(3, 2),
  
  -- Indexes
  CONSTRAINT session_token_length CHECK (LENGTH(session_token) >= 32)
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX idx_sessions_last_activity ON sessions(last_activity);

-- Email verification tokens
CREATE TABLE verification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier VARCHAR(255) NOT NULL, -- email or user_id
  token VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL, -- email_verification, password_reset
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  used_at TIMESTAMP WITH TIME ZONE,
  
  -- Rate limiting
  attempts INTEGER DEFAULT 0,
  last_attempt TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  metadata JSONB,
  
  -- Constraints
  CONSTRAINT token_not_expired CHECK (expires_at > CURRENT_TIMESTAMP)
);

CREATE INDEX idx_verification_tokens_identifier ON verification_tokens(identifier);
CREATE INDEX idx_verification_tokens_token ON verification_tokens(token);
CREATE INDEX idx_verification_tokens_expires_at ON verification_tokens(expires_at);

-- User preferences
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  
  -- UI preferences
  theme VARCHAR(20) DEFAULT 'system',
  language VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(50) DEFAULT 'UTC',
  date_format VARCHAR(20) DEFAULT 'MM/DD/YYYY',
  time_format VARCHAR(20) DEFAULT '12h',
  
  -- Notification preferences
  email_notifications BOOLEAN DEFAULT TRUE,
  security_alerts BOOLEAN DEFAULT TRUE,
  marketing_emails BOOLEAN DEFAULT FALSE,
  weekly_summary BOOLEAN DEFAULT TRUE,
  
  -- Todo preferences
  todo_sort_order VARCHAR(20) DEFAULT 'newest',
  default_todo_list UUID,
  show_completed BOOLEAN DEFAULT TRUE,
  
  -- Privacy preferences
  profile_visibility VARCHAR(20) DEFAULT 'private',
  show_activity BOOLEAN DEFAULT FALSE,
  allow_indexing BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit log for security events
CREATE TABLE auth_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event_type VARCHAR(50) NOT NULL,
  
  -- Event details
  success BOOLEAN NOT NULL,
  error_code VARCHAR(50),
  error_message TEXT,
  
  -- Request info
  ip_address INET,
  user_agent TEXT,
  request_id UUID,
  session_id UUID,
  
  -- Additional data
  metadata JSONB,
  
  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_auth_events_user_id ON auth_events(user_id);
CREATE INDEX idx_auth_events_type ON auth_events(event_type);
CREATE INDEX idx_auth_events_created_at ON auth_events(created_at);
CREATE INDEX idx_auth_events_ip ON auth_events(ip_address);

-- Todo migration tracking
CREATE TABLE todo_migrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Migration status
  status VARCHAR(20) NOT NULL, -- pending, in_progress, completed, failed
  source VARCHAR(20) NOT NULL, -- localStorage, import
  
  -- Progress tracking
  total_todos INTEGER NOT NULL,
  migrated_todos INTEGER DEFAULT 0,
  failed_todos INTEGER DEFAULT 0,
  skipped_todos INTEGER DEFAULT 0,
  
  -- Timing
  started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Error tracking
  errors JSONB DEFAULT '[]',
  
  -- Rollback support
  rollback_data JSONB,
  rolled_back BOOLEAN DEFAULT FALSE,
  rolled_back_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_todo_migrations_user_id ON todo_migrations(user_id);
CREATE INDEX idx_todo_migrations_status ON todo_migrations(status);

-- Update todos table for user ownership
ALTER TABLE todos 
ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE CASCADE,
ADD COLUMN migrated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN migration_id UUID REFERENCES todo_migrations(id);

CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_migration_id ON todos(migration_id);

-- Functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_accounts_updated_at
  BEFORE UPDATE ON accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

## API Design

### REST Endpoints

```typescript
// Authentication endpoints
POST   /api/auth/signup
  Body: {
    email: string
    password: string
    name?: string
    inviteCode?: string
  }
  Response: {
    user: User
    requiresVerification: boolean
  }

POST   /api/auth/signin
  Body: {
    email: string
    password: string
    rememberMe?: boolean
    twoFactorCode?: string
  }
  Response: {
    user: User
    accessToken: string
    refreshToken: string
    requiresTwoFactor?: boolean
  }

POST   /api/auth/signout
  Headers: Authorization: Bearer <token>
  Body: {
    allDevices?: boolean
  }
  Response: {
    success: boolean
  }

POST   /api/auth/refresh
  Body: {
    refreshToken: string
  }
  Response: {
    accessToken: string
    refreshToken: string
    expiresIn: number
  }

// Email verification
POST   /api/auth/verify-email
  Body: {
    token: string
  }
  Response: {
    success: boolean
    user: User
  }

POST   /api/auth/resend-verification
  Headers: Authorization: Bearer <token>
  Response: {
    success: boolean
    sentTo: string
  }

// Password management
POST   /api/auth/forgot-password
  Body: {
    email: string
  }
  Response: {
    success: boolean
    message: string
  }

POST   /api/auth/reset-password
  Body: {
    token: string
    password: string
  }
  Response: {
    success: boolean
  }

POST   /api/auth/change-password
  Headers: Authorization: Bearer <token>
  Body: {
    currentPassword: string
    newPassword: string
  }
  Response: {
    success: boolean
  }

// Two-factor authentication
POST   /api/auth/2fa/setup
  Headers: Authorization: Bearer <token>
  Response: {
    secret: string
    qrCode: string
    backupCodes: string[]
  }

POST   /api/auth/2fa/verify
  Headers: Authorization: Bearer <token>
  Body: {
    code: string
  }
  Response: {
    success: boolean
  }

POST   /api/auth/2fa/disable
  Headers: Authorization: Bearer <token>
  Body: {
    code: string
    password: string
  }
  Response: {
    success: boolean
  }

// Profile management
GET    /api/profile
  Headers: Authorization: Bearer <token>
  Response: {
    user: UserProfile
    preferences: UserPreferences
  }

PUT    /api/profile
  Headers: Authorization: Bearer <token>
  Body: Partial<UserProfile>
  Response: {
    user: UserProfile
  }

POST   /api/profile/avatar
  Headers: Authorization: Bearer <token>
  Body: FormData (image file)
  Response: {
    avatarUrl: string
  }

DELETE /api/profile/avatar
  Headers: Authorization: Bearer <token>
  Response: {
    success: boolean
  }

PUT    /api/profile/preferences
  Headers: Authorization: Bearer <token>
  Body: Partial<UserPreferences>
  Response: {
    preferences: UserPreferences
  }

POST   /api/profile/change-email
  Headers: Authorization: Bearer <token>
  Body: {
    newEmail: string
    password: string
  }
  Response: {
    success: boolean
    requiresVerification: boolean
  }

// Session management
GET    /api/sessions
  Headers: Authorization: Bearer <token>
  Response: {
    sessions: SessionInfo[]
    current: string
  }

DELETE /api/sessions/:id
  Headers: Authorization: Bearer <token>
  Response: {
    success: boolean
  }

POST   /api/sessions/revoke-all
  Headers: Authorization: Bearer <token>
  Body: {
    exceptCurrent?: boolean
  }
  Response: {
    revokedCount: number
  }

// Account management
POST   /api/account/delete
  Headers: Authorization: Bearer <token>
  Body: {
    password: string
    feedback?: string
  }
  Response: {
    success: boolean
    scheduledDeletion: Date
  }

GET    /api/account/export
  Headers: Authorization: Bearer <token>
  Response: {
    data: AccountDataExport
    downloadUrl: string
  }

// Todo migration
POST   /api/migrate/todos
  Headers: Authorization: Bearer <token>
  Body: {
    todos: Todo[]
  }
  Response: {
    migrationId: string
    status: string
  }

GET    /api/migrate/status/:id
  Headers: Authorization: Bearer <token>
  Response: {
    migration: TodoMigration
    progress: MigrationProgress
  }

POST   /api/migrate/retry/:id
  Headers: Authorization: Bearer <token>
  Response: {
    success: boolean
  }
```

### WebSocket Events

```typescript
// Client -> Server
socket.emit('auth:refresh-token', { refreshToken: string });
socket.emit('session:activity', { timestamp: Date });
socket.emit('session:revoke', { sessionId: string });

// Server -> Client
socket.on('auth:token-refreshed', { accessToken: string });
socket.on('auth:session-expired', { reason: string });
socket.on('auth:force-logout', { reason: string });
socket.on('session:new-device', { device: DeviceInfo });
socket.on('security:alert', { type: string, message: string });
```

### GraphQL Schema (Future)

```graphql
type Query {
  me: User
  profile: UserProfile
  sessions: [Session!]!
  preferences: UserPreferences!
  migrationStatus(id: ID!): TodoMigration
}

type Mutation {
  signUp(input: SignUpInput!): AuthResult!
  signIn(input: SignInInput!): AuthResult!
  signOut(allDevices: Boolean): Boolean!
  
  updateProfile(input: UpdateProfileInput!): UserProfile!
  updatePreferences(input: UpdatePreferencesInput!): UserPreferences!
  
  changePassword(current: String!, new: String!): Boolean!
  resetPassword(token: String!, password: String!): Boolean!
  
  enable2FA: TwoFactorSetup!
  verify2FA(code: String!): Boolean!
  disable2FA(code: String!, password: String!): Boolean!
  
  migrateTodos(todos: [TodoInput!]!): TodoMigration!
  
  deleteAccount(password: String!, feedback: String): AccountDeletion!
}

type Subscription {
  sessionActivity: SessionEvent!
  securityAlert: SecurityAlert!
  migrationProgress(id: ID!): MigrationProgress!
}

type User {
  id: ID!
  email: String!
  emailVerified: Boolean!
  name: String
  avatar: String
  createdAt: DateTime!
  updatedAt: DateTime!
}

type AuthResult {
  user: User!
  accessToken: String!
  refreshToken: String!
  expiresIn: Int!
  requiresTwoFactor: Boolean
}
```

## Security Architecture

### Defense in Depth

```
Layer 1: Network Security
├── HTTPS only (TLS 1.3)
├── HSTS headers
├── Certificate pinning
└── DDoS protection

Layer 2: Application Security
├── Input validation
├── Output encoding
├── CSRF protection
├── XSS prevention
└── SQL injection prevention

Layer 3: Authentication Security
├── Strong password policy
├── Password hashing (Argon2id)
├── Two-factor authentication
├── OAuth 2.0 + PKCE
└── Session management

Layer 4: Authorization Security
├── JWT with short expiry
├── Refresh token rotation
├── Role-based access control
├── Resource ownership validation
└── API rate limiting

Layer 5: Data Security
├── Encryption at rest
├── Encryption in transit
├── PII minimization
├── Secure key management
└── Data retention policies

Layer 6: Monitoring & Response
├── Security event logging
├── Anomaly detection
├── Incident response plan
├── Regular security audits
└── Vulnerability scanning
```

### Security Headers

```typescript
const securityHeaders = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self' https://api.github.com https://accounts.google.com",
    "frame-src 'self' https://accounts.google.com https://www.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ')
};
```

### Threat Model

| Threat | Impact | Likelihood | Mitigation |
|--------|--------|------------|------------|
| Password brute force | High | High | Rate limiting, account lockout, strong passwords |
| Session hijacking | High | Medium | Secure cookies, session fingerprinting, activity monitoring |
| Account takeover | Critical | Medium | 2FA, device verification, security alerts |
| SQL injection | High | Low | Parameterized queries, ORM validation |
| XSS attacks | Medium | Low | Input sanitization, CSP, output encoding |
| CSRF attacks | Medium | Low | CSRF tokens, SameSite cookies |
| Man-in-the-middle | High | Low | HTTPS only, HSTS, certificate pinning |
| Data breach | Critical | Low | Encryption, access controls, monitoring |

## Performance Optimization

### Caching Strategy

```typescript
// Multi-layer caching architecture
class CacheManager {
  private l1Cache: LRUCache; // In-memory cache
  private l2Cache: RedisClient; // Redis cache
  private l3Cache: CDN; // Edge cache
  
  async get(key: string): Promise<any> {
    // Check L1 cache (fastest)
    const l1Result = this.l1Cache.get(key);
    if (l1Result) return l1Result;
    
    // Check L2 cache
    const l2Result = await this.l2Cache.get(key);
    if (l2Result) {
      this.l1Cache.set(key, l2Result);
      return l2Result;
    }
    
    // Check L3 cache
    const l3Result = await this.l3Cache.get(key);
    if (l3Result) {
      await this.l2Cache.setex(key, 300, l3Result);
      this.l1Cache.set(key, l3Result);
      return l3Result;
    }
    
    return null;
  }
  
  async set(key: string, value: any, ttl: number): Promise<void> {
    // Set in all cache layers
    this.l1Cache.set(key, value, ttl);
    await this.l2Cache.setex(key, ttl, JSON.stringify(value));
    await this.l3Cache.put(key, value, ttl);
  }
}

// Cache keys and TTLs
const cacheConfig = {
  userProfile: {
    key: (userId: string) => `profile:${userId}`,
    ttl: 300, // 5 minutes
  },
  userSessions: {
    key: (userId: string) => `sessions:${userId}`,
    ttl: 60, // 1 minute
  },
  preferences: {
    key: (userId: string) => `preferences:${userId}`,
    ttl: 600, // 10 minutes
  },
};
```

### Database Optimization

```sql
-- Optimized queries with proper indexes
-- User lookup by email (most common)
CREATE INDEX idx_users_email_verified ON users(email) 
WHERE deleted_at IS NULL AND email_verified = true;

-- Session validation (high frequency)
CREATE INDEX idx_sessions_token_expires ON sessions(session_token, expires_at)
WHERE expires_at > CURRENT_TIMESTAMP;

-- Active sessions for user
CREATE INDEX idx_sessions_user_active ON sessions(user_id, expires_at)
WHERE expires_at > CURRENT_TIMESTAMP;

-- Migration status checks
CREATE INDEX idx_migrations_user_status ON todo_migrations(user_id, status)
WHERE status IN ('pending', 'in_progress');

-- Query optimization examples
-- Efficient user lookup with preferences
CREATE VIEW user_with_preferences AS
SELECT 
  u.*,
  p.*,
  (SELECT COUNT(*) FROM sessions s 
   WHERE s.user_id = u.id AND s.expires_at > CURRENT_TIMESTAMP) as active_sessions
FROM users u
LEFT JOIN user_preferences p ON p.user_id = u.id
WHERE u.deleted_at IS NULL;

-- Materialized view for user stats
CREATE MATERIALIZED VIEW user_stats AS
SELECT 
  u.id as user_id,
  COUNT(DISTINCT s.id) as total_sessions,
  COUNT(DISTINCT t.id) as total_todos,
  MAX(s.last_activity) as last_active,
  u.created_at
FROM users u
LEFT JOIN sessions s ON s.user_id = u.id
LEFT JOIN todos t ON t.user_id = u.id
GROUP BY u.id, u.created_at;

-- Refresh materialized view periodically
CREATE OR REPLACE FUNCTION refresh_user_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY user_stats;
END;
$$ LANGUAGE plpgsql;
```

### Connection Pooling

```typescript
// Database connection pool configuration
const poolConfig = {
  min: 2,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  statement_timeout: 5000,
  query_timeout: 10000,
  
  // Connection lifecycle
  beforeCreate: async (conn) => {
    await conn.query('SET timezone = "UTC"');
  },
  
  afterCreate: async (conn) => {
    await conn.query('LISTEN session_updates');
  },
  
  // Health checks
  validateConnection: async (conn) => {
    try {
      await conn.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  },
};

// Redis connection pool
const redisPool = {
  min: 2,
  max: 20,
  acquireTimeoutMillis: 3000,
  destroyTimeoutMillis: 5000,
  
  create: async () => {
    const client = new Redis({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });
    
    return client;
  },
  
  destroy: async (client) => {
    await client.quit();
  },
};
```

## Monitoring & Analytics

### Metrics Collection

```typescript
// Prometheus metrics
const authMetrics = {
  // Counters
  signupAttempts: new Counter({
    name: 'auth_signup_attempts_total',
    help: 'Total signup attempts',
    labelNames: ['source', 'status'],
  }),
  
  loginAttempts: new Counter({
    name: 'auth_login_attempts_total',
    help: 'Total login attempts',
    labelNames: ['method', 'status', 'has_2fa'],
  }),
  
  tokenRefreshes: new Counter({
    name: 'auth_token_refreshes_total',
    help: 'Total token refresh attempts',
    labelNames: ['status'],
  }),
  
  // Histograms
  authDuration: new Histogram({
    name: 'auth_duration_seconds',
    help: 'Authentication operation duration',
    labelNames: ['operation'],
    buckets: [0.1, 0.5, 1, 2, 5],
  }),
  
  // Gauges
  activeSessions: new Gauge({
    name: 'auth_active_sessions',
    help: 'Current active sessions',
    labelNames: ['user_segment'],
  }),
  
  twoFactorAdoption: new Gauge({
    name: 'auth_2fa_adoption_rate',
    help: 'Percentage of users with 2FA enabled',
  }),
};

// Custom metrics collection
export function collectAuthMetrics(event: AuthEvent): void {
  switch (event.type) {
    case 'signup':
      authMetrics.signupAttempts.inc({
        source: event.source,
        status: event.success ? 'success' : 'failure',
      });
      break;
      
    case 'login':
      authMetrics.loginAttempts.inc({
        method: event.method,
        status: event.success ? 'success' : 'failure',
        has_2fa: event.has2FA ? 'yes' : 'no',
      });
      
      authMetrics.authDuration.observe(
        { operation: 'login' },
        event.duration
      );
      break;
  }
}
```

### Logging Strategy

```typescript
// Structured logging with context
class AuthLogger {
  private logger: winston.Logger;
  
  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: { service: 'auth' },
      transports: [
        new winston.transports.File({ filename: 'auth-error.log', level: 'error' }),
        new winston.transports.File({ filename: 'auth-combined.log' }),
      ],
    });
  }
  
  logAuthEvent(event: AuthEvent): void {
    const logEntry = {
      eventId: event.id,
      userId: event.userId,
      eventType: event.type,
      success: event.success,
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      timestamp: event.timestamp,
      
      // Sanitize sensitive data
      metadata: this.sanitizeMetadata(event.metadata),
    };
    
    if (event.success) {
      this.logger.info('Authentication event', logEntry);
    } else {
      this.logger.warn('Authentication failure', {
        ...logEntry,
        error: event.error,
      });
    }
  }
  
  private sanitizeMetadata(metadata: any): any {
    const sensitive = ['password', 'token', 'secret', 'creditCard'];
    const sanitized = { ...metadata };
    
    for (const key of sensitive) {
      if (key in sanitized) {
        sanitized[key] = '[REDACTED]';
      }
    }
    
    return sanitized;
  }
}
```

### Analytics Dashboard

```typescript
// Real-time analytics queries
class AuthAnalytics {
  async getAuthMetrics(period: TimePeriod): Promise<AuthMetrics> {
    const [
      signupMetrics,
      loginMetrics,
      sessionMetrics,
      securityMetrics,
    ] = await Promise.all([
      this.getSignupMetrics(period),
      this.getLoginMetrics(period),
      this.getSessionMetrics(period),
      this.getSecurityMetrics(period),
    ]);
    
    return {
      signup: signupMetrics,
      login: loginMetrics,
      sessions: sessionMetrics,
      security: securityMetrics,
    };
  }
  
  private async getLoginMetrics(period: TimePeriod): Promise<LoginMetrics> {
    const query = `
      SELECT 
        DATE_TRUNC('hour', created_at) as hour,
        COUNT(*) FILTER (WHERE success = true) as successful,
        COUNT(*) FILTER (WHERE success = false) as failed,
        COUNT(*) FILTER (WHERE event_type = 'login_2fa') as with_2fa,
        AVG(EXTRACT(EPOCH FROM response_time)) as avg_duration
      FROM auth_events
      WHERE 
        event_type IN ('login', 'login_2fa')
        AND created_at >= NOW() - INTERVAL '${period}'
      GROUP BY hour
      ORDER BY hour DESC
    `;
    
    const results = await this.db.query(query);
    
    return {
      timeSeries: results.rows,
      summary: {
        totalAttempts: results.rows.reduce((sum, row) => sum + row.successful + row.failed, 0),
        successRate: this.calculateSuccessRate(results.rows),
        avgDuration: this.calculateAverage(results.rows, 'avg_duration'),
        twoFactorUsage: this.calculate2FAUsage(results.rows),
      },
    };
  }
}
```

## Testing Strategy

### Unit Tests

```typescript
// Auth store tests
describe('AuthStore', () => {
  let store: AuthStore;
  let mockAuthService: jest.Mocked<AuthService>;
  
  beforeEach(() => {
    store = createAuthStore();
    mockAuthService = createMockAuthService();
  });
  
  describe('signIn', () => {
    it('should sign in successfully with valid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'ValidPass123!',
      };
      
      mockAuthService.signIn.mockResolvedValue({
        user: mockUser,
        accessToken: 'mock-token',
      });
      
      await store.signIn(credentials);
      
      expect(store.user).toEqual(mockUser);
      expect(store.isAuthenticated).toBe(true);
      expect(store.error).toBeNull();
    });
    
    it('should handle rate limiting', async () => {
      mockAuthService.signIn.mockRejectedValue(
        new RateLimitError('Too many attempts')
      );
      
      await expect(store.signIn(credentials)).rejects.toThrow('Too many attempts');
      expect(store.error?.code).toBe('RATE_LIMITED');
    });
    
    it('should require 2FA when enabled', async () => {
      mockAuthService.signIn.mockResolvedValue({
        requiresTwoFactor: true,
      });
      
      const result = await store.signIn(credentials);
      expect(result.requiresTwoFactor).toBe(true);
    });
  });
});

// Security service tests
describe('PasswordSecurityService', () => {
  let service: PasswordSecurityService;
  
  beforeEach(() => {
    service = new PasswordSecurityService();
  });
  
  describe('password validation', () => {
    it.each([
      ['', 'Password is required'],
      ['short', 'Password too short'],
      ['alllowercase', 'Password must contain uppercase'],
      ['ALLUPPERCASE', 'Password must contain lowercase'],
      ['NoNumbers!', 'Password must contain numbers'],
      ['NoSpecial123', 'Password must contain special characters'],
      ['Valid123!Pass', null],
    ])('validates password "%s"', async (password, expectedError) => {
      const result = service.validatePassword(password);
      
      if (expectedError) {
        expect(result.valid).toBe(false);
        expect(result.errors).toContain(expectedError);
      } else {
        expect(result.valid).toBe(true);
      }
    });
  });
  
  describe('password hashing', () => {
    it('should hash passwords with Argon2id', async () => {
      const password = 'SecurePass123!';
      const hash = await service.hashPassword(password);
      
      expect(hash).toMatch(/^\$argon2id\$/);
      expect(hash.length).toBeGreaterThan(60);
    });
    
    it('should verify correct passwords', async () => {
      const password = 'SecurePass123!';
      const hash = await service.hashPassword(password);
      
      const valid = await service.verifyPassword(hash, password);
      expect(valid).toBe(true);
    });
    
    it('should reject incorrect passwords', async () => {
      const password = 'SecurePass123!';
      const hash = await service.hashPassword(password);
      
      const valid = await service.verifyPassword(hash, 'WrongPass123!');
      expect(valid).toBe(false);
    });
  });
});
```

### Integration Tests

```typescript
// API integration tests
describe('Auth API', () => {
  let app: Application;
  let db: TestDatabase;
  
  beforeAll(async () => {
    db = await createTestDatabase();
    app = await createTestApp(db);
  });
  
  describe('POST /api/auth/signup', () => {
    it('should create new user account', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'newuser@example.com',
          password: 'SecurePass123!',
          name: 'New User',
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        user: {
          email: 'newuser@example.com',
          name: 'New User',
          emailVerified: false,
        },
        requiresVerification: true,
      });
      
      // Verify user created in database
      const user = await db.users.findByEmail('newuser@example.com');
      expect(user).toBeDefined();
      expect(user.passwordHash).toBeDefined();
    });
    
    it('should send verification email', async () => {
      const emailSpy = jest.spyOn(emailService, 'send');
      
      await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'verify@example.com',
          password: 'SecurePass123!',
        });
      
      expect(emailSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'verify@example.com',
          template: 'email-verification',
        })
      );
    });
  });
  
  describe('Session management', () => {
    it('should maintain session across requests', async () => {
      // Sign in
      const loginRes = await request(app)
        .post('/api/auth/signin')
        .send({
          email: 'test@example.com',
          password: 'password',
        });
      
      const { accessToken } = loginRes.body;
      
      // Use token for authenticated request
      const profileRes = await request(app)
        .get('/api/profile')
        .set('Authorization', `Bearer ${accessToken}`);
      
      expect(profileRes.status).toBe(200);
      expect(profileRes.body.user.email).toBe('test@example.com');
    });
    
    it('should refresh expired tokens', async () => {
      const { refreshToken } = await getAuthTokens();
      
      // Wait for access token to expire
      await delay(1000);
      
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.refreshToken).not.toBe(refreshToken);
    });
  });
});
```

### E2E Tests

```typescript
// Playwright E2E tests
test.describe('Authentication Flow', () => {
  test('complete signup and login flow', async ({ page }) => {
    // Navigate to signup
    await page.goto('/auth/signup');
    
    // Fill signup form
    await page.fill('[name="email"]', 'e2e@example.com');
    await page.fill('[name="password"]', 'E2ETest123!');
    await page.fill('[name="confirmPassword"]', 'E2ETest123!');
    await page.check('[name="terms"]');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Verify redirect to verification page
    await expect(page).toHaveURL('/auth/verify');
    await expect(page.locator('text=Check your email')).toBeVisible();
    
    // Simulate email verification
    const verificationToken = await getVerificationToken('e2e@example.com');
    await page.goto(`/auth/verify?token=${verificationToken}`);
    
    // Verify success and redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Welcome to Simple Todo')).toBeVisible();
    
    // Sign out
    await page.click('[data-testid="user-menu"]');
    await page.click('text=Sign Out');
    
    // Sign back in
    await page.goto('/auth/signin');
    await page.fill('[name="email"]', 'e2e@example.com');
    await page.fill('[name="password"]', 'E2ETest123!');
    await page.click('button[type="submit"]');
    
    // Verify successful login
    await expect(page).toHaveURL('/dashboard');
  });
  
  test('OAuth signup flow', async ({ page, context }) => {
    // Mock OAuth provider
    await context.route('https://accounts.google.com/**', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          access_token: 'mock-token',
          user: {
            email: 'oauth@example.com',
            name: 'OAuth User',
          },
        }),
      });
    });
    
    await page.goto('/auth/signup');
    await page.click('button:has-text("Continue with Google")');
    
    // Handle OAuth popup
    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      page.click('button:has-text("Continue with Google")'),
    ]);
    
    await popup.waitForLoadState();
    await popup.close();
    
    // Verify account created and logged in
    await expect(page).toHaveURL('/dashboard');
  });
  
  test('todo migration flow', async ({ page }) => {
    // Add todos to localStorage
    await page.evaluate(() => {
      localStorage.setItem('todos', JSON.stringify([
        { id: '1', text: 'Migrate me', completed: false },
        { id: '2', text: 'Me too', completed: true },
      ]));
    });
    
    // Sign up
    await signUpNewUser(page);
    
    // Should see migration prompt
    await expect(page.locator('text=Migrate Your Todos')).toBeVisible();
    await expect(page.locator('text=We found 2 todos')).toBeVisible();
    
    // Start migration
    await page.click('button:has-text("Yes, Migrate My Todos")');
    
    // Wait for migration to complete
    await expect(page.locator('[data-testid="migration-progress"]')).toBeVisible();
    await expect(page.locator('text=Migration complete!')).toBeVisible({
      timeout: 10000,
    });
    
    // Verify todos migrated
    await page.goto('/dashboard');
    await expect(page.locator('text=Migrate me')).toBeVisible();
    await expect(page.locator('text=Me too')).toBeVisible();
    
    // Verify localStorage cleared
    const localTodos = await page.evaluate(() => localStorage.getItem('todos'));
    expect(localTodos).toBeNull();
  });
});
```

## Migration Plan

### Phase 1: Infrastructure Setup (Week 1)
1. Set up PostgreSQL database
2. Configure Prisma ORM
3. Install and configure NextAuth.js v5
4. Set up Redis for caching
5. Configure SendGrid for emails
6. Create base API structure

### Phase 2: Core Authentication (Week 2-3)
1. Implement email/password signup
2. Add email verification flow
3. Create login functionality
4. Implement password reset
5. Add OAuth providers
6. Build authentication UI

### Phase 3: Session & Security (Week 4)
1. Implement JWT token management
2. Add refresh token rotation
3. Create session management
4. Implement rate limiting
5. Add security headers
6. Set up audit logging

### Phase 4: User Features (Week 5-6)
1. Build profile management
2. Add avatar upload
3. Implement preferences
4. Create account deletion
5. Add data export
6. Build todo migration

### Phase 5: Advanced Features (Week 7-8)
1. Implement two-factor authentication
2. Add device management
3. Create security alerts
4. Build activity monitoring
5. Add compliance features
6. Implement analytics

### Phase 6: Testing & Launch (Week 9-10)
1. Complete unit tests
2. Run integration tests
3. Perform security audit
4. Conduct load testing
5. Fix bugs and optimize
6. Deploy to production

## Performance Requirements

### Response Time Targets
- Signup: < 2s (including email send)
- Login: < 500ms (without 2FA)
- Token refresh: < 100ms
- Profile load: < 300ms
- Session list: < 200ms
- Todo migration: < 5s for 1000 items

### Throughput Targets
- 1000 concurrent users
- 100 signups per minute
- 1000 logins per minute
- 5000 API requests per minute
- 10000 active sessions

### Scalability Requirements
- Horizontal scaling support
- Database read replicas
- Redis cluster support
- Multi-region deployment
- Zero-downtime updates

## Success Criteria

### Technical Metrics
- 99.9% authentication uptime
- < 0.01% failed authentications (excluding invalid credentials)
- Zero security breaches
- 100% OWASP compliance
- 90% code coverage

### User Experience Metrics
- 50%+ account creation rate
- 95%+ login success rate
- < 2% password reset rate
- 80%+ email verification rate
- < 5% support tickets

### Business Impact
- 40% increase in user retention
- 60% multi-device usage
- 90% successful todo migrations
- 15% 2FA adoption
- Positive user feedback

## Risk Mitigation

### Technical Risks
1. **Database Performance**: Use connection pooling, query optimization, caching
2. **Email Deliverability**: Use reputable ESP, monitor reputation, implement fallbacks
3. **OAuth Provider Issues**: Multiple providers, graceful degradation
4. **Session Management Scale**: Redis clustering, session pruning
5. **Security Vulnerabilities**: Regular audits, dependency updates, monitoring

### Operational Risks
1. **User Adoption**: Simple onboarding, clear value proposition
2. **Support Burden**: Comprehensive documentation, self-service options
3. **Data Migration Issues**: Thorough testing, rollback capability
4. **Compliance Requirements**: Legal review, privacy by design
5. **Third-party Dependencies**: Vendor evaluation, fallback plans

## Future Enhancements

### Version 2.0
- Enterprise SSO (SAML, OIDC)
- Team accounts and collaboration
- Advanced role-based permissions
- API key management for developers
- Passwordless authentication options

### Version 3.0
- Biometric authentication
- Hardware security key support
- Blockchain-based identity
- Zero-knowledge authentication
- Federated identity management

---

**Document Version**: 1.0.0  
**Last Updated**: 2025-07-22  
**Next Review**: End of Phase 1  
**Approval Required**: Technical Lead, Security Lead, Product Owner