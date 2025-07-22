# Notifications & Reminders Feature Requirements Specification

**Feature Name**: notifications  
**Version**: 1.0.0  
**Date**: 2025-07-22  
**Status**: Draft  
**Dependencies**: core-todo, due-dates features

## 1. Overview

The Notifications & Reminders feature provides a comprehensive multi-channel notification system for the Simple Todo application. Building upon the basic browser notifications included in the due-dates feature, this system enables users to receive timely reminders through multiple channels, manage notification preferences, and ensure they never miss important tasks. The feature supports browser notifications, email reminders, mobile push notifications, and in-app alerts with intelligent bundling and user-centric controls.

## 2. Objectives

### Primary Objectives
- Provide reliable multi-channel notification delivery
- Reduce missed tasks through timely reminders
- Offer granular user control over notification preferences
- Support cross-device notification synchronization
- Enable smart notification bundling to prevent overload

### Business Goals
- Increase user engagement and retention
- Improve task completion rates
- Build a scalable notification infrastructure
- Enable future third-party integrations
- Maintain user trust through privacy-focused design

## 3. Scope

### In Scope
- Browser push notifications (expanding due-dates implementation)
- Email notifications with templates
- Mobile push notifications (iOS/Android)
- In-app notification center
- Notification preferences management
- Quiet hours and Do Not Disturb
- Smart notification bundling
- Priority-based routing
- Notification history
- Cross-device synchronization
- Offline queue management
- Basic webhook support

### Out of Scope
- SMS notifications
- Voice call reminders
- Slack/Teams integration (future)
- WhatsApp notifications
- Desktop app notifications
- Smartwatch notifications
- Location-based notifications
- AI-powered notification timing
- Complex workflow automations

## 4. User Stories

### Epic: Smart Notifications
As a user, I want to receive timely, relevant notifications about my tasks through my preferred channels so that I can stay on top of my responsibilities without being overwhelmed.

### User Stories

#### US-NOT-001: Choose Notification Channels
**As a** user  
**I want to** select which notification channels to use  
**So that** I receive reminders where I prefer  

**Acceptance Criteria:**
- Toggle for each channel (browser, email, push, in-app)
- Test notification for each channel
- Channel-specific settings available
- Visual confirmation of active channels
- Fallback channel configuration
- Clear permission status indicators

#### US-NOT-002: Set Notification Timing
**As a** user  
**I want to** control when I receive notifications  
**So that** they arrive at convenient times  

**Acceptance Criteria:**
- Default notification times configurable
- Per-todo custom timing override
- Relative timing (X minutes/hours before)
- Quiet hours setting
- Weekend preferences
- Timezone-aware scheduling

#### US-NOT-003: Configure Quiet Hours
**As a** user  
**I want to** set quiet hours  
**So that** I'm not disturbed during specific times  

**Acceptance Criteria:**
- Daily quiet hour schedule
- Different settings for weekdays/weekends
- Priority override for urgent tasks
- Queued delivery after quiet hours
- Visual indicator when active
- Quick toggle for immediate quiet

#### US-NOT-004: Receive Email Reminders
**As a** user  
**I want to** get email notifications  
**So that** I can see reminders in my inbox  

**Acceptance Criteria:**
- Well-formatted HTML emails
- Plain text fallback
- Customizable email frequency
- Unsubscribe link in footer
- Task details and quick actions
- Mobile-responsive design

#### US-NOT-005: Get Mobile Push Notifications
**As a** user  
**I want to** receive push notifications on my phone  
**So that** I get instant reminders anywhere  

**Acceptance Criteria:**
- Native iOS/Android notifications
- Rich notifications with actions
- App badge count updates
- Sound and vibration settings
- Grouped notifications support
- Deep linking to specific todos

#### US-NOT-006: Manage Notification Preferences
**As a** user  
**I want to** fine-tune my notification settings  
**So that** I only get relevant reminders  

**Acceptance Criteria:**
- Preference center with all options
- Per-priority notification rules
- Per-category toggles
- Frequency limits setting
- Sound/vibration preferences
- Save and apply immediately

#### US-NOT-007: Bundle Similar Notifications
**As a** user  
**I want** similar notifications grouped  
**So that** I don't get spammed  

**Acceptance Criteria:**
- Smart grouping algorithm
- Configurable bundling window
- Summary notification format
- Expand to see all items
- Different rules per channel
- Override for urgent items

#### US-NOT-008: Snooze Notifications
**As a** user  
**I want to** snooze notifications  
**So that** I can deal with them later  

**Acceptance Criteria:**
- Quick snooze options (5min, 1hr, tomorrow)
- Custom snooze time selection
- Snooze from notification itself
- Visual indicator of snoozed items
- Automatic re-delivery
- Snooze history tracking

#### US-NOT-009: View Notification History
**As a** user  
**I want to** see past notifications  
**So that** I can review what I missed  

**Acceptance Criteria:**
- Chronological notification list
- Filter by channel and type
- Mark as read/unread
- Search functionality
- Clear history option
- Export notification log

#### US-NOT-010: Set Priority Notifications
**As a** user  
**I want to** mark tasks for priority alerts  
**So that** critical items break through  

