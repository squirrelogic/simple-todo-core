# Notifications Feature - Technical Implementation Notes

**Feature**: Multi-Channel Notifications System  
**Architecture**: Event-driven, Queue-based, Multi-channel

## Architecture Overview

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Todo Events   │────▶│ Notification     │────▶│ Channel Router  │
│   (Due dates,   │     │ Orchestrator     │     │ (Routes to      │
│   Updates, etc) │     │                  │     │ appropriate     │
└─────────────────┘     └──────────────────┘     │ channels)       │
                                │                 └─────────────────┘
                                │                          │
                                ▼                          ▼
                        ┌──────────────────┐      ┌─────────────────┐
                        │ Preference       │      │ Channel         │
                        │ Engine           │      │ Implementations │
                        │ (User settings)  │      │ - Browser       │
                        └──────────────────┘      │ - Email         │
                                                  │ - Push          │
                                                  │ - Webhook       │
                                                  └─────────────────┘
```

## Story-Specific Technical Notes

### NOT-001: Enable Browser Notifications

**Service Worker Implementation**
```javascript
// sw.js - Service Worker for notifications
self.addEventListener('push', function(event) {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      todoId: data.todoId,
      action: data.action
    },
    actions: [
      { action: 'complete', title: 'Complete' },
      { action: 'snooze', title: 'Snooze' }
    ],
    requireInteraction: data.priority === 'high'
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  if (event.action === 'complete') {
    // Call API to mark todo complete
  } else if (event.action === 'snooze') {
    // Show snooze options
  } else {
    // Open the app to the specific todo
    event.waitUntil(
      clients.openWindow(`/todo/${event.notification.data.todoId}`)
    );
  }
});
```

**Permission Handling Strategy**
- Never request on page load
- Show value proposition first
- Request after user action (e.g., enabling reminders)
- Handle all permission states gracefully
- Provide re-request mechanism

---

### NOT-002: Configure Email Notifications

**Email Service Architecture**
```typescript
interface EmailService {
  // Template management
  registerTemplate(name: string, html: string, text: string): Promise<void>;
  
  // Sending
  sendTransactional(to: string, template: string, data: any): Promise<void>;
  sendBatch(recipients: EmailRecipient[]): Promise<BatchResult>;
  
  // Tracking
  trackOpen(messageId: string): void;
  trackClick(messageId: string, link: string): void;
  
  // List management
  unsubscribe(email: string, category?: string): Promise<void>;
  updatePreferences(email: string, prefs: EmailPreferences): Promise<void>;
}
```

**Email Template Structure**
```handlebars
<!-- base-template.hbs -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    /* Inline CSS for email clients */
    .todo-item { 
      padding: 15px; 
      border-left: 3px solid #3b82f6; 
    }
  </style>
</head>
<body>
  <div class="container">
    {{> header}}
    {{> content}}
    {{> footer}}
  </div>
  
  <!-- Tracking pixel -->
  <img src="{{trackingUrl}}" width="1" height="1" />
</body>
</html>
```

---

### NOT-003: Enable Mobile Push Notifications

**Token Management Flow**
```typescript
class PushTokenManager {
  async registerDevice(userId: string, platform: Platform, token: string) {
    // Check if token exists
    const existing = await this.findToken(token);
    
    if (existing && existing.userId !== userId) {
      // Token transferred to new user
      await this.deactivateToken(existing);
    }
    
    // Store or update token
    await this.upsertToken({
      userId,
      platform,
      token,
      deviceInfo: this.getDeviceInfo(),
      active: true,
      lastUpdated: new Date()
    });
    
    // Schedule token validation
    await this.scheduleTokenValidation(token);
  }
  
  async sendPush(userId: string, notification: PushNotification) {
    const tokens = await this.getActiveTokens(userId);
    
    for (const token of tokens) {
      try {
        await this.sendToPlatform(token, notification);
      } catch (error) {
        if (this.isInvalidToken(error)) {
          await this.deactivateToken(token);
        }
      }
    }
  }
}
```

**Platform-Specific Payloads**
```typescript
// iOS (APNs)
const iosPayload = {
  aps: {
    alert: {
      title: notification.title,
      body: notification.body,
      subtitle: notification.subtitle
    },
    badge: unreadCount,
    sound: 'default',
    'thread-id': notification.groupId,
    'category': 'TODO_NOTIFICATION'
  },
  todoId: notification.todoId
};

