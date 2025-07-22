# Notifications & Reminders Feature - Architecture Design Document

**Feature**: Multi-Channel Notifications System  
**Version**: 1.0.0  
**Date**: 2025-07-22  
**Status**: Draft  
**Authors**: Architecture Team

## Executive Summary

This document presents the architectural design for the Notifications & Reminders feature of the Simple Todo application. The design extends the basic browser notifications from the due-dates feature into a comprehensive multi-channel notification system supporting browser push, email, mobile push, and in-app notifications. The architecture emphasizes scalability, reliability, and user control while providing intelligent features like smart bundling, quiet hours, and cross-device synchronization.

### Key Design Principles
- **Reliability First**: 99.9% delivery success with fallback mechanisms
- **User Control**: Granular preferences with channel-specific settings
- **Intelligent Delivery**: Smart bundling and timing optimization
- **Scalable Architecture**: Support for 100K+ concurrent users
- **Privacy by Design**: Secure data handling and user consent

### Architecture Highlights
- Microservices-based notification service with queue architecture
- Multi-channel adapters with fallback routing
- Real-time preference synchronization across devices
- Intelligent bundling engine to prevent notification fatigue
- Comprehensive delivery tracking and analytics

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              Client Layer                                │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │  Browser     │  │  Mobile App  │  │  Email       │  │  Webhook   │  │
│  │  (PWA)       │  │  (iOS/Android)│  │  Client      │  │  Consumer  │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └─────┬──────┘  │
│         │                  │                  │                │          │
└─────────┼──────────────────┼──────────────────┼────────────────┼──────────┘
          │                  │                  │                │
          ▼                  ▼                  ▼                ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         API Gateway Layer                                │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  Next.js API Routes  │  WebSocket Server  │  Webhook Endpoints     │ │
│  └────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────┬────────────────────────────────────────┘
                                  │
┌─────────────────────────────────▼────────────────────────────────────────┐
│                    Notification Service Layer                             │
├───────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │                 Central Notification Orchestrator                    │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐ │ │
│  │  │  Scheduling   │  │  Preference  │  │   Delivery Manager       │ │ │
│  │  │  Engine       │  │  Manager     │  │   - Routing Logic        │ │ │
│  │  │  - Cron Jobs  │  │  - User Prefs│  │   - Channel Selection    │ │ │
│  │  │  - Timers     │  │  - Quiet Hrs │  │   - Fallback Strategy    │ │ │
│  │  └──────────────┘  └──────────────┘  └──────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │                    Processing Components                             │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐ │ │
│  │  │  Bundling    │  │  Rate        │  │   Template Engine        │ │ │
│  │  │  Engine      │  │  Limiter     │  │   - Email Templates      │ │ │
│  │  │  - Time Win  │  │  - Per User  │  │   - Push Payloads        │ │ │
│  │  │  - Category  │  │  - Per Chan  │  │   - Personalization      │ │ │
│  │  └──────────────┘  └──────────────┘  └──────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │                      Channel Adapters                                │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌──────────┐  │ │
│  │  │  Browser    │  │   Email     │  │  Mobile     │  │  In-App  │  │ │
│  │  │  Push       │  │   SMTP      │  │  Push       │  │  Toast   │  │ │
│  │  │  - Service  │  │  - SendGrid │  │  - FCM      │  │  - WS    │  │ │
│  │  │    Worker   │  │  - Templates│  │  - APNs     │  │  - Store │  │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └──────────┘  │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────┬──────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼──────────────────────────────────────┐
│                        Infrastructure Layer                               │
├───────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐   │
│  │   BullMQ Queues  │  │   PostgreSQL     │  │    Redis Cache       │   │
│  │   - Priority     │  │   - Notifications│  │    - Sessions        │   │
│  │   - Channels     │  │   - Preferences  │  │    - Rate Limits     │   │
│  │   - DLQ          │  │   - History      │  │    - Temp Data       │   │
│  └──────────────────┘  └──────────────────┘  └──────────────────────┘   │
│                                                                           │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐   │
│  │   External APIs  │  │  Monitoring      │  │   Object Storage     │   │
│  │   - SendGrid     │  │  - Prometheus    │  │   - Email Assets     │   │
│  │   - FCM          │  │  - Grafana       │  │   - Templates        │   │
│  │   - APNs         │  │  - Sentry        │  │   - Attachments      │   │
│  └──────────────────┘  └──────────────────┘  └──────────────────────┘   │
└───────────────────────────────────────────────────────────────────────────┘
```

### Data Flow Architecture

```
User Action → Todo Update → Notification Trigger → Queue → Processing → Delivery
                                      │
                                      ▼
                              Preference Check
                                      │
                                      ▼
                              Channel Selection
                                      │
                                      ▼
                              Template Rendering
                                      │
                                      ▼
                              Delivery Attempt → Success/Retry/Fallback
```

## Component Design

### Component Hierarchy

```
src/features/notifications/
├── components/
│   ├── NotificationCenter/
│   │   ├── NotificationCenter.tsx      # Main notification UI
│   │   ├── NotificationList.tsx        # Scrollable list
│   │   ├── NotificationItem.tsx        # Individual notification
│   │   ├── NotificationFilters.tsx     # Filter controls
│   │   └── NotificationActions.tsx     # Bulk actions
│   ├── PreferenceCenter/
│   │   ├── PreferenceCenter.tsx        # Main preferences UI
│   │   ├── ChannelSettings/
│   │   │   ├── BrowserSettings.tsx     # Browser push config
│   │   │   ├── EmailSettings.tsx       # Email preferences
│   │   │   ├── MobileSettings.tsx      # Push notification config
│   │   │   └── InAppSettings.tsx       # In-app preferences
│   │   ├── TimingSettings/
│   │   │   ├── QuietHours.tsx          # Quiet hours config
│   │   │   ├── DeliveryTiming.tsx      # Default timing
│   │   │   └── TimezoneSelector.tsx    # Timezone settings
│   │   └── CategoryPreferences.tsx     # Per-category settings
│   ├── NotificationBadge.tsx           # Unread count badge
│   ├── NotificationToast.tsx           # In-app toast notifications
│   ├── PermissionPrompt.tsx            # Permission request UI
│   └── NotificationBell.tsx            # Bell icon with state
├── stores/
│   ├── notificationStore.ts            # Notification state
│   ├── preferenceStore.ts              # User preferences
│   ├── channelStore.ts                 # Channel status
│   └── deliveryStore.ts                # Delivery tracking
├── hooks/
│   ├── useNotifications.ts             # Main notification hook
│   ├── usePreferences.ts               # Preference management
│   ├── useChannels.ts                  # Channel operations
│   ├── useNotificationPermission.ts    # Permission handling
│   └── useNotificationSocket.ts        # Real-time updates
├── services/
│   ├── NotificationService.ts          # Core service class
│   ├── adapters/
│   │   ├── BrowserAdapter.ts           # Browser notifications
│   │   ├── EmailAdapter.ts             # Email sending
│   │   ├── PushAdapter.ts              # Mobile push
│   │   └── InAppAdapter.ts             # In-app notifications
│   ├── processing/
│   │   ├── BundlingEngine.ts           # Smart bundling
│   │   ├── RateLimiter.ts              # Rate limiting
│   │   ├── TemplateEngine.ts           # Template processing
│   │   └── DeliveryRouter.ts           # Channel routing
│   └── queue/
│       ├── QueueManager.ts             # BullMQ management
│       ├── JobProcessor.ts             # Job processing
│       └── RetryStrategy.ts            # Retry logic
├── types/
│   ├── notification.types.ts           # Core types
│   ├── preference.types.ts             # Preference interfaces
│   ├── channel.types.ts                # Channel definitions
│   └── delivery.types.ts               # Delivery tracking
├── utils/
│   ├── formatters.ts                   # Notification formatting
│   ├── validators.ts                   # Input validation
│   ├── permissions.ts                  # Permission helpers
│   └── timing.ts                       # Time calculations
├── workers/
│   ├── notification.worker.ts          # Background processing
│   └── service-worker.ts               # Browser push handler
└── templates/
    ├── email/
    │   ├── base.hbs                    # Base email template
    │   ├── reminder.hbs                # Reminder template
    │   ├── digest.hbs                  # Digest template
    │   └── overdue.hbs                 # Overdue alert
    └── push/
        ├── reminder.json               # Reminder payload
        └── digest.json                 # Digest payload