**Acceptance Criteria:**
- Priority flag on todos
- Override quiet hours option
- Multiple notification attempts
- Escalation settings
- Different sound/vibration
- Can't be bundled setting

#### US-NOT-011: Receive Digest Summaries
**As a** user  
**I want to** get daily/weekly summaries  
**So that** I can review upcoming tasks  

**Acceptance Criteria:**
- Daily morning digest option
- Weekly overview on Sunday
- Customizable digest time
- Include statistics
- One-click to view all
- Opt-out easily

#### US-NOT-012: Configure Webhooks
**As a** power user  
**I want to** send notifications to webhooks  
**So that** I can integrate with other tools  

**Acceptance Criteria:**
- Add webhook endpoints
- Choose notification types
- Custom payload templates
- Authentication options
- Test webhook button
- Retry configuration

## 5. Functional Requirements

### 5.1 Notification Channels

#### FR-NOT-001: Browser Notifications
- Extend existing due-date browser notifications
- Service worker for background delivery
- Rich notifications with images
- Action buttons (Complete, Snooze, View)
- Notification stacking/grouping
- Custom sounds support

#### FR-NOT-002: Email Notifications
- HTML email templates with branding
- Plain text alternative
- Responsive design for mobile
- Unsubscribe handling
- SPF/DKIM authentication
- Bounce/complaint handling

#### FR-NOT-003: Mobile Push Notifications
- iOS APNs integration
- Android FCM integration
- Silent notifications support
- Data-only notifications
- Notification categories
- Localized content

#### FR-NOT-004: In-App Notifications
- Real-time notification feed
- Unread count badge
- Notification types styling
- Mark as read/unread
- Batch operations
- Infinite scroll

### 5.2 Notification Types

#### FR-NOT-005: Notification Categories
```typescript
enum NotificationCategory {
  DUE_DATE = 'due_date',           // Task due soon
  OVERDUE = 'overdue',             // Task past due
  RECURRING = 'recurring',         // Recurring task reminder
  PRIORITY = 'priority',           // High priority task
  DIGEST = 'digest',               // Daily/weekly summary
  COMPLETION = 'completion',       // Task completed (mobile only)
  GOAL_PROGRESS = 'goal_progress', // Future: goal tracking
  SYSTEM = 'system'                // App updates, maintenance
}
```

#### FR-NOT-006: Notification Content
```typescript
interface NotificationContent {
  id: string;
  userId: string;
  category: NotificationCategory;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  
  // Content
  title: string;
  body: string;
  imageUrl?: string;
  iconUrl?: string;
  
  // Metadata
  todoId?: string;
  data?: Record<string, any>;
  
  // Actions
  actions?: NotificationAction[];
  deepLink?: string;
  
  // Scheduling
  scheduledFor: Date;
  expiresAt?: Date;
  
  // Delivery
  channels: NotificationChannel[];
  bundleKey?: string;
  groupId?: string;
}
```

### 5.3 Scheduling and Delivery

#### FR-NOT-007: Notification Scheduler
```typescript
interface NotificationScheduler {
  // Immediate
  sendNow(notification: NotificationContent): Promise<void>;
  
  // Scheduled
  schedule(notification: NotificationContent, time: Date): Promise<string>;
  cancel(notificationId: string): Promise<void>;
  
  // Recurring
  scheduleRecurring(
    notification: NotificationContent, 
    pattern: RecurrenceRule
  ): Promise<string>;
  
  // Batch
  scheduleBatch(notifications: NotificationContent[]): Promise<string[]>;
}
```

#### FR-NOT-008: Delivery Engine
- Queue-based architecture
- Retry with exponential backoff
- Dead letter queue for failures
- Channel fallback logic
- Delivery status tracking
- Rate limiting per user/channel

#### FR-NOT-009: Smart Bundling
```typescript
interface BundlingRules {
  enabled: boolean;
  windowMinutes: number;      // Bundle window (default: 15)
  maxItems: number;          // Max notifications per bundle
  
  // Per-category rules
  categories: {
    [key in NotificationCategory]?: {
      enabled: boolean;
      windowMinutes?: number;
      template?: string;
    };
  };
  
  // Exceptions
  neverBundle: {
    priority?: ('high' | 'urgent')[];
    categories?: NotificationCategory[];
  };
}
```

### 5.4 User Preferences

#### FR-NOT-010: Preference Schema
```typescript
interface NotificationPreferences {
  // Global settings
  enabled: boolean;
  quietHours: {
    enabled: boolean;
    start: string;    // HH:MM
    end: string;      // HH:MM
    weekends: boolean;
    timezone: string;
  };
  
  // Channel preferences
  channels: {
    browser: ChannelPreference;
    email: ChannelPreference;
    push: ChannelPreference;
    inApp: ChannelPreference;
  };
  
  // Category preferences
  categories: {
    [key in NotificationCategory]: {
      enabled: boolean;
      channels: NotificationChannel[];
      timing?: NotificationTiming;
    };
  };
  
  // Bundling
  bundling: BundlingRules;
  
  // Digest
  digest: {
    daily: {
      enabled: boolean;
      time: string;    // HH:MM
      includeCompleted: boolean;
    };
    weekly: {
      enabled: boolean;
      dayOfWeek: number; // 0-6
      time: string;
    };
  };
}

interface ChannelPreference {
  enabled: boolean;
  maxPerDay?: number;
  sound?: boolean;
  vibration?: boolean;
  priority?: {
    high: boolean;
    urgent: boolean;
  };
}
```