// Android (FCM)
const androidPayload = {
  notification: {
    title: notification.title,
    body: notification.body,
    icon: 'ic_notification',
    color: '#3b82f6',
    tag: notification.groupId,
    click_action: 'TODO_NOTIFICATION_CLICK'
  },
  data: {
    todoId: notification.todoId,
    action: notification.action
  },
  android: {
    priority: 'high',
    ttl: '86400s'
  }
};
```

---

### NOT-005: Configure Quiet Hours

**Quiet Hours Implementation**
```typescript
class QuietHoursService {
  async shouldSendNow(userId: string, notification: Notification): Promise<boolean> {
    const preferences = await this.getPreferences(userId);
    
    if (!preferences.quietHours.enabled) {
      return true;
    }
    
    // High priority bypasses quiet hours
    if (notification.priority === 'high' && preferences.quietHours.allowUrgent) {
      return true;
    }
    
    const userTime = this.getUserLocalTime(userId);
    const quietStart = this.parseTime(preferences.quietHours.start);
    const quietEnd = this.parseTime(preferences.quietHours.end);
    
    if (this.isInQuietHours(userTime, quietStart, quietEnd)) {
      // Queue for later delivery
      await this.queueForDelivery(notification, quietEnd);
      return false;
    }
    
    return true;
  }
  
  private isInQuietHours(current: Date, start: Time, end: Time): boolean {
    // Handle overnight quiet hours (e.g., 22:00 - 07:00)
    if (end.isBefore(start)) {
      return current.isAfter(start) || current.isBefore(end);
    }
    return current.isAfter(start) && current.isBefore(end);
  }
}
```

---

### NOT-008: Configure Notification Bundling

**Bundling Algorithm**
```typescript
class NotificationBundler {
  private bundles = new Map<string, Bundle>();
  
  async addNotification(notification: Notification): Promise<void> {
    // Check if bundling is enabled
    if (!this.shouldBundle(notification)) {
      await this.sendImmediately(notification);
      return;
    }
    
    const bundleKey = this.getBundleKey(notification);
    let bundle = this.bundles.get(bundleKey);
    
    if (!bundle) {
      bundle = this.createBundle(bundleKey);
      this.bundles.set(bundleKey, bundle);
      
      // Schedule bundle delivery
      setTimeout(() => this.deliverBundle(bundleKey), 
        bundle.windowMs);
    }
    
    bundle.notifications.push(notification);
    
    // Check if bundle is full
    if (bundle.notifications.length >= bundle.maxItems) {
      await this.deliverBundle(bundleKey);
    }
  }
  
  private async deliverBundle(bundleKey: string): Promise<void> {
    const bundle = this.bundles.get(bundleKey);
    if (!bundle || bundle.notifications.length === 0) return;
    
    const bundledNotification = this.createBundledNotification(bundle);
    await this.notificationService.send(bundledNotification);
    
    this.bundles.delete(bundleKey);
  }
  
  private createBundledNotification(bundle: Bundle): Notification {
    const count = bundle.notifications.length;
    const categories = [...new Set(bundle.notifications.map(n => n.category))];
    
    return {
      title: `${count} notifications`,
      body: this.generateSummary(bundle.notifications),
      data: {
        bundled: true,
        notificationIds: bundle.notifications.map(n => n.id),
        categories
      },
      priority: Math.max(...bundle.notifications.map(n => n.priority))
    };
  }
}
```

---

### NOT-009: Receive Due Date Reminders

**Notification Scheduler**
```typescript
class DueDateScheduler {
  async scheduleNotifications(todo: Todo): Promise<void> {
    if (!todo.dueDate) return;
    
    const preferences = await this.getPreferences(todo.userId);
    const notifications = [];
    
    // Morning reminder for tasks due today
    if (preferences.notifications.morningReminder) {
      const morningTime = this.getMorningReminderTime(todo.dueDate, preferences);
      notifications.push({
        type: 'due_today',
        scheduledFor: morningTime,
        todo
      });
    }
    
    // X hours before due time
    if (todo.dueTime && preferences.notifications.beforeDue) {
      const reminderTime = new Date(todo.dueDate);
      reminderTime.setHours(reminderTime.getHours() - preferences.notifications.hoursBefore);
      
      notifications.push({
        type: 'due_soon',
        scheduledFor: reminderTime,
        todo
      });
    }
    
    // Schedule all notifications
    for (const notification of notifications) {
      await this.queueService.schedule(
        'send-notification',
        notification,
        { delay: notification.scheduledFor.getTime() - Date.now() }
      );
    }
  }
}
```

---

### NOT-011: Get Daily Digest Email

**Digest Generation Service**
```typescript
class DigestService {
  async generateDailyDigest(userId: string): Promise<DigestEmail> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Fetch user's tasks
    const [dueTodayTasks, overdueTasks, upcomingTasks] = await Promise.all([
      this.todoService.getTasksDueBetween(userId, today, tomorrow),
      this.todoService.getOverdueTasks(userId),
      this.todoService.getUpcomingTasks(userId, 7) // Next 7 days
    ]);
    