```

### Detailed Component Specifications

#### NotificationService Core
```typescript
interface INotificationService {
  // Core operations
  send(notification: NotificationRequest): Promise<NotificationResult>;
  sendBulk(notifications: NotificationRequest[]): Promise<NotificationResult[]>;
  schedule(notification: ScheduledNotification): Promise<string>;
  cancel(notificationId: string): Promise<boolean>;
  
  // Preference management
  getPreferences(userId: string): Promise<NotificationPreferences>;
  updatePreferences(userId: string, prefs: Partial<NotificationPreferences>): Promise<void>;
  
  // Channel management
  getChannelStatus(userId: string): Promise<ChannelStatus[]>;
  enableChannel(userId: string, channel: NotificationChannel): Promise<void>;
  disableChannel(userId: string, channel: NotificationChannel): Promise<void>;
  
  // History and tracking
  getHistory(userId: string, filters: HistoryFilters): Promise<NotificationHistory>;
  getDeliveryStatus(notificationId: string): Promise<DeliveryStatus>;
  
  // Webhook management
  registerWebhook(webhook: WebhookConfig): Promise<string>;
  updateWebhook(webhookId: string, config: Partial<WebhookConfig>): Promise<void>;
  deleteWebhook(webhookId: string): Promise<void>;
}

class NotificationService implements INotificationService {
  constructor(
    private queueManager: QueueManager,
    private preferenceManager: PreferenceManager,
    private deliveryRouter: DeliveryRouter,
    private bundlingEngine: BundlingEngine,
    private rateLimiter: RateLimiter
  ) {}
  
  async send(request: NotificationRequest): Promise<NotificationResult> {
    // Validate request
    const validation = this.validateRequest(request);
    if (!validation.isValid) {
      throw new ValidationError(validation.errors);
    }
    
    // Check rate limits
    const rateLimitCheck = await this.rateLimiter.check(request.userId);
    if (!rateLimitCheck.allowed) {
      throw new RateLimitError(rateLimitCheck.resetAt);
    }
    
    // Get user preferences
    const preferences = await this.preferenceManager.get(request.userId);
    
    // Check quiet hours
    if (this.isQuietHours(preferences)) {
      return this.queueForLater(request, preferences.quietHours.end);
    }
    
    // Check bundling eligibility
    if (this.bundlingEngine.shouldBundle(request, preferences)) {
      return this.bundlingEngine.addToBundle(request);
    }
    
    // Route to appropriate channels
    const channels = this.deliveryRouter.selectChannels(request, preferences);
    
    // Queue for delivery
    const jobId = await this.queueManager.enqueue({
      type: 'notification',
      payload: request,
      channels,
      priority: request.priority || 'normal',
    });
    
    return {
      id: jobId,
      status: 'queued',
      channels,
      scheduledFor: new Date(),
    };
  }
  
  // ... other implementations
}
```

#### Channel Adapter Interface
```typescript
interface IChannelAdapter {
  name: NotificationChannel;
  
  // Capabilities
  isAvailable(userId: string): Promise<boolean>;
  requestPermission?(userId: string): Promise<boolean>;
  getCapabilities(): ChannelCapabilities;
  
  // Delivery
  send(notification: ChannelNotification): Promise<DeliveryResult>;
  sendBatch(notifications: ChannelNotification[]): Promise<DeliveryResult[]>;
  
  // Configuration
  configure(config: ChannelConfig): void;
  validateConfig(): ValidationResult;
  
  // Tracking
  trackDelivery(notificationId: string, result: DeliveryResult): Promise<void>;
  getDeliveryStatus(notificationId: string): Promise<DeliveryStatus>;
}

interface ChannelCapabilities {
  supportsBatch: boolean;
  supportsScheduling: boolean;
  supportsActions: boolean;
  supportsImages: boolean;
  supportsTemplates: boolean;
  maxPayloadSize: number;
  rateLimit?: RateLimit;
}
```

#### Browser Push Adapter
```typescript
class BrowserPushAdapter implements IChannelAdapter {
  name = NotificationChannel.BROWSER_PUSH;
  
  async isAvailable(userId: string): Promise<boolean> {
    // Check if service worker registered
    const registration = await this.getServiceWorkerRegistration();
    if (!registration) return false;
    
    // Check permission status
    const permission = await this.getPermissionStatus(userId);
    return permission === 'granted';
  }
  
  async send(notification: ChannelNotification): Promise<DeliveryResult> {
    try {
      // Get push subscription
      const subscription = await this.getPushSubscription(notification.userId);
      if (!subscription) {
        return {
          success: false,
          error: 'No push subscription found',
          channel: this.name,
        };
      }
      
      // Send via web push
      const payload = this.formatPayload(notification);
      await webpush.sendNotification(subscription, JSON.stringify(payload));
      
      return {
        success: true,
        channel: this.name,
        deliveredAt: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        channel: this.name,
      };
    }
  }
  