#### FR-NOT-011: Preference Management
- Default preferences on signup
- Import/export preferences
- Reset to defaults option
- A/B test preference variations
- Preference change history
- Sync across devices

### 5.5 Notification Center

#### FR-NOT-012: In-App Center
```typescript
interface NotificationCenter {
  // Display
  notifications: NotificationItem[];
  unreadCount: number;
  filters: NotificationFilter;
  
  // Actions
  markAsRead(ids: string[]): void;
  markAllAsRead(): void;
  delete(ids: string[]): void;
  snooze(id: string, until: Date): void;
  
  // Settings
  viewPreferences(): void;
  muteTemporarily(hours: number): void;
}
```

#### FR-NOT-013: Notification Actions
```typescript
interface NotificationAction {
  id: string;
  label: string;
  icon?: string;
  style?: 'default' | 'primary' | 'danger';
  
  // Action types
  action: 
    | { type: 'complete'; todoId: string }
    | { type: 'snooze'; options: SnoozeOption[] }
    | { type: 'view'; deepLink: string }
    | { type: 'dismiss' }
    | { type: 'custom'; handler: string };
}
```

### 5.6 Analytics and Monitoring

#### FR-NOT-014: Notification Analytics
```typescript
interface NotificationMetrics {
  // Delivery metrics
  sent: number;
  delivered: number;
  failed: number;
  bounced: number;
  
  // Engagement metrics
  opened: number;
  clicked: number;
  dismissed: number;
  snoozed: number;
  
  // Channel breakdown
  byChannel: {
    [channel: string]: ChannelMetrics;
  };
  
  // User behavior
  optOutRate: number;
  preferenceChanges: number;
  averageDeliveryTime: number;
}
```

### 5.7 Integration APIs

#### FR-NOT-015: Webhook Support
```typescript
interface WebhookConfig {
  id: string;
  url: string;
  secret?: string;
  
  // Filters
  events: NotificationCategory[];
  priorities?: ('low' | 'normal' | 'high' | 'urgent')[];
  
  // Configuration
  headers?: Record<string, string>;
  retryPolicy: {
    maxAttempts: number;
    backoffMultiplier: number;
  };
  
  // Status
  active: boolean;
  lastDelivery?: Date;
  failureCount: number;
}
```

## 6. Non-Functional Requirements

### 6.1 Reliability

#### NFR-NOT-001: Delivery Guarantee
- At-least-once delivery guarantee
- 99.9% delivery success rate
- Maximum 5-minute delay for immediate notifications
- Automatic retry for transient failures
- Dead letter queue for persistent failures

#### NFR-NOT-002: Fault Tolerance
- Graceful degradation per channel
- Circuit breaker for external services
- Fallback to alternative channels
- Queue persistence across restarts
- No data loss during failures

### 6.2 Performance

#### NFR-NOT-003: Latency Requirements
- Browser notification: < 100ms display
- Email queuing: < 500ms
- Push notification: < 2s delivery
- API response: < 200ms
- Preference updates: < 100ms

#### NFR-NOT-004: Scalability
- Support 100,000 concurrent users
- Handle 1M notifications/hour
- Queue 10M notifications
- 1000 notifications/second/channel
- Horizontal scaling capability

### 6.3 Security

#### NFR-NOT-005: Data Protection
- Encrypt notification content at rest
- TLS for all external communications
- Secure token management
- Rate limiting per user/IP
- Authentication for all APIs

#### NFR-NOT-006: Privacy
- GDPR compliance
- User consent tracking
- Right to deletion
- Data minimization
- Audit logging

### 6.4 Accessibility

#### NFR-NOT-007: Notification Accessibility
- Screen reader compatible
- High contrast support
- Keyboard navigation
- Alternative text for images
- Configurable text size

### 6.5 Compatibility

#### NFR-NOT-008: Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers

#### NFR-NOT-009: Mobile Support
- iOS 13+
- Android 8+
- React Native compatible
- Flutter compatible
- PWA support

## 7. Technical Requirements

### 7.1 Architecture Design

#### System Architecture
```
┌─────────────────────┐     ┌─────────────────────┐
│   Next.js App       │────▶│ Notification API    │
│   (Frontend)        │     │ (REST/GraphQL)      │
└─────────────────────┘     └─────────────────────┘
                                      │
                ┌─────────────────────┼─────────────────────┐
                │                     │                     │
                ▼                     ▼                     ▼
        ┌───────────────┐    ┌───────────────┐    ┌───────────────┐
        │ Queue Service │    │  Scheduler    │    │  Preference   │
        │  (BullMQ)     │    │  (Agenda)     │    │   Service     │
        └───────────────┘    └───────────────┘    └───────────────┘
                │                     │                     │
                └─────────────────────┴─────────────────────┘
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        │                             │                             │
        ▼                             ▼                             ▼
┌───────────────┐           ┌───────────────┐           ┌───────────────┐
│Browser Push   │           │Email Service  │           │Mobile Push    │
│Service Worker │           │SendGrid/SES   │           │FCM/APNs       │
└───────────────┘           └───────────────┘           └───────────────┘
```