    // Skip if no tasks
    if (dueTodayTasks.length === 0 && overdueTasks.length === 0) {
      return null;
    }
    
    // Generate digest content
    return {
      to: user.email,
      subject: this.generateSubject(dueTodayTasks, overdueTasks),
      template: 'daily-digest',
      data: {
        userName: user.name,
        date: this.formatDate(today),
        stats: {
          dueToday: dueTodayTasks.length,
          overdue: overdueTasks.length,
          upcoming: upcomingTasks.length
        },
        sections: [
          {
            title: 'Overdue Tasks',
            tasks: overdueTasks,
            style: 'urgent'
          },
          {
            title: 'Due Today',
            tasks: dueTodayTasks,
            style: 'primary'
          },
          {
            title: 'Upcoming This Week',
            tasks: upcomingTasks,
            style: 'secondary'
          }
        ]
      }
    };
  }
}
```

---

### NOT-013: Snooze Notifications

**Snooze Queue Implementation**
```typescript
class SnoozeService {
  async snoozeNotification(
    notificationId: string, 
    duration: SnoozeDuration
  ): Promise<void> {
    // Get original notification
    const notification = await this.getNotification(notificationId);
    
    // Calculate snooze until time
    const snoozeUntil = this.calculateSnoozeTime(duration);
    
    // Track snooze history
    await this.trackSnooze(notification, duration);
    
    // Cancel any pending deliveries
    await this.cancelPendingDelivery(notificationId);
    
    // Schedule redelivery
    await this.queueService.schedule(
      'deliver-snoozed-notification',
      {
        ...notification,
        snoozedFrom: new Date(),
        snoozeCount: (notification.snoozeCount || 0) + 1
      },
      { 
        delay: snoozeUntil.getTime() - Date.now(),
        jobId: `snooze-${notificationId}`
      }
    );
  }
  
  private calculateSnoozeTime(duration: SnoozeDuration): Date {
    const now = new Date();
    
    switch (duration.type) {
      case 'minutes':
        return new Date(now.getTime() + duration.value * 60 * 1000);
      
      case 'hours':
        return new Date(now.getTime() + duration.value * 60 * 60 * 1000);
      
      case 'tomorrow':
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0); // 9 AM tomorrow
        return tomorrow;
      
      case 'custom':
        return duration.until;
    }
  }
}
```

---

### NOT-015: View Notification Center

**Real-time Updates with WebSocket**
```typescript
class NotificationCenterService {
  private connections = new Map<string, WebSocket>();
  
  async handleConnection(userId: string, ws: WebSocket): void {
    this.connections.set(userId, ws);
    
    // Send initial state
    const notifications = await this.getRecentNotifications(userId);
    ws.send(JSON.stringify({
      type: 'initial',
      data: notifications
    }));
    
    // Subscribe to updates
    this.eventBus.on(`notification.${userId}`, (notification) => {
      this.sendUpdate(userId, {
        type: 'new',
        data: notification
      });
    });
    
    ws.on('message', async (message) => {
      const { action, notificationIds } = JSON.parse(message);
      
      switch (action) {
        case 'markRead':
          await this.markAsRead(userId, notificationIds);
          break;
        case 'delete':
          await this.deleteNotifications(userId, notificationIds);
          break;
      }
    });
  }
  