  private formatPayload(notification: ChannelNotification): PushPayload {
    return {
      title: notification.title,
      body: notification.body,
      icon: '/icon-192.png',
      badge: '/badge-72.png',
      tag: notification.id,
      data: {
        notificationId: notification.id,
        todoId: notification.metadata?.todoId,
        url: notification.metadata?.url,
      },
      actions: notification.actions?.map(action => ({
        action: action.id,
        title: action.label,
        icon: action.icon,
      })),
      requireInteraction: notification.priority === 'high',
    };
  }
}
```

#### Email Adapter
```typescript
class EmailAdapter implements IChannelAdapter {
  name = NotificationChannel.EMAIL;
  private sendgrid: SendGridService;
  private templateEngine: TemplateEngine;
  
  async send(notification: ChannelNotification): Promise<DeliveryResult> {
    try {
      // Render template
      const html = await this.templateEngine.render(
        notification.template || 'default',
        {
          user: notification.user,
          notification: notification.data,
          actionUrl: this.generateActionUrl(notification),
          unsubscribeUrl: this.generateUnsubscribeUrl(notification.userId),
        }
      );
      
      // Send email
      const result = await this.sendgrid.send({
        to: notification.user.email,
        from: {
          email: 'notifications@simpletodo.app',
          name: 'Simple Todo',
        },
        subject: notification.title,
        html,
        text: this.generatePlainText(html),
        trackingSettings: {
          clickTracking: { enable: true },
          openTracking: { enable: true },
        },
        customArgs: {
          notificationId: notification.id,
          userId: notification.userId,
        },
      });
      
      return {
        success: true,
        channel: this.name,
        deliveredAt: new Date(),
        messageId: result.messageId,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        channel: this.name,
      };
    }
  }
  
  async sendBatch(notifications: ChannelNotification[]): Promise<DeliveryResult[]> {
    // SendGrid supports batch sending
    const personalizations = await Promise.all(
      notifications.map(async (notification) => ({
        to: [{ email: notification.user.email }],
        subject: notification.title,
        dynamicTemplateData: {
          user: notification.user,
          notification: notification.data,
        },
        customArgs: {
          notificationId: notification.id,
        },
      }))
    );
    
    try {
      const result = await this.sendgrid.send({
        personalizations,
        from: {
          email: 'notifications@simpletodo.app',
          name: 'Simple Todo',
        },
        templateId: 'd-reminder-template-id',
      });
      
      return notifications.map((_, index) => ({
        success: true,
        channel: this.name,
        deliveredAt: new Date(),
        messageId: result.messageIds[index],
      }));
    } catch (error) {
      return notifications.map(() => ({
        success: false,
        error: error.message,
        channel: this.name,
      }));
    }
  }
}
```

#### Bundling Engine
```typescript
interface BundlingRule {
  category: NotificationCategory;
  windowMinutes: number;
  maxItems: number;
  priority: NotificationPriority;
}

class BundlingEngine {
  private bundles: Map<string, NotificationBundle> = new Map();
  
  shouldBundle(
    notification: NotificationRequest,
    preferences: NotificationPreferences
  ): boolean {
    // Don't bundle high priority
    if (notification.priority === 'high') return false;
    
    // Check user preferences
    if (!preferences.bundling.enabled) return false;
    
    // Check category rules
    const rule = this.getBundlingRule(notification.category, preferences);
    return rule !== null;
  }
  
  async addToBundle(notification: NotificationRequest): Promise<NotificationResult> {
    const bundleKey = this.generateBundleKey(notification);
    let bundle = this.bundles.get(bundleKey);
    
    if (!bundle) {
      bundle = {
        id: generateId(),
        userId: notification.userId,
        category: notification.category,
        notifications: [],
        createdAt: new Date(),
        scheduledFor: this.calculateBundleTime(notification),
      };
      this.bundles.set(bundleKey, bundle);
      
      // Schedule bundle delivery
      await this.scheduleBundleDelivery(bundle);
    }
    
    bundle.notifications.push(notification);
    
    return {
      id: bundle.id,
      status: 'bundled',
      bundleId: bundle.id,
      scheduledFor: bundle.scheduledFor,
    };
  }
  
  private async scheduleBundleDelivery(bundle: NotificationBundle): Promise<void> {
    const delay = bundle.scheduledFor.getTime() - Date.now();
    
    setTimeout(async () => {
      await this.deliverBundle(bundle);
      this.bundles.delete(bundle.id);
    }, delay);
  }
  
  private async deliverBundle(bundle: NotificationBundle): Promise<void> {
    const summary = this.generateBundleSummary(bundle);
    
    await this.notificationService.send({
      userId: bundle.userId,
      category: bundle.category,
      priority: 'normal',
      title: summary.title,
      body: summary.body,
      data: {
        bundleId: bundle.id,
        notifications: bundle.notifications,
      },
      actions: [
        { id: 'view-all', label: 'View All' },
        { id: 'dismiss', label: 'Dismiss' },
      ],
    });
  }
  
  private generateBundleSummary(bundle: NotificationBundle): BundleSummary {
    const count = bundle.notifications.length;
    const category = bundle.category;
    
    switch (category) {
      case 'due-reminder':
        return {
          title: `${count} tasks due soon`,
          body: this.summarizeDueTasks(bundle.notifications),
        };
      
      case 'overdue':
        return {
          title: `${count} overdue tasks`,
          body: 'You have tasks that need attention',
        };
      
      default:
        return {
          title: `${count} notifications`,
          body: 'Tap to view all',
        };
    }
  }
}
```

## Data Architecture

### Data Models

#### Core Notification Model
```typescript
interface Notification {
  id: string;
  userId: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  
  // Content
  title: string;
  body: string;
  imageUrl?: string;
  data?: Record<string, any>;
  
  // Metadata
  todoId?: string;
  bundleId?: string;
  parentId?: string;  // For threaded notifications
  
  // Status
  status: NotificationStatus;
  read: boolean;
  archived: boolean;
  
  // Timestamps
  createdAt: Date;
  scheduledFor?: Date;
  sentAt?: Date;
  readAt?: Date;
  
  // Actions
  actions?: NotificationAction[];
  deepLink?: string;
}

type NotificationCategory = 
  | 'due-reminder'
  | 'overdue'
  | 'recurring'
  | 'completed'
  | 'assigned'
  | 'comment'
  | 'system';

type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

type NotificationStatus = 
  | 'pending'
  | 'queued'
  | 'sending'
  | 'sent'
  | 'delivered'
  | 'failed'
  | 'cancelled';

interface NotificationAction {
  id: string;
  label: string;
  icon?: string;
  style?: 'default' | 'primary' | 'danger';
  url?: string;
}
```

#### User Preferences Model
```typescript
interface NotificationPreferences {
  // Global settings
  enabled: boolean;
  muteUntil?: Date;
  
  // Quiet hours
  quietHours: {
    enabled: boolean;
    start: string;      // HH:MM
    end: string;        // HH:MM
    weekends: boolean;
    timezone: string;
  };
  