#### Feature-First Architecture
```
src/features/notifications/
├── components/
│   ├── ChannelSettings.tsx
│   ├── CategorySettings.tsx
│   ├── DigestSettings.tsx
│   ├── NotificationBadge.tsx
│   ├── NotificationCenter.tsx
│   ├── NotificationItem.tsx
│   ├── PreferenceCenter.tsx
│   ├── QuietHoursToggle.tsx
│   └── WebhookManager.tsx
├── stores/
│   ├── notificationStore.ts      // Main notification state
│   ├── preferenceStore.ts        // User preferences
│   ├── channelStore.ts           // Channel configurations
│   └── historyStore.ts           // Notification history
├── hooks/
│   ├── useNotifications.ts       // Core notification logic
│   ├── useNotificationPreferences.ts
│   ├── useNotificationPermission.ts
│   ├── useChannels.ts            // Channel management
│   └── useWebhooks.ts            // Webhook operations
├── effects/
│   ├── notificationEffect.ts     // Side effects for notifications
│   ├── channelEffect.ts          // Channel-specific effects
│   ├── schedulerEffect.ts        // Scheduling logic
│   └── bundlingEffect.ts         // Notification bundling
├── types/
│   ├── notification.types.ts     // Core notification types
│   ├── channel.types.ts          // Channel interfaces
│   ├── preference.types.ts       // Preference interfaces
│   └── webhook.types.ts          // Webhook interfaces
├── utils/
│   ├── channels/
│   │   ├── browserChannel.ts     // Browser push logic
│   │   ├── emailChannel.ts       // Email sending
│   │   ├── pushChannel.ts        // Mobile push
│   │   └── inAppChannel.ts       // In-app notifications
│   ├── bundling.ts               // Bundling logic
│   ├── scheduler.ts              // Scheduling utilities
│   └── permissions.ts            // Permission helpers
└── workers/
    ├── notification.worker.ts
    └── service-worker.ts
```

### 7.2 Technology Stack

#### Backend Services
```json
{
  "dependencies": {
    "bullmq": "^4.0.0",          // Queue management
    "agenda": "^5.0.0",          // Job scheduling
    "node-pushnotifications": "^2.0.0", // Unified push
    "@sendgrid/mail": "^7.0.0",  // Email service
    "web-push": "^3.6.0",        // Browser push
    "ioredis": "^5.0.0",         // Redis client
    "handlebars": "^4.7.0"       // Email templates
  }
}
```

#### Frontend Dependencies
```json
{
  "dependencies": {
    "workbox-window": "^7.0.0",   // Service worker
    "@radix-ui/react-toast": "^1.0.0", // Toast UI
    "react-use-websocket": "^4.0.0", // Real-time updates
    "date-fns": "^3.0.0"          // Date handling
  }
}
```

### 7.3 Database Schema

#### Notification Tables
```sql
-- Notification templates
CREATE TABLE notification_templates (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    channel VARCHAR(50) NOT NULL,
    subject VARCHAR(255),
    body_template TEXT NOT NULL,
    variables JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Scheduled notifications
CREATE TABLE scheduled_notifications (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    notification_type VARCHAR(50) NOT NULL,
    payload JSONB NOT NULL,
    scheduled_for TIMESTAMP NOT NULL,
    channels TEXT[] NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    attempts INTEGER DEFAULT 0,
    last_attempt TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_scheduled_for (scheduled_for),
    INDEX idx_user_status (user_id, status)
);

-- Notification log
CREATE TABLE notification_log (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    notification_id UUID,
    channel VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    title VARCHAR(255),
    body TEXT,
    status VARCHAR(20) NOT NULL,
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    opened_at TIMESTAMP,
    clicked_at TIMESTAMP,
    error_message TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_user_notifications (user_id, created_at DESC)
);

-- User preferences
CREATE TABLE notification_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    preferences JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Push tokens
CREATE TABLE push_tokens (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    platform VARCHAR(20) NOT NULL, -- 'ios', 'android', 'web'
    token TEXT NOT NULL,
    device_info JSONB,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, platform, token)
);

-- Webhooks
CREATE TABLE webhooks (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    url TEXT NOT NULL,
    secret VARCHAR(255),
    events TEXT[] NOT NULL,
    headers JSONB,
    active BOOLEAN DEFAULT true,
    last_triggered TIMESTAMP,
    failure_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 7.4 Zustand Stores

#### Notification Store
```typescript
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { NotificationContent, NotificationItem, NotificationFilter } from '../types';

interface NotificationStore {
  // State
  notifications: NotificationItem[];
  unreadCount: number;
  filters: NotificationFilter;
  isLoading: boolean;
  