  private sendUpdate(userId: string, update: any): void {
    const ws = this.connections.get(userId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(update));
    }
  }
}
```

---

### NOT-017: Set Priority Notification Rules

**Priority Queue Implementation**
```typescript
class PriorityNotificationQueue {
  private queues = {
    urgent: new Queue('urgent', { priority: 10 }),
    high: new Queue('high', { priority: 5 }),
    normal: new Queue('normal', { priority: 3 }),
    low: new Queue('low', { priority: 1 })
  };
  
  async enqueue(notification: Notification): Promise<void> {
    const queue = this.queues[notification.priority];
    
    await queue.add('process-notification', notification, {
      attempts: notification.priority === 'urgent' ? 5 : 3,
      backoff: {
        type: 'exponential',
        delay: 2000
      },
      removeOnComplete: true,
      removeOnFail: false
    });
    
    // Urgent notifications get special handling
    if (notification.priority === 'urgent') {
      await this.handleUrgentNotification(notification);
    }
  }
  
  private async handleUrgentNotification(notification: Notification): Promise<void> {
    // Bypass quiet hours
    notification.bypassQuietHours = true;
    
    // Ensure delivery through multiple channels
    notification.channels = ['browser', 'email', 'push'];
    
    // Set escalation if not acknowledged
    setTimeout(async () => {
      const delivered = await this.checkDeliveryStatus(notification.id);
      if (!delivered.acknowledged) {
        await this.escalateNotification(notification);
      }
    }, 5 * 60 * 1000); // 5 minutes
  }
}
```

---

## Queue Architecture

### BullMQ Configuration
```typescript
const queueConfig = {
  connection: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    db: 1 // Dedicated DB for queues
  },
  defaultJobOptions: {
    removeOnComplete: {
      age: 24 * 3600 // Keep completed jobs for 24 hours
    },
    removeOnFail: {
      age: 7 * 24 * 3600 // Keep failed jobs for 7 days
    }
  }
};

// Create queues
const notificationQueue = new Queue('notifications', queueConfig);
const emailQueue = new Queue('emails', queueConfig);
const pushQueue = new Queue('push', queueConfig);
const schedulerQueue = new Queue('scheduler', queueConfig);
```

### Worker Implementation
```typescript
const notificationWorker = new Worker('notifications', async (job) => {
  const { userId, notification } = job.data;
  
  try {
    // Check user preferences
    const preferences = await preferenceService.getPreferences(userId);
    
    // Check quiet hours
    if (!await quietHoursService.shouldSendNow(userId, notification)) {
      // Re-queue for later
      await job.moveToDelayed(quietHoursService.getDeliveryTime(userId));
      return;
    }
    
    // Route to channels
    const channels = channelRouter.getChannels(notification, preferences);
    
    // Send to each channel
    const results = await Promise.allSettled(
      channels.map(channel => channel.send(notification))
    );
    
    // Track delivery
    await analyticsService.trackDelivery(notification, results);
    
    return { success: true, results };
  } catch (error) {
    logger.error('Notification delivery failed', { error, job });
    throw error;
  }
}, {
  concurrency: 10,
  ...queueConfig
});
```

## Performance Considerations

### Caching Strategy
```typescript
class NotificationCache {
  private redis: Redis;
  
  // Cache user preferences
  async getPreferences(userId: string): Promise<Preferences> {
    const cached = await this.redis.get(`prefs:${userId}`);
    if (cached) return JSON.parse(cached);
    
    const prefs = await this.db.getPreferences(userId);
    await this.redis.setex(`prefs:${userId}`, 300, JSON.stringify(prefs));
    return prefs;
  }
  
  // Cache notification templates
  async getTemplate(name: string): Promise<Template> {
    const cached = await this.redis.get(`template:${name}`);
    if (cached) return JSON.parse(cached);
    
    const template = await this.db.getTemplate(name);
    await this.redis.setex(`template:${name}`, 3600, JSON.stringify(template));
    return template;
  }
}
```

### Database Optimization
```sql
-- Indexes for performance
CREATE INDEX idx_scheduled_notifications_delivery 
  ON scheduled_notifications(scheduled_for, status)
  WHERE status = 'pending';

CREATE INDEX idx_notification_log_user_date 
  ON notification_log(user_id, created_at DESC);

CREATE INDEX idx_push_tokens_active 
  ON push_tokens(user_id, active)
  WHERE active = true;