  // Channel preferences
  channels: {
    [K in NotificationChannel]: ChannelPreference;
  };
  
  // Category preferences
  categories: {
    [K in NotificationCategory]: CategoryPreference;
  };
  
  // Bundling rules
  bundling: {
    enabled: boolean;
    windowMinutes: number;
    maxItems: number;
    excludeCategories: NotificationCategory[];
  };
  
  // Digest settings
  digest: {
    daily: DigestSettings;
    weekly: DigestSettings;
  };
  
  // Advanced
  duplicateWindow: number;  // Minutes to consider duplicate
  maxPerDay: number;
  language: string;
}

interface ChannelPreference {
  enabled: boolean;
  priority: number;  // Channel priority order
  settings?: Record<string, any>;
}

interface CategoryPreference {
  enabled: boolean;
  channels: NotificationChannel[];
  timing?: RelativeTime;
  bundleable: boolean;
}
```

#### Delivery Tracking Model
```typescript
interface DeliveryAttempt {
  id: string;
  notificationId: string;
  channel: NotificationChannel;
  attemptNumber: number;
  
  // Status
  status: 'pending' | 'success' | 'failed';
  error?: string;
  
  // Timestamps
  attemptedAt: Date;
  completedAt?: Date;
  
  // Response data
  response?: {
    messageId?: string;
    statusCode?: number;
    headers?: Record<string, string>;
  };
}

interface NotificationDelivery {
  notificationId: string;
  userId: string;
  
  // Overall status
  status: DeliveryStatus;
  
  // Channel attempts
  attempts: DeliveryAttempt[];
  
  // Tracking
  sentAt?: Date;
  deliveredAt?: Date;
  openedAt?: Date;
  clickedAt?: Date;
  
  // Engagement
  actions: {
    actionId: string;
    performedAt: Date;
  }[];
}
```

### Database Schema

```sql
-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  category VARCHAR(50) NOT NULL,
  priority VARCHAR(20) NOT NULL DEFAULT 'normal',
  
  -- Content
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  image_url TEXT,
  data JSONB DEFAULT '{}',
  
  -- Metadata
  todo_id UUID REFERENCES todos(id),
  bundle_id UUID,
  parent_id UUID REFERENCES notifications(id),
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  read BOOLEAN DEFAULT FALSE,
  archived BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  
  -- Actions
  actions JSONB DEFAULT '[]',
  deep_link TEXT,
  
  -- Indexes
  INDEX idx_user_status (user_id, status),
  INDEX idx_scheduled (scheduled_for) WHERE status = 'pending',
  INDEX idx_bundle (bundle_id),
  INDEX idx_created (created_at DESC)
);

-- Delivery tracking
CREATE TABLE notification_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID NOT NULL REFERENCES notifications(id),
  channel VARCHAR(50) NOT NULL,
  attempt_number INTEGER NOT NULL DEFAULT 1,
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  error TEXT,
  
  -- Timestamps
  attempted_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  -- Response
  response JSONB,
  
  -- Tracking
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  
  -- Indexes
  UNIQUE (notification_id, channel, attempt_number),
  INDEX idx_status (status),
  INDEX idx_attempted (attempted_at)
);

-- User preferences
CREATE TABLE notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  
  -- Settings
  enabled BOOLEAN DEFAULT TRUE,
  mute_until TIMESTAMPTZ,
  
  -- JSON preferences
  quiet_hours JSONB DEFAULT '{"enabled": false}',
  channels JSONB DEFAULT '{}',
  categories JSONB DEFAULT '{}',
  bundling JSONB DEFAULT '{"enabled": true, "windowMinutes": 15}',
  digest JSONB DEFAULT '{}',
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Push subscriptions
CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  channel VARCHAR(50) NOT NULL,
  
  -- Subscription data
  endpoint TEXT NOT NULL,
  keys JSONB NOT NULL,
  
  -- Device info
  device_info JSONB,
  
  -- Status
  active BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  
  -- Indexes
  INDEX idx_user_channel (user_id, channel),
  UNIQUE (endpoint)
);

-- Webhooks
CREATE TABLE notification_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  
  -- Configuration
  url TEXT NOT NULL,
  secret TEXT NOT NULL,
  events TEXT[] NOT NULL,
  
  -- Settings
  active BOOLEAN DEFAULT TRUE,
  retry_count INTEGER DEFAULT 3,
  timeout_ms INTEGER DEFAULT 5000,
  
  -- Stats
  last_triggered_at TIMESTAMPTZ,
  failure_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_user (user_id),
  INDEX idx_active (active)
);

-- Notification templates
CREATE TABLE notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL,
  
  -- Template content
  title_template TEXT NOT NULL,
  body_template TEXT NOT NULL,
  
  -- Channel-specific templates
  email_template TEXT,
  push_template JSONB,
  
  -- Metadata
  variables JSONB DEFAULT '[]',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### State Management

#### Notification Store
```typescript
interface NotificationStore {
  // State
  notifications: Notification[];
  unreadCount: number;
  filter: NotificationFilter;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchNotifications: (filter?: NotificationFilter) => Promise<void>;
  markAsRead: (ids: string[]) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  archive: (ids: string[]) => Promise<void>;
  deleteNotifications: (ids: string[]) => Promise<void>;
  
  // Real-time
  addNotification: (notification: Notification) => void;
  updateNotification: (id: string, updates: Partial<Notification>) => void;
  
  // Filters
  setFilter: (filter: NotificationFilter) => void;
  getFilteredNotifications: () => Notification[];
}

export const useNotificationStore = create<NotificationStore>()(
  subscribeWithSelector(
    persist(
      immer((set, get) => ({
        notifications: [],
        unreadCount: 0,
        filter: { status: 'all' },
        isLoading: false,
        error: null,
        
        fetchNotifications: async (filter) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await notificationAPI.getNotifications(filter);
            set({
              notifications: response.data,
              unreadCount: response.data.filter(n => !n.read).length,
              isLoading: false,
            });
          } catch (error) {
            set({ error: error.message, isLoading: false });
          }
        },
        
        markAsRead: async (ids) => {
          // Optimistic update
          set((state) => {
            ids.forEach(id => {
              const notification = state.notifications.find(n => n.id === id);
              if (notification && !notification.read) {
                notification.read = true;
                notification.readAt = new Date();
                state.unreadCount--;
              }
            });
          });
          
          try {
            await notificationAPI.markAsRead(ids);
          } catch (error) {
            // Revert on error
            get().fetchNotifications();
          }
        },
        
        // ... other implementations
      })),
      {
        name: 'notification-storage',
        partialize: (state) => ({
          filter: state.filter,
        }),
      }
    )
  )
);
```