  // Actions
  addNotification: (notification: NotificationItem) => void;
  removeNotification: (id: string) => void;
  markAsRead: (ids: string[]) => void;
  markAllAsRead: () => void;
  
  // Filtering
  setFilter: (filter: Partial<NotificationFilter>) => void;
  clearFilters: () => void;
  
  // Batch operations
  addBatch: (notifications: NotificationItem[]) => void;
  clearAll: () => void;
  
  // Computed
  getFilteredNotifications: () => NotificationItem[];
}

export const useNotificationStore = create<NotificationStore>(
  subscribeWithSelector((set, get) => ({
    notifications: [],
    unreadCount: 0,
    filters: {},
    isLoading: false,
    
    addNotification: (notification) => set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + (notification.read ? 0 : 1),
    })),
    
    markAsRead: (ids) => set((state) => ({
      notifications: state.notifications.map(n => 
        ids.includes(n.id) ? { ...n, read: true } : n
      ),
      unreadCount: state.unreadCount - ids.length,
    })),
    
    // ... other implementations
  }))
);
```

#### Preference Store
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NotificationPreferences, ChannelPreference } from '../types';

interface PreferenceStore {
  // State
  globalEnabled: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
    weekends: boolean;
    timezone: string;
  };
  channels: Record<string, ChannelPreference>;
  categories: Record<string, CategoryPreference>;
  bundling: BundlingRules;
  
  // Actions
  updateGlobalEnabled: (enabled: boolean) => void;
  updateQuietHours: (settings: Partial<QuietHours>) => void;
  updateChannelPreference: (channel: string, prefs: Partial<ChannelPreference>) => void;
  updateCategoryPreference: (category: string, prefs: Partial<CategoryPreference>) => void;
  updateBundlingRules: (rules: Partial<BundlingRules>) => void;
  resetToDefaults: () => void;
}

export const usePreferenceStore = create<PreferenceStore>(
  persist(
    (set) => ({
      globalEnabled: true,
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00',
        weekends: true,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      channels: {
        browser: { enabled: true, maxPerDay: 20 },
        email: { enabled: false, maxPerDay: 5 },
        push: { enabled: false, maxPerDay: 10 },
        inApp: { enabled: true },
      },
      categories: {},
      bundling: {
        enabled: true,
        windowMinutes: 15,
        maxItems: 5,
      },
      
      // ... implementations
    }),
    {
      name: 'notification-preferences',
    }
  )
);
```

### 7.5 Custom Hooks

#### useNotifications Hook
```typescript
// Located in: src/features/notifications/hooks/useNotifications.ts

import { useNotificationStore } from '../stores/notificationStore';
import { usePreferenceStore } from '../stores/preferenceStore';
import { useEffect } from 'react';

export const useNotifications = () => {
  const { notifications, unreadCount, addNotification, markAsRead } = useNotificationStore();
  const { globalEnabled, quietHours, channels } = usePreferenceStore();
  
  const isInQuietHours = () => {
    if (!quietHours.enabled) return false;
    
    const now = new Date();
    const start = new Date();
    const end = new Date();
    
    const [startHour, startMin] = quietHours.start.split(':');
    const [endHour, endMin] = quietHours.end.split(':');
    
    start.setHours(parseInt(startHour), parseInt(startMin));
    end.setHours(parseInt(endHour), parseInt(endMin));
    
    return now >= start && now <= end;
  };
  
  const sendNotification = async (content: NotificationContent) => {
    if (!globalEnabled || isInQuietHours()) return;
    
    // Send through enabled channels
    Object.entries(channels).forEach(([channel, prefs]) => {
      if (prefs.enabled) {
        // Channel-specific sending logic
      }
    });
    
    addNotification(content);
  };
  
  return {
    notifications,
    unreadCount,
    sendNotification,
    markAsRead,
    isInQuietHours,
  };
};
```

#### useNotificationPermission Hook
```typescript
// Located in: src/features/notifications/hooks/useNotificationPermission.ts

import { useState, useEffect } from 'react';

export const useNotificationPermission = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  
  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);
  
  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    }
    return 'denied';
  };
  
  return {
    permission,
    requestPermission,
    isSupported: 'Notification' in window,
  };
};
```

### 7.6 Integration Patterns

#### Event-Driven Architecture
```typescript
// Notification events
enum NotificationEvent {
  NOTIFICATION_SCHEDULED = 'notification.scheduled',
  NOTIFICATION_SENT = 'notification.sent',
  NOTIFICATION_DELIVERED = 'notification.delivered',
  NOTIFICATION_OPENED = 'notification.opened',
  NOTIFICATION_CLICKED = 'notification.clicked',
  NOTIFICATION_FAILED = 'notification.failed',
  PREFERENCE_UPDATED = 'preference.updated',
  DEVICE_REGISTERED = 'device.registered'
}

// Event handlers
eventBus.on(NotificationEvent.NOTIFICATION_FAILED, async (event) => {
  // Retry logic
  // Fallback channel
  // Error tracking
});
```

### 7.6 Email Templates