-- Partitioning for notification_log
CREATE TABLE notification_log_2024_01 PARTITION OF notification_log
  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

## Security Considerations

### Notification Content Encryption
```typescript
class NotificationSecurity {
  async encryptContent(notification: Notification): Promise<void> {
    if (notification.containsSensitiveData) {
      notification.title = await this.encrypt(notification.title);
      notification.body = await this.encrypt(notification.body);
      notification.encrypted = true;
    }
  }
  
  async validateWebhook(request: Request): Promise<boolean> {
    const signature = request.headers['x-webhook-signature'];
    const payload = request.body;
    
    const expectedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(JSON.stringify(payload))
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }
}
```

## Testing Strategies

### Unit Test Examples
```typescript
describe('NotificationBundler', () => {
  it('should bundle notifications within time window', async () => {
    const bundler = new NotificationBundler({ windowMs: 5000 });
    
    const notification1 = createNotification({ category: 'due_date' });
    const notification2 = createNotification({ category: 'due_date' });
    
    await bundler.addNotification(notification1);
    await bundler.addNotification(notification2);
    
    // Wait for bundle delivery
    await sleep(5100);
    
    expect(mockNotificationService.send).toHaveBeenCalledTimes(1);
    expect(mockNotificationService.send).toHaveBeenCalledWith(
      expect.objectContaining({
        title: '2 notifications',
        data: expect.objectContaining({
          bundled: true
        })
      })
    );
  });
});
```

### Load Testing
```javascript
// k6 load test script
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 1000 },
    { duration: '2m', target: 0 },
  ],
};

export default function() {
  const notification = {
    userId: `user_${Math.floor(Math.random() * 10000)}`,
    type: 'due_date',
    title: 'Task Due Soon',
    body: 'Your task is due in 1 hour'
  };
  
  const res = http.post(
    'http://localhost:3000/api/notifications',
    JSON.stringify(notification),
    { headers: { 'Content-Type': 'application/json' } }
  );
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });
}
```

## Monitoring and Alerting

### Key Metrics to Track
```typescript
const metrics = {
  // Delivery metrics
  'notifications.sent': new Counter(),
  'notifications.delivered': new Counter(),
  'notifications.failed': new Counter(),
  'notifications.delivery_time': new Histogram(),
  
  // Channel metrics
  'notifications.channel.browser': new Counter(),
  'notifications.channel.email': new Counter(),
  'notifications.channel.push': new Counter(),
  
  // Queue metrics
  'queue.depth': new Gauge(),
  'queue.processing_time': new Histogram(),
  'queue.failures': new Counter(),
  
  // User metrics
  'users.opted_in': new Gauge(),
  'users.opted_out': new Counter(),
  'preferences.updated': new Counter()
};
```

### Alert Conditions
```yaml
alerts:
  - name: HighNotificationFailureRate
    condition: rate(notifications.failed) > 0.05
    severity: warning
    
  - name: QueueBacklog
    condition: queue.depth > 10000
    severity: critical
    
  - name: SlowDelivery
    condition: notifications.delivery_time.p95 > 5000
    severity: warning
    
  - name: HighOptOutRate
    condition: rate(users.opted_out) > 0.1
    severity: warning
```

## Common Pitfalls and Solutions

### 1. Notification Spam
**Problem**: Users get too many notifications  
**Solution**: Implement smart bundling, frequency caps, and easy preference management

### 2. Permission Denial
**Problem**: High browser notification denial rate  
**Solution**: Progressive permission request with value explanation

### 3. Token Management
**Problem**: Push tokens expire or become invalid  
**Solution**: Automatic token refresh, validation, and cleanup

### 4. Time Zone Issues
**Problem**: Notifications arrive at wrong times  
**Solution**: Store user timezone, use moment-timezone for calculations

### 5. Scale Issues
**Problem**: System slows with many users  
**Solution**: Horizontal scaling, queue partitioning, caching

## Future Enhancements

### Machine Learning Opportunities
1. Optimal send time prediction
2. Notification fatigue detection
3. Content personalization
4. Smart bundling optimization

### Advanced Features
1. Natural language notification commands
2. Voice notifications
3. AR/VR notifications
4. Blockchain notification proof
5. Satellite fallback delivery