#### Preference Store
```typescript
interface PreferenceStore {
  preferences: NotificationPreferences | null;
  isLoading: boolean;
  isDirty: boolean;
  
  // Actions
  loadPreferences: () => Promise<void>;
  updatePreferences: (updates: DeepPartial<NotificationPreferences>) => void;
  savePreferences: () => Promise<void>;
  resetToDefaults: () => void;
  
  // Channel management
  toggleChannel: (channel: NotificationChannel) => void;
  updateChannelSettings: (channel: NotificationChannel, settings: any) => void;
  
  // Quick actions
  muteTemporarily: (hours: number) => void;
  toggleQuietHours: () => void;
  
  // Test notifications
  sendTestNotification: (channel: NotificationChannel) => Promise<void>;
}
```

## API Specifications

### REST API Endpoints

#### Notification Endpoints
```typescript
// Core notification operations
GET    /api/notifications              // List notifications
GET    /api/notifications/:id          // Get single notification
POST   /api/notifications              // Create notification (internal)
PUT    /api/notifications/:id          // Update notification
DELETE /api/notifications/:id          // Delete notification

// Bulk operations
POST   /api/notifications/mark-read    // Mark multiple as read
POST   /api/notifications/mark-unread  // Mark multiple as unread
POST   /api/notifications/archive      // Archive multiple
DELETE /api/notifications/bulk         // Delete multiple

// Actions
POST   /api/notifications/:id/read     // Mark single as read
POST   /api/notifications/:id/unread   // Mark single as unread
POST   /api/notifications/:id/archive  // Archive single
POST   /api/notifications/:id/snooze   // Snooze notification

// Preferences
GET    /api/notifications/preferences  // Get user preferences
PUT    /api/notifications/preferences  // Update preferences
POST   /api/notifications/preferences/reset // Reset to defaults

// Channels
GET    /api/notifications/channels     // Get channel status
POST   /api/notifications/channels/:channel/enable  // Enable channel
POST   /api/notifications/channels/:channel/disable // Disable channel
POST   /api/notifications/channels/:channel/test    // Send test

// Subscriptions
POST   /api/notifications/subscribe    // Subscribe to push
DELETE /api/notifications/unsubscribe  // Unsubscribe from push
GET    /api/notifications/subscription // Get subscription status

// Webhooks
GET    /api/notifications/webhooks     // List webhooks
POST   /api/notifications/webhooks     // Create webhook
PUT    /api/notifications/webhooks/:id // Update webhook
DELETE /api/notifications/webhooks/:id // Delete webhook
POST   /api/notifications/webhooks/:id/test // Test webhook

// Analytics
GET    /api/notifications/stats        // Get notification stats
GET    /api/notifications/engagement   // Get engagement metrics
```

### WebSocket Events

#### Server → Client Events
```typescript
// Real-time notification events
interface NotificationEvents {
  'notification:new': {
    notification: Notification;
  };
  
  'notification:update': {
    id: string;
    updates: Partial<Notification>;
  };
  
  'notification:delete': {
    id: string;
  };
  
  'notification:bulk-update': {
    ids: string[];
    updates: Partial<Notification>;
  };
  
  'preferences:update': {
    preferences: NotificationPreferences;
  };
  
  'channel:status': {
    channel: NotificationChannel;
    status: ChannelStatus;
  };
}

// Client connection
const socket = io('/notifications', {
  auth: {
    token: authToken,
  },
});

socket.on('notification:new', (data) => {
  notificationStore.addNotification(data.notification);
  
  // Show in-app toast if enabled
  if (shouldShowToast(data.notification)) {
    showNotificationToast(data.notification);
  }
});
```

#### Client → Server Events
```typescript
// Client-initiated events
socket.emit('notification:subscribe', {
  userId: currentUser.id,
  channels: ['browser', 'email'],
});

socket.emit('notification:mark-read', {
  notificationIds: ['id1', 'id2'],
});

socket.emit('preferences:update', {
  preferences: updatedPreferences,
});
```

### Webhook API

```typescript
// Webhook payload
interface WebhookPayload {
  event: WebhookEvent;
  timestamp: string;
  data: {
    notification: Notification;
    delivery?: DeliveryStatus;
    user?: User;
  };
  signature: string;  // HMAC-SHA256
}

type WebhookEvent = 
  | 'notification.created'
  | 'notification.sent'
  | 'notification.delivered'
  | 'notification.failed'
  | 'notification.opened'
  | 'notification.clicked'
  | 'notification.action';

// Webhook verification
const verifyWebhook = (payload: string, signature: string, secret: string): boolean => {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
};
```

## Security Design

### Authentication & Authorization

#### Permission Model
```typescript
interface NotificationPermissions {
  // User permissions
  canReceiveNotifications: boolean;
  canManagePreferences: boolean;
  canViewHistory: boolean;
  canManageWebhooks: boolean;
  
  // Channel permissions
  channels: {
    [K in NotificationChannel]: {
      enabled: boolean;
      permissionGranted: boolean;
      requiresVerification: boolean;
    };
  };
}

// Permission checking
class PermissionManager {
  async checkPermission(
    userId: string,
    action: NotificationAction,
    resource?: string
  ): Promise<boolean> {
    // Get user permissions
    const permissions = await this.getUserPermissions(userId);
    
    switch (action) {
      case 'receive':
        return permissions.canReceiveNotifications;
      
      case 'update-preferences':
        return permissions.canManagePreferences;
      
      case 'view-notification':
        if (!resource) return false;
        return await this.isNotificationOwner(userId, resource);
      
      case 'create-webhook':
        return permissions.canManageWebhooks;
      
      default:
        return false;
    }
  }
}
```

#### Data Encryption
```typescript
// Sensitive data encryption
class NotificationEncryption {
  private algorithm = 'aes-256-gcm';
  private keyDerivation = 'pbkdf2';
  
  async encryptSensitiveData(data: any): Promise<EncryptedData> {
    const key = await this.deriveKey();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, key, iv);
    
    const encrypted = Buffer.concat([
      cipher.update(JSON.stringify(data), 'utf8'),
      cipher.final(),
    ]);
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted: encrypted.toString('base64'),
      iv: iv.toString('base64'),
      authTag: authTag.toString('base64'),
    };
  }
  
  async decryptSensitiveData(encryptedData: EncryptedData): Promise<any> {
    const key = await this.deriveKey();
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      key,
      Buffer.from(encryptedData.iv, 'base64')
    );
    
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'base64'));
    
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedData.encrypted, 'base64')),
      decipher.final(),
    ]);
    
    return JSON.parse(decrypted.toString('utf8'));
  }
}
```

### Privacy & Compliance