#### Template Structure
```handlebars
<!-- base.hbs -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{subject}}</title>
    <style>
        /* Responsive email styles */
    </style>
</head>
<body>
    <div class="container">
        <header>
            <img src="{{logoUrl}}" alt="Simple Todo" />
        </header>
        
        <main>
            {{> content}}
        </main>
        
        <footer>
            <p>You're receiving this because you're subscribed to {{category}} notifications.</p>
            <p><a href="{{unsubscribeUrl}}">Unsubscribe</a> | <a href="{{preferencesUrl}}">Update Preferences</a></p>
        </footer>
    </div>
</body>
</html>
```

## 8. Data Requirements

### 8.1 Notification Data Model

#### Core Entities
```typescript
// Notification entity
interface Notification {
  id: string;
  userId: string;
  type: NotificationCategory;
  priority: NotificationPriority;
  
  // Content
  title: string;
  body: string;
  data: Record<string, any>;
  
  // Scheduling
  scheduledFor: Date;
  sentAt?: Date;
  expiresAt?: Date;
  
  // Delivery
  channels: ChannelDelivery[];
  bundleId?: string;
  
  // Status
  status: NotificationStatus;
  attempts: number;
  lastError?: string;
}

interface ChannelDelivery {
  channel: NotificationChannel;
  status: DeliveryStatus;
  messageId?: string;
  sentAt?: Date;
  deliveredAt?: Date;
  openedAt?: Date;
  error?: string;
}
```

### 8.2 Queue Management

#### Queue Structure
```typescript
interface NotificationQueue {
  immediate: Queue<ImmediateNotification>;
  scheduled: Queue<ScheduledNotification>;
  retry: Queue<RetryNotification>;
  digest: Queue<DigestNotification>;
}

interface QueuedNotification {
  id: string;
  priority: number; // 0-10
  attempts: number;
  nextAttempt: Date;
  payload: NotificationContent;
  metadata: {
    userId: string;
    correlationId: string;
    source: string;
  };
}
```

### 8.3 Analytics Data

#### Metrics Storage
```typescript
interface NotificationMetrics {
  // Counters
  sent: Counter;
  delivered: Counter;
  opened: Counter;
  clicked: Counter;
  failed: Counter;
  
  // Histograms
  deliveryTime: Histogram;
  queueTime: Histogram;
  
  // Gauges
  queueDepth: Gauge;
  activeDevices: Gauge;
  
  // By channel/category
  byChannel: Map<string, ChannelMetrics>;
  byCategory: Map<string, CategoryMetrics>;
}
```

## 9. UI/UX Requirements

### 9.1 Notification Center

#### Desktop Design
```
┌─────────────────────────────────────────┐
│ Notifications                      🔔 3  │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ 🔴 Overdue: Complete project report │ │
│ │ Due 2 days ago                      │ │
│ │ [Complete] [Snooze] [Reschedule]    │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 🟡 Tomorrow: Team standup meeting   │ │
│ │ Due tomorrow at 10:00 AM            │ │
│ │ [View] [Set Reminder]               │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 📊 Weekly Summary                   │ │
│ │ 5 tasks completed, 3 upcoming       │ │
│ │ [View Report]                       │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [Mark All Read] [Settings] [Clear All]  │
└─────────────────────────────────────────┘
```

#### Mobile Design
```
┌─────────────────────────┐
│ ← Notifications    🔔 3 │
├─────────────────────────┤
│ Today                   │
│ ┌─────────────────────┐ │
│ │ 🔴 Complete report  │ │
│ │ Overdue 2 days      │ │
│ │ ───────────────     │ │
│ │ [✓] [⏰] [📅]      │ │
│ └─────────────────────┘ │
│                         │
│ Yesterday               │
│ ┌─────────────────────┐ │
│ │ 🟡 Team meeting     │ │
│ │ Tomorrow 10 AM      │ │
│ └─────────────────────┘ │
│                         │
│ [Settings 🔧]           │
└─────────────────────────┘
```

### 9.2 Preference Center

#### Settings Layout
```
┌─────────────────────────────────────────┐
│ Notification Preferences                 │
├─────────────────────────────────────────┤
│ Channels                                │
│ ┌─────────────────────────────────────┐ │
│ │ 🌐 Browser Notifications        [✓] │ │
│ │ 📧 Email Notifications          [✓] │ │
│ │ 📱 Mobile Push                   [✓] │ │
│ │ 💬 In-App Notifications         [✓] │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Quiet Hours                             │
│ ┌─────────────────────────────────────┐ │
│ │ Enable Quiet Hours              [✓] │ │
│ │ From: [10:00 PM] To: [7:00 AM]     │ │
│ │ Include Weekends                [✓] │ │
│ │ Allow Urgent Notifications      [✓] │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Categories                              │
│ ┌─────────────────────────────────────┐ │
│ │ Due Date Reminders              [✓] │ │
│ │   └─ Channels: 🌐 📧 📱           │ │
│ │ Overdue Alerts                  [✓] │ │
│ │   └─ Channels: 🌐 📧 📱 💬        │ │
│ │ Daily Digest                    [✓] │ │
│ │   └─ Channels: 📧                 │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [Save Preferences] [Reset to Defaults]  │
└─────────────────────────────────────────┘
```