#### Data Minimization
```typescript
// Only store necessary data
interface PrivacyCompliantNotification {
  id: string;
  userId: string;  // Hashed
  category: NotificationCategory;
  
  // Content (encrypted if contains PII)
  title: string;
  body: string;  // Sanitized
  
  // No PII in metadata
  metadata: {
    todoId?: string;
    timestamp: number;
  };
  
  // Retention
  expiresAt: Date;
}

// Automatic data cleanup
class DataRetentionService {
  async cleanupExpiredData(): Promise<void> {
    // Delete old notifications
    await db.notifications.deleteMany({
      where: {
        OR: [
          { expiresAt: { lte: new Date() } },
          { createdAt: { lte: subDays(new Date(), 90) } },
        ],
      },
    });
    
    // Anonymize old delivery logs
    await db.deliveryLogs.updateMany({
      where: {
        createdAt: { lte: subDays(new Date(), 30) },
      },
      data: {
        userId: null,
        ipAddress: null,
        userAgent: 'REDACTED',
      },
    });
  }
}
```

#### GDPR Compliance
```typescript
// Data export
class NotificationDataExport {
  async exportUserData(userId: string): Promise<UserDataExport> {
    const [notifications, preferences, subscriptions, webhooks] = await Promise.all([
      this.getNotifications(userId),
      this.getPreferences(userId),
      this.getSubscriptions(userId),
      this.getWebhooks(userId),
    ]);
    
    return {
      exportDate: new Date(),
      userData: {
        notifications: notifications.map(this.sanitizeNotification),
        preferences: this.sanitizePreferences(preferences),
        subscriptions: subscriptions.map(this.sanitizeSubscription),
        webhooks: webhooks.map(this.sanitizeWebhook),
      },
    };
  }
  
  async deleteUserData(userId: string): Promise<void> {
    await db.$transaction([
      db.notifications.deleteMany({ where: { userId } }),
      db.notificationPreferences.delete({ where: { userId } }),
      db.pushSubscriptions.deleteMany({ where: { userId } }),
      db.notificationWebhooks.deleteMany({ where: { userId } }),
      db.notificationDeliveries.deleteMany({ where: { userId } }),
    ]);
  }
}
```

## Performance & Scalability

### Queue Architecture

#### BullMQ Configuration
```typescript
// Queue setup
const queueConfig: QueueOptions = {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
};

// Priority queues
const queues = {
  urgent: new Queue('notifications-urgent', queueConfig),
  high: new Queue('notifications-high', queueConfig),
  normal: new Queue('notifications-normal', queueConfig),
  low: new Queue('notifications-low', queueConfig),
  bulk: new Queue('notifications-bulk', queueConfig),
};

// Worker configuration
const workerConfig: WorkerOptions = {
  connection: redisConnection,
  concurrency: 50,
  limiter: {
    max: 1000,
    duration: 60000,  // per minute
  },
};

// Dedicated workers per priority
const workers = {
  urgent: new Worker('notifications-urgent', processUrgentNotification, {
    ...workerConfig,
    concurrency: 100,  // Higher concurrency for urgent
  }),
  high: new Worker('notifications-high', processHighNotification, workerConfig),
  normal: new Worker('notifications-normal', processNormalNotification, workerConfig),
  low: new Worker('notifications-low', processLowNotification, {
    ...workerConfig,
    concurrency: 20,  // Lower concurrency for low priority
  }),
};
```

#### Job Processing
```typescript
async function processNotificationJob(job: Job<NotificationJob>): Promise<void> {
  const { notification, channels } = job.data;
  
  // Update status
  await updateNotificationStatus(notification.id, 'sending');
  
  // Process each channel
  const results = await Promise.allSettled(
    channels.map(channel => 
      deliverToChannel(notification, channel)
    )
  );
  
  // Handle results
  const successful = results.filter(r => r.status === 'fulfilled');
  const failed = results.filter(r => r.status === 'rejected');
  
  if (successful.length === 0) {
    // All channels failed - retry or fallback
    throw new Error('All delivery channels failed');
  }
  
  // Update final status
  await updateNotificationStatus(
    notification.id,
    failed.length > 0 ? 'partial' : 'delivered'
  );
  
  // Track metrics
  await trackDeliveryMetrics(notification, results);
}
```

### Caching Strategy

#### Redis Cache Layers
```typescript
class NotificationCache {
  private redis: Redis;
  private ttl = {
    preferences: 3600,      // 1 hour
    channels: 1800,         // 30 minutes
    templates: 86400,       // 24 hours
    rateLimits: 60,         // 1 minute
  };
  
  // User preferences cache
  async getPreferences(userId: string): Promise<NotificationPreferences | null> {
    const key = `prefs:${userId}`;
    const cached = await this.redis.get(key);
    
    if (cached) {
      return JSON.parse(cached);
    }
    
    const preferences = await db.notificationPreferences.findUnique({
      where: { userId },
    });
    
    if (preferences) {
      await this.redis.setex(
        key,
        this.ttl.preferences,
        JSON.stringify(preferences)
      );
    }
    
    return preferences;
  }
  
  // Channel status cache
  async getChannelStatus(userId: string): Promise<ChannelStatus[]> {
    const key = `channels:${userId}`;
    const cached = await this.redis.get(key);
    
    if (cached) {
      return JSON.parse(cached);
    }
    
    const status = await this.calculateChannelStatus(userId);
    
    await this.redis.setex(
      key,
      this.ttl.channels,
      JSON.stringify(status)
    );
    
    return status;
  }
  
  // Invalidation
  async invalidateUserCache(userId: string): Promise<void> {
    const keys = [
      `prefs:${userId}`,
      `channels:${userId}`,
      `rate:${userId}`,
    ];
    
    await this.redis.del(...keys);
  }
}
```

### Scaling Strategies

#### Horizontal Scaling
```typescript
// Load balancing notification workers
class NotificationLoadBalancer {
  private workers: NotificationWorker[] = [];
  private currentIndex = 0;
  
  async distributeLoad(): Promise<void> {
    const workerCount = process.env.WORKER_COUNT || os.cpus().length;
    
    // Spawn workers
    for (let i = 0; i < workerCount; i++) {
      const worker = new NotificationWorker({
        id: `worker-${i}`,
        queues: this.assignQueues(i, workerCount),
      });
      
      this.workers.push(worker);
    }
    
    // Health monitoring
    setInterval(() => {
      this.checkWorkerHealth();
    }, 30000);
  }
  
  private assignQueues(workerIndex: number, totalWorkers: number): string[] {
    // Distribute queues across workers
    const allQueues = ['urgent', 'high', 'normal', 'low', 'bulk'];
    return allQueues.filter((_, index) => index % totalWorkers === workerIndex);
  }
  
  private async checkWorkerHealth(): Promise<void> {
    for (const worker of this.workers) {
      if (!worker.isHealthy()) {
        await this.restartWorker(worker);
      }
    }
  }
}
```

#### Rate Limiting
```typescript
class NotificationRateLimiter {
  private limits = {
    global: { points: 10000, duration: 60 },    // Per minute
    perUser: { points: 100, duration: 3600 },   // Per hour
    perChannel: { points: 50, duration: 3600 },  // Per hour per channel
  };
  
  async checkLimit(
    userId: string,
    channel: NotificationChannel
  ): Promise<RateLimitResult> {
    const checks = await Promise.all([
      this.checkGlobalLimit(),
      this.checkUserLimit(userId),
      this.checkChannelLimit(userId, channel),
    ]);
    
    const blocked = checks.find(c => !c.allowed);
    
    if (blocked) {
      return blocked;
    }
    
    // Consume points
    await Promise.all([
      this.consumeGlobal(),
      this.consumeUser(userId),
      this.consumeChannel(userId, channel),
    ]);
    
    return { allowed: true };
  }
  
  private async checkUserLimit(userId: string): Promise<RateLimitResult> {
    const key = `rate:user:${userId}`;
    const limiter = new RateLimiterRedis({
      storeClient: this.redis,
      keyPrefix: key,
      points: this.limits.perUser.points,
      duration: this.limits.perUser.duration,
    });
    
    try {
      const result = await limiter.get(userId);
      const allowed = result ? result.remainingPoints > 0 : true;
      
      return {
        allowed,
        remaining: result?.remainingPoints || this.limits.perUser.points,
        resetAt: new Date(Date.now() + (result?.msBeforeNext || 0)),
      };
    } catch (error) {
      // Allow on error
      return { allowed: true };
    }
  }
}
```

## Integration Architecture

### Integration with Existing Features

#### Due Dates Integration
```typescript
// Extend due dates reminder system
class DueDateNotificationIntegration {
  constructor(
    private notificationService: NotificationService,
    private dueDateService: DueDateService
  ) {
    // Listen for due date events
    dueDateEventBus.on('reminder:scheduled', this.handleReminderScheduled.bind(this));
    dueDateEventBus.on('todo:overdue', this.handleOverdue.bind(this));
  }
  
  private async handleReminderScheduled(event: ReminderScheduledEvent): Promise<void> {
    const { todoId, reminderTime, userId } = event;
    
    await this.notificationService.schedule({
      userId,
      category: 'due-reminder',
      priority: 'normal',
      title: 'Task Due Soon',
      todoId,
      scheduledFor: reminderTime,
      channels: ['browser', 'email'],  // Multi-channel instead of just browser
    });
  }
  
  private async handleOverdue(event: OverdueEvent): Promise<void> {
    const { todoId, userId, daysOverdue } = event;
    
    // Escalate priority based on how overdue
    const priority = daysOverdue > 3 ? 'high' : 'normal';
    
    await this.notificationService.send({
      userId,
      category: 'overdue',
      priority,
      title: `Task ${daysOverdue} days overdue`,
      todoId,
      channels: ['browser', 'email', 'push'],  // All channels for overdue
    });
  }
}
```

#### Cross-Feature Event System
```typescript
// Notification event bus
class NotificationEventBus extends EventTarget {
  // Emit notification events
  emitNotificationSent(notification: Notification): void {
    this.dispatchEvent(new CustomEvent('notification:sent', {
      detail: { notification },
    }));
  }
  
  emitNotificationDelivered(
    notificationId: string,
    channel: NotificationChannel,
    result: DeliveryResult
  ): void {
    this.dispatchEvent(new CustomEvent('notification:delivered', {
      detail: { notificationId, channel, result },
    }));
  }
  
  emitPreferencesUpdated(userId: string, preferences: NotificationPreferences): void {
    this.dispatchEvent(new CustomEvent('preferences:updated', {
      detail: { userId, preferences },
    }));
  }
}

// Other features can listen
notificationEventBus.addEventListener('notification:delivered', (event) => {
  // Analytics tracking
  analytics.track('notification_delivered', {
    category: event.detail.notification.category,
    channel: event.detail.channel,
    deliveryTime: event.detail.result.deliveryTime,
  });
});
```

### Third-Party Integrations

#### Webhook System
```typescript
class WebhookManager {
  private queue: Queue;
  
  async triggerWebhook(webhook: Webhook, event: WebhookEvent, data: any): Promise<void> {
    // Queue webhook delivery
    await this.queue.add('webhook-delivery', {
      webhookId: webhook.id,
      url: webhook.url,
      event,
      payload: this.buildPayload(event, data),
      retryCount: 0,
    });
  }
  
  private buildPayload(event: WebhookEvent, data: any): WebhookPayload {
    const payload = {
      event,
      timestamp: new Date().toISOString(),
      data,
    };
    
    return {
      ...payload,
      signature: this.signPayload(payload),
    };
  }
  
  private signPayload(payload: any): string {
    return crypto
      .createHmac('sha256', process.env.WEBHOOK_SECRET!)
      .update(JSON.stringify(payload))
      .digest('hex');
  }
}

// Webhook processor
async function processWebhook(job: Job<WebhookJob>): Promise<void> {
  const { webhookId, url, payload, retryCount } = job.data;
  
  try {
    const response = await axios.post(url, payload, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': payload.signature,
      },
    });
    
    // Log success
    await logWebhookDelivery(webhookId, 'success', response.status);
  } catch (error) {
    // Handle failure
    if (retryCount < 3) {
      // Retry with exponential backoff
      throw error;  // BullMQ will retry
    } else {
      // Max retries reached
      await logWebhookDelivery(webhookId, 'failed', error.response?.status);
      await disableFailingWebhook(webhookId);
    }
  }
}
```

## Technology Stack

### Core Technologies

| Technology | Version | Purpose | Justification |
|-----------|---------|---------|---------------|
| **BullMQ** | 5.1.0 | Queue management | Reliable, Redis-based, priority queues |
| **Redis** | 7.2 | Cache & queues | Performance, pub/sub, persistence |
| **PostgreSQL** | 15 | Primary database | ACID compliance, JSON support |
| **Socket.io** | 4.6 | Real-time updates | WebSocket with fallbacks |
| **SendGrid** | 8.1.0 | Email delivery | Reliability, templates, analytics |

### Notification Services

| Service | Purpose | Justification |
|---------|---------|---------------|
| **Firebase Cloud Messaging** | Android push | Google's official solution |
| **Apple Push Notification** | iOS push | Apple's requirement |
| **Web Push** | Browser notifications | W3C standard |
| **SendGrid** | Email delivery | High deliverability |

### Supporting Libraries

```json
{
  "dependencies": {
    // Queue & background jobs
    "bullmq": "^5.1.0",
    "ioredis": "^5.3.0",
    
    // Real-time
    "socket.io": "^4.6.0",
    "socket.io-client": "^4.6.0",
    
    // Email
    "@sendgrid/mail": "^8.1.0",
    "handlebars": "^4.7.0",
    "mjml": "^4.14.0",
    
    // Push notifications
    "web-push": "^3.6.0",
    "firebase-admin": "^12.0.0",
    "@parse/node-apn": "^6.0.0",
    
    // Security
    "helmet": "^7.0.0",
    "rate-limiter-flexible": "^3.0.0",
    
    // Monitoring
    "@sentry/node": "^7.0.0",
    "prom-client": "^15.0.0"
  }
}
```