### 9.3 Visual Design

#### Notification States
```scss
// Priority colors
$priority-urgent: #dc2626;    // red-600
$priority-high: #ea580c;      // orange-600
$priority-normal: #3b82f6;    // blue-500
$priority-low: #6b7280;       // gray-500

// Status indicators
.notification {
  &.unread {
    background: #eff6ff;      // blue-50
    border-left: 4px solid $priority-normal;
  }
  
  &.read {
    opacity: 0.7;
  }
  
  &.snoozed {
    opacity: 0.5;
    .snooze-indicator {
      display: inline-block;
    }
  }
}
```

### 9.4 Interaction Patterns

#### Permission Request Flow
1. Contextual trigger (user action)
2. Explain value proposition
3. Show native permission dialog
4. Handle acceptance/rejection
5. Provide fallback options
6. Allow re-request later

#### Notification Actions
- **Swipe gestures** (mobile)
  - Swipe right: Mark as read
  - Swipe left: Show actions
- **Hover actions** (desktop)
  - Show on hover
  - Keyboard accessible
- **Batch operations**
  - Select multiple
  - Bulk actions menu

### 9.5 Accessibility

#### Screen Reader Support
- Announce new notifications
- Read notification content
- Describe priority/category
- Action button labels
- Status changes announced

#### Keyboard Navigation
- Tab through notifications
- Enter to expand/collapse
- Space to mark read/unread
- Escape to close
- Shortcuts for common actions

## 10. Testing Requirements

### 10.1 Unit Tests

#### Service Tests
```typescript
describe('NotificationService', () => {
  describe('send', () => {
    test('sends to all enabled channels');
    test('respects user preferences');
    test('handles channel failures gracefully');
    test('enforces rate limits');
  });
  
  describe('bundling', () => {
    test('bundles similar notifications');
    test('respects bundling window');
    test('excludes urgent notifications');
    test('creates meaningful summaries');
  });
});
```

#### Channel Tests
```typescript
describe('EmailChannel', () => {
  test('sends HTML and text versions');
  test('includes unsubscribe link');
  test('handles template variables');
  test('validates email addresses');
  test('tracks opens and clicks');
});
```

### 10.2 Integration Tests

#### Multi-Channel Delivery
```typescript
describe('Multi-channel delivery', () => {
  test('delivers to all configured channels');
  test('falls back when primary fails');
  test('tracks delivery per channel');
  test('handles partial failures');
});
```

### 10.3 E2E Tests

#### Critical Flows
1. Enable notifications and receive first reminder
2. Configure preferences and verify behavior
3. Snooze and re-receive notification
4. View and interact with notification center
5. Unsubscribe and stop receiving notifications

### 10.4 Performance Tests

#### Load Testing
- 10K concurrent notification sends
- 100K queued notifications
- 1M notification history queries
- Channel-specific throughput tests

### 10.5 Reliability Tests

#### Failure Scenarios
- Service crashes during send
- Database connection lost
- External service timeout
- Queue overflow
- Token expiration

## 11. Dependencies

### 11.1 External Services

#### Required Services
- **Email**: SendGrid or AWS SES
- **Push**: FCM (Android), APNs (iOS)
- **Queue**: Redis + BullMQ
- **Database**: PostgreSQL
- **File Storage**: S3 (templates, assets)

#### Optional Services
- **Analytics**: Mixpanel/Amplitude
- **Error Tracking**: Sentry
- **SMS**: Twilio (future)
- **Monitoring**: Datadog/New Relic

### 11.2 Third-Party Libraries

#### Backend Libraries
```json
{
  "bullmq": "Queue management",
  "agenda": "Job scheduling",
  "node-pushnotifications": "Unified push interface",
  "@sendgrid/mail": "Email delivery",
  "web-push": "Browser push",
  "handlebars": "Email templates",
  "ioredis": "Redis client",
  "joi": "Preference validation"
}
```

#### Frontend Libraries
```json
{
  "workbox": "Service worker toolkit",
  "@radix-ui/react-toast": "Toast notifications",
  "react-use-websocket": "Real-time updates",
  "react-intersection-observer": "Lazy loading"
}
```

## 12. Risks and Mitigations

### 12.1 Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Notification spam | High | High | Smart bundling, frequency limits, easy opt-out |
| Permission denial | High | High | Progressive request, value explanation, fallbacks |
| Delivery failures | Medium | Medium | Multi-channel, retry logic, monitoring |
| Queue overflow | Medium | Low | Auto-scaling, prioritization, cleanup |
| Token expiration | Low | High | Automatic refresh, re-registration flow |

### 12.2 User Experience Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Notification fatigue | High | High | Customization, smart timing, digests |
| Complex preferences | Medium | Medium | Defaults, presets, simple UI |
| Missing notifications | High | Low | History, multiple channels, confirmation |
| Privacy concerns | Medium | Medium | Clear policy, data control, encryption |

### 12.3 Business Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| High infrastructure cost | Medium | Medium | Efficient batching, caching, limits |
| Regulatory compliance | High | Low | GDPR tools, consent tracking, audits |
| Platform restrictions | Medium | Medium | Platform guidelines, fallbacks |
| Abuse/spam reports | Low | Low | Rate limits, content filtering |