## Design Decisions

### Key Architectural Decisions

#### 1. Queue-Based Architecture
**Decision**: Use BullMQ for all notification processing

**Rationale**:
- Reliable delivery with retries
- Priority queue support
- Distributed processing capability
- Built-in rate limiting
- Dead letter queue for failed jobs

**Trade-offs**:
- Additional infrastructure (Redis)
- Slight delivery delay
- Complexity in job management

#### 2. Multi-Channel with Fallbacks
**Decision**: Support multiple channels with automatic fallback

**Rationale**:
- Higher delivery success rate
- User preference flexibility
- Channel-specific optimizations
- Graceful degradation

**Trade-offs**:
- Complex routing logic
- Higher costs (multiple services)
- Synchronization challenges

#### 3. Separate Preference Service
**Decision**: Dedicated preference management system

**Rationale**:
- Fine-grained control
- Performance (caching)
- Cross-device sync
- A/B testing capability

**Trade-offs**:
- Additional complexity
- Storage requirements
- Sync latency

#### 4. Real-Time Updates via WebSocket
**Decision**: Use Socket.io for real-time notification delivery

**Rationale**:
- Instant in-app notifications
- Reduced polling
- Bi-directional communication
- Fallback to polling

**Trade-offs**:
- WebSocket connection overhead
- Complex state management
- Scaling challenges

### Alternative Approaches Considered

#### Architecture Alternatives
1. **Direct delivery**: Simpler but less reliable
2. **Pub/Sub only**: Less control over delivery
3. **Serverless**: Cost-effective but cold starts
4. **Monolithic**: Simpler but less scalable

#### Technology Alternatives
1. **RabbitMQ**: More complex than BullMQ
2. **Kafka**: Overkill for this scale
3. **AWS SNS/SQS**: Vendor lock-in
4. **Pusher/Ably**: Less control, higher cost

## Deployment Considerations

### Infrastructure Requirements

```yaml
# Kubernetes deployment example
apiVersion: apps/v1
kind: Deployment
metadata:
  name: notification-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: notification-service
  template:
    spec:
      containers:
      - name: notification-api
        image: notification-service:latest
        env:
        - name: NODE_ENV
          value: production
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: redis-secret
              key: url
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: notification-workers
spec:
  replicas: 5
  selector:
    matchLabels:
      app: notification-workers
  template:
    spec:
      containers:
      - name: worker
        image: notification-worker:latest
        env:
        - name: WORKER_CONCURRENCY
          value: "50"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

### Monitoring & Observability

```typescript
// Prometheus metrics
class NotificationMetrics {
  private counter = {
    sent: new Counter({
      name: 'notifications_sent_total',
      help: 'Total notifications sent',
      labelNames: ['category', 'channel', 'priority'],
    }),
    
    delivered: new Counter({
      name: 'notifications_delivered_total',
      help: 'Total notifications delivered',
      labelNames: ['category', 'channel'],
    }),
    
    failed: new Counter({
      name: 'notifications_failed_total',
      help: 'Total notifications failed',
      labelNames: ['category', 'channel', 'reason'],
    }),
  };
  
  private histogram = {
    deliveryTime: new Histogram({
      name: 'notification_delivery_duration_seconds',
      help: 'Notification delivery time',
      labelNames: ['category', 'channel'],
      buckets: [0.1, 0.5, 1, 2, 5, 10],
    }),
    
    queueTime: new Histogram({
      name: 'notification_queue_duration_seconds',
      help: 'Time spent in queue',
      labelNames: ['priority'],
      buckets: [1, 5, 10, 30, 60, 300],
    }),
  };
  
  private gauge = {
    queueSize: new Gauge({
      name: 'notification_queue_size',
      help: 'Current queue size',
      labelNames: ['priority'],
    }),
    
    activeConnections: new Gauge({
      name: 'notification_websocket_connections',
      help: 'Active WebSocket connections',
    }),
  };
}
```

### Environment Configuration

```typescript
// Environment variables
interface NotificationEnvironment {
  // Service configuration
  NODE_ENV: 'development' | 'staging' | 'production';
  PORT: number;
  
  // Database
  DATABASE_URL: string;
  REDIS_URL: string;
  
  // External services
  SENDGRID_API_KEY: string;
  FCM_SERVER_KEY: string;
  APNS_KEY_ID: string;
  APNS_TEAM_ID: string;
  
  // Security
  WEBHOOK_SECRET: string;
  ENCRYPTION_KEY: string;
  
  // Performance
  WORKER_CONCURRENCY: number;
  QUEUE_RATE_LIMIT: number;
  CACHE_TTL: number;
  
  // Features
  ENABLE_EMAIL_NOTIFICATIONS: boolean;
  ENABLE_PUSH_NOTIFICATIONS: boolean;
  ENABLE_WEBHOOKS: boolean;
  ENABLE_BUNDLING: boolean;
}
```

## Risk Mitigation

### Technical Risks

| Risk | Impact | Mitigation Strategy |
|------|--------|-------------------|
| **Service outages** | High | Multi-provider fallbacks, circuit breakers |
| **Queue overflow** | High | Auto-scaling, backpressure, priorities |
| **Data loss** | Critical | Persistent queues, transaction logs |
| **Security breach** | Critical | Encryption, authentication, auditing |
| **Performance degradation** | Medium | Caching, monitoring, optimization |

### Operational Risks

| Risk | Impact | Mitigation Strategy |
|------|--------|-------------------|
| **Notification spam** | High | Rate limiting, user controls, bundling |
| **User fatigue** | High | Smart timing, preferences, quiet hours |
| **Compliance violations** | High | Data minimization, consent, auditing |
| **Cost overrun** | Medium | Usage monitoring, quotas, optimization |

## Success Metrics

### Technical Metrics
- 99.9% delivery success rate
- < 2 second average delivery time
- < 100ms API response time
- 100K+ concurrent connections
- < 0.1% error rate

### Business Metrics
- 80% notification opt-in rate
- 30% improvement in task completion
- < 20% unsubscribe rate
- 50% engagement rate
- 90% user satisfaction

### Operational Metrics
- < 5 minute incident response
- 99.95% uptime SLA
- < $0.001 cost per notification
- 100% GDPR compliance
- Zero security incidents

---

**Document Version**: 1.0.0  
**Last Updated**: 2025-07-22  
**Next Review**: After Phase 1 implementation  
**Approval Required**: Technical Lead, Security Team, Architecture Team