## 13. Success Metrics

### 13.1 Adoption Metrics

#### Target KPIs
- 80% opt-in rate for notifications
- 60% browser, 70% email, 40% push adoption
- 90% keep notifications enabled after 30 days
- 50% customize preferences

### 13.2 Engagement Metrics

#### Channel Performance
- **Browser**: 30% click rate, <5% dismiss
- **Email**: 35% open rate, 15% click rate
- **Push**: 25% open rate, 10% action rate
- **Overall**: <20% snooze rate

### 13.3 Technical Metrics

#### System Performance
- 99.9% delivery success rate
- <2s average delivery time
- <1% failure rate
- <0.1% duplicate delivery

### 13.4 Business Impact

#### Success Indicators
- 30% increase in task completion
- 25% improvement in on-time completion
- 20% increase in daily active users
- 15% reduction in overdue tasks

## 14. Timeline Estimates

### 14.1 Development Phases

#### Phase 1: Foundation (Week 1-2)
- Notification service architecture
- Basic browser notifications
- Preference data model
- Queue infrastructure

#### Phase 2: Email Channel (Week 3-4)
- Email service integration
- Template system
- Unsubscribe handling
- Delivery tracking

#### Phase 3: Mobile Push (Week 5-6)
- FCM/APNs setup
- Token management
- Rich notifications
- Platform-specific features

#### Phase 4: Preference Center (Week 7-8)
- UI components
- Preference management
- Quiet hours
- Channel configuration

#### Phase 5: Advanced Features (Week 9-10)
- Smart bundling
- Notification center
- Webhook support
- Analytics dashboard

#### Phase 6: Polish & Scale (Week 11-12)
- Performance optimization
- Reliability improvements
- Documentation
- Load testing

### 14.2 Resource Requirements

- **Backend Team**: 2 developers (12 weeks)
- **Frontend Team**: 2 developers (10 weeks)
- **Mobile Team**: 1 developer (4 weeks)
- **DevOps**: 1 engineer (6 weeks)
- **QA Team**: 1 tester (8 weeks)
- **Product/UX**: 1 designer (4 weeks)

### 14.3 Milestones

1. **Week 2**: Basic notifications working
2. **Week 4**: Email channel complete
3. **Week 6**: Mobile push ready
4. **Week 8**: Full preference center
5. **Week 10**: All features integrated
6. **Week 12**: Production ready

## 15. Future Enhancements

### Version 2.0 Features
- SMS notifications via Twilio
- Slack/Teams integration
- WhatsApp Business API
- Voice call reminders
- Location-based notifications
- AI-optimized send times
- Advanced automation rules
- Notification templates marketplace
- A/B testing framework
- Cross-app notification sync

### Technical Enhancements
- GraphQL subscriptions
- Edge computing for notifications
- Blockchain notification proof
- Machine learning for preferences
- Natural language commands
- Voice assistant integration
- AR notifications
- Biometric confirmation
- Satellite messaging fallback
- Quantum-resistant encryption

## Appendices

### A. Notification Examples

#### Browser Notification
```javascript
{
  title: "Task Due Soon",
  body: "Complete project report - Due in 1 hour",
  icon: "/icon-192.png",
  badge: "/badge-72.png",
  actions: [
    { action: "complete", title: "Mark Complete" },
    { action: "snooze", title: "Snooze 1hr" }
  ],
  data: { todoId: "123", dueDate: "2024-12-25T10:00:00Z" }
}
```

#### Email Template
```html
Subject: Reminder: Complete project report

Hi {{userName}},

This is a friendly reminder that your task "Complete project report" 
is due in 1 hour (10:00 AM).

[View Task] [Mark Complete] [Snooze]

You have 3 other tasks due today:
- Review pull requests (2:00 PM)
- Team standup meeting (3:00 PM)
- Submit timesheet (5:00 PM)

[View All Tasks]
```

### B. Error Codes

| Code | Description | User Message |
|------|-------------|--------------|
| NOT_001 | Permission denied | Please enable notifications in settings |
| NOT_002 | Channel unavailable | This notification type is temporarily unavailable |
| NOT_003 | Rate limit exceeded | Too many notifications, please try later |
| NOT_004 | Invalid preferences | Your preferences couldn't be saved |
| NOT_005 | Delivery failed | Notification couldn't be delivered |

### C. Webhook Payload

```json
{
  "event": "notification.sent",
  "timestamp": "2024-12-25T10:00:00Z",
  "notification": {
    "id": "550e8400-e29b-41d4",
    "userId": "user123",
    "type": "due_date",
    "title": "Task Due Soon",
    "channels": ["browser", "email"],
    "metadata": {
      "todoId": "todo456",
      "dueDate": "2024-12-25T11:00:00Z"
    }
  }
}
```

### D. Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-07-22 | System | Initial specification |

---

**Document Status**: Draft  
**Next Review**: After stakeholder feedback  
**Approval Required From**: Product Owner, Technical Lead, Security Lead