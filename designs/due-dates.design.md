# Due Dates Feature - Architecture Design Document

**Feature**: Due Dates & Reminders System  
**Version**: 1.0.0  
**Date**: 2025-07-22  
**Status**: Draft  
**Authors**: Architecture Team

## Executive Summary

This document presents the architectural design for the Due Dates feature of the Simple Todo application. The design extends the existing core-todo functionality with sophisticated temporal task management capabilities, including deadline tracking, visual urgency indicators, browser-based reminders, and recurring task patterns. The architecture emphasizes seamless integration, performance optimization, and intuitive user experience while maintaining the application's commitment to accessibility and simplicity.

### Key Design Principles
- **Temporal Intelligence**: Smart date handling with natural language processing
- **Proactive Reminders**: Timely notifications without overwhelming users
- **Visual Clarity**: Intuitive urgency indicators and date displays
- **Mobile-First**: Responsive date selection optimized for touch
- **Timezone Awareness**: Consistent experience across locations

### Architecture Highlights
- Extension of existing todo model with temporal properties
- Dedicated date picker component with multiple input methods
- Browser notification system for reminders
- Recurring task engine with flexible patterns
- Performance-optimized date calculations and sorting

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              Browser Environment                         │
├─────────────────────────────────────────────────────────────────────────┤
│                          Presentation Layer                              │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                 Enhanced Todo Components                          │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐    │   │
│  │  │  TodoItem   │  │   DatePicker  │  │   ReminderIcon     │    │   │
│  │  │ (+ DueDate) │  │  (Calendar)   │  │  (Notification)    │    │   │
│  │  └──────┬──────┘  └──────┬───────┘  └─────────┬──────────┘    │   │
│  │         │                 │                     │                │   │
│  │  ┌──────▼─────────────────▼────────────────────▼───────────┐   │   │
│  │  │                   DueDateManager                         │   │   │
│  │  │          (Orchestrates Date Operations)                  │   │   │
│  │  └──────┬───────────────────────────────────────────────────┘   │   │
│  │         │                                                        │   │
│  │  ┌──────▼────────┐  ┌────────────┐  ┌──────────────┐         │   │
│  │  │  QuickDates   │  │ DateFilter │  │ RecurDialog  │         │   │
│  │  │ (Presets)     │  │ (Sort/Filter)│  │ (Patterns)  │         │   │
│  │  └───────────────┘  └────────────┘  └──────────────┘         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────────┤
│                         Business Logic Layer                             │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                Extended State Management (Zustand)                │   │
│  │  ┌────────────────┐  ┌──────────────┐  ┌──────────────────┐   │   │
│  │  │Extended Todo   │  │   Date Store │  │  Reminder Store  │   │   │
│  │  │Store + Dates   │  │  Operations  │  │   Scheduling     │   │   │
│  │  └────────────────┘  └──────────────┘  └──────────────────┘   │   │
│  │                                                                  │   │
│  │  ┌────────────────┐  ┌──────────────┐  ┌──────────────────┐   │   │
│  │  │  Date Hooks    │  │  Date Utils  │  │  Notification    │   │   │
│  │  │  - useDueDate  │  │  - Parsing   │  │    Service       │   │   │
│  │  │  - useReminder │  │  - Formatting│  │                  │   │   │
│  │  └────────────────┘  └──────────────┘  └──────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────────┤
│                            Effects Layer                                 │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Side Effects & Scheduling                      │   │
│  │  ┌────────────────┐  ┌──────────────┐  ┌──────────────────┐   │   │
│  │  │Reminder Engine │  │  Recurrence  │  │  Notification    │   │   │
│  │  │  Scheduler     │  │  Generator   │  │  Permission Mgr  │   │   │
│  │  └────────────────┘  └──────────────┘  └──────────────────┘   │   │
│  │                                                                  │   │
│  │  ┌────────────────┐  ┌──────────────┐  ┌──────────────────┐   │   │
│  │  │  Date Storage  │  │  Migration   │  │  Performance     │   │   │
│  │  │  Persistence   │  │  Service     │  │   Monitor        │   │   │
│  │  └────────────────┘  └──────────────┘  └──────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

### Integration with Core Todo

```
┌─────────────────┐          ┌─────────────────┐
│   Core Todo     │ extends  │   Due Dates     │
│   - id          │ ───────► │   - dueDate     │
│   - text        │          │   - reminder    │
│   - completed   │          │   - recurring   │
│   - createdAt   │          │   - urgency     │
└─────────────────┘          └─────────────────┘
         │                            │
         └────────────┬───────────────┘
                      │
              ┌───────▼────────┐
              │ Enhanced Todo  │
              │  with Dates    │
              └────────────────┘
```

## Component Design

### Component Hierarchy

```
src/features/due-dates/components/
├── DueDateManager.tsx        # Main orchestrator component
├── DatePicker/
│   ├── DatePicker.tsx        # Calendar component
│   ├── DateInput.tsx         # Text input with validation
│   ├── Calendar.tsx          # Month view calendar
│   └── TimePicker.tsx        # Optional time selection
├── QuickDates/
│   ├── QuickDates.tsx        # Preset date options
│   ├── QuickDateButton.tsx   # Individual preset
│   └── NaturalLanguage.tsx   # Natural date parser
├── DateDisplay/
│   ├── DateBadge.tsx         # Due date display
│   ├── UrgencyIndicator.tsx  # Visual urgency
│   └── RelativeTime.tsx      # "in 2 hours" display
├── Reminders/
│   ├── ReminderSettings.tsx  # Configure reminders
│   ├── ReminderIcon.tsx      # Bell icon with state
│   └── NotificationPrompt.tsx # Permission request
├── Recurring/
│   ├── RecurringDialog.tsx   # Recurrence setup
│   ├── RecurrencePattern.tsx # Pattern selector
│   └── RecurrencePreview.tsx # Shows next dates
└── common/
    ├── DateButton.tsx        # Accessible date button
    ├── DateTooltip.tsx       # Hover information
    └── DateSkeleton.tsx      # Loading state
```

### Detailed Component Specifications

#### DueDateManager Component
```typescript
interface DueDateManagerProps {
  todo: Todo;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  compact?: boolean;
  showReminder?: boolean;
}

const DueDateManager: React.FC<DueDateManagerProps> = ({
  todo,
  onUpdate,
  compact = false,
  showReminder = true
}) => {
  // Orchestrates all date-related operations
  // Manages date picker state
  // Handles reminder setup
  // Coordinates recurring patterns
}
```

**Responsibilities:**
- Central management of date operations
- State coordination between sub-components
- Date validation and formatting
- Accessibility management
- Mobile/desktop adaptation

#### DatePicker Component
```typescript
interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  showTime?: boolean;
  locale?: string;
  onClose?: () => void;
}
```

**Key Features:**
- Month/year navigation
- Keyboard navigation (arrow keys)
- Touch-friendly for mobile
- Accessibility compliant (ARIA)
- Locale-aware formatting
- Quick date shortcuts integrated

**Mobile Optimization:**
```typescript
const MobileDatePicker = () => {
  const isMobile = useMediaQuery('(max-width: 640px)');
  
  if (isMobile) {
    return (
      <Drawer>
        <Calendar fullWidth />
        <QuickDates horizontal />
      </Drawer>
    );
  }
  
  return <Popover><Calendar /></Popover>;
};
```

#### QuickDates Component
```typescript
interface QuickDatesProps {
  onSelect: (date: Date) => void;
  currentDate?: Date;
  customPresets?: QuickDatePreset[];
}

interface QuickDatePreset {
  label: string;
  value: Date | ((current: Date) => Date);
  keyboard?: string;
}
```

**Default Presets:**
- Today (T)
- Tomorrow (M)
- This Weekend (W)
- Next Week (N)
- In 1 Month
- No Date (Clear)

#### Reminder System
```typescript
interface ReminderSettings {
  enabled: boolean;
  timing: ReminderTiming;
  customMinutes?: number;
}

type ReminderTiming = 
  | 'at-time'
  | '5-minutes'
  | '15-minutes'
  | '1-hour'
  | '1-day'
  | 'custom';

interface ReminderSchedule {
  todoId: string;
  scheduledFor: Date;
  notificationId?: string;
  status: 'pending' | 'sent' | 'cancelled';
}
```

#### Recurring Tasks
```typescript
interface RecurrencePattern {
  type: RecurrenceType;
  interval: number;
  daysOfWeek?: number[];
  dayOfMonth?: number;
  endDate?: Date;
  occurrences?: number;
}

type RecurrenceType = 
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'custom';

interface RecurrenceGenerator {
  pattern: RecurrencePattern;
  startDate: Date;
  getNextDates(count: number): Date[];
  isValidDate(date: Date): boolean;
}
```

## Data Architecture

### Extended Data Models

#### Enhanced Todo Type
```typescript
// Extends base Todo interface
interface TodoWithDates extends Todo {
  // Date fields
  dueDate?: string;           // ISO 8601 date string in UTC
  dueTime?: boolean;          // Has specific time vs all-day
  reminder?: ReminderSettings;
  recurring?: RecurrencePattern;
  
  // Computed fields (not stored)
  urgencyLevel?: UrgencyLevel;
  isOverdue?: boolean;
  nextOccurrence?: string;
}

type UrgencyLevel = 
  | 'overdue'     // Past due date
  | 'today'       // Due today
  | 'tomorrow'    // Due tomorrow
  | 'this-week'   // Due within 7 days
  | 'future'      // Due later
  | 'none';       // No due date
```

#### Storage Schema
```typescript
// localStorage structure
{
  "todo-storage": {
    "state": {
      "todos": [
        {
          "id": "550e8400-e29b-41d4-a716-446655440000",
          "text": "Complete project report",
          "completed": false,
          "createdAt": 1737553200000,
          "updatedAt": 1737553200000,
          "order": 0,
          // Due date fields
          "dueDate": "2025-01-25T15:00:00.000Z",
          "dueTime": true,
          "reminder": {
            "enabled": true,
            "timing": "1-hour",
            "customMinutes": null
          },
          "recurring": {
            "type": "weekly",
            "interval": 1,
            "daysOfWeek": [1, 3, 5],
            "endDate": "2025-12-31T23:59:59.999Z"
          }
        }
      ],
      "filter": "all",
      "dateFilter": "upcoming",
      "sortBy": "dueDate"
    },
    "version": 2
  },
  "reminder-schedules": {
    "schedules": [
      {
        "todoId": "550e8400-e29b-41d4-a716-446655440000",
        "scheduledFor": "2025-01-25T14:00:00.000Z",
        "notificationId": "notif-123",
        "status": "pending"
      }
    ]
  }
}
```

### State Management Extensions

#### Extended Todo Store
```typescript
interface ExtendedTodoStore extends TodoStore {
  // Additional state
  dateFilter: DateFilterType;
  sortBy: SortOption;
  
  // Date-specific actions
  setDueDate: (id: string, date: Date | null) => void;
  setReminder: (id: string, settings: ReminderSettings) => void;
  setRecurrence: (id: string, pattern: RecurrencePattern | null) => void;
  
  // Bulk operations
  bulkSetDueDate: (ids: string[], date: Date | null) => void;
  clearOverdueDates: () => void;
  
  // Computed getters
  getOverdueTodos: () => Todo[];
  getTodosByDateRange: (start: Date, end: Date) => Todo[];
  getUpcomingReminders: () => ReminderSchedule[];
}

// Implementation
export const useTodoStore = create<ExtendedTodoStore>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get) => ({
          // ... existing todo store implementation
          
          dateFilter: 'all',
          sortBy: 'createdAt',
          
          setDueDate: (id, date) => set((state) => {
            const todo = state.todos.find(t => t.id === id);
            if (todo) {
              todo.dueDate = date?.toISOString() || undefined;
              todo.updatedAt = Date.now();
              
              // Schedule reminder if enabled
              if (date && todo.reminder?.enabled) {
                scheduleReminder(todo);
              }
            }
          }),
          
          // ... other implementations
        }))
      ),
      {
        name: 'todo-storage',
        version: 2,
        migrate: (persistedState: any, version: number) => {
          if (version === 1) {
            // Migrate from v1 to v2
            return {
              ...persistedState,
              dateFilter: 'all',
              sortBy: 'createdAt',
            };
          }
          return persistedState;
        },
      }
    )
  )
);
```

#### Reminder Store
```typescript
interface ReminderStore {
  schedules: ReminderSchedule[];
  permission: NotificationPermission;
  isSupported: boolean;
  
  // Actions
  requestPermission: () => Promise<NotificationPermission>;
  scheduleReminder: (todo: TodoWithDates) => void;
  cancelReminder: (todoId: string) => void;
  checkAndSendReminders: () => void;
  updateSchedule: (todoId: string, schedule: Partial<ReminderSchedule>) => void;
}

export const useReminderStore = create<ReminderStore>((set, get) => ({
  schedules: [],
  permission: 'default',
  isSupported: 'Notification' in window,
  
  requestPermission: async () => {
    if (!get().isSupported) return 'denied';
    
    const permission = await Notification.requestPermission();
    set({ permission });
    return permission;
  },
  
  scheduleReminder: (todo) => {
    if (!todo.dueDate || !todo.reminder?.enabled) return;
    
    const reminderTime = calculateReminderTime(
      new Date(todo.dueDate),
      todo.reminder.timing,
      todo.reminder.customMinutes
    );
    
    set((state) => ({
      schedules: [
        ...state.schedules.filter(s => s.todoId !== todo.id),
        {
          todoId: todo.id,
          scheduledFor: reminderTime,
          status: 'pending',
        },
      ],
    }));
  },
  
  // ... other implementations
}));
```

### Date Utilities

```typescript
// Date parsing with natural language
export const parseNaturalDate = (input: string): Date | null => {
  // Use chrono-node for natural language parsing
  const parsed = chrono.parseDate(input);
  if (parsed) return parsed;
  
  // Custom patterns
  const patterns: Record<string, () => Date> = {
    'today': () => startOfDay(new Date()),
    'tomorrow': () => startOfDay(addDays(new Date(), 1)),
    'next week': () => startOfWeek(addWeeks(new Date(), 1)),
    'this weekend': () => {
      const today = new Date();
      const dayOfWeek = getDay(today);
      return dayOfWeek === 0 ? today : addDays(today, 6 - dayOfWeek);
    },
  };
  
  const normalizedInput = input.toLowerCase().trim();
  return patterns[normalizedInput]?.() || null;
};

// Date formatting with locale support
export const formatDueDate = (
  date: Date,
  options: {
    relative?: boolean;
    includeTime?: boolean;
    locale?: string;
  } = {}
): string => {
  const { relative = true, includeTime = false, locale = 'en-US' } = options;
  
  if (relative) {
    const now = new Date();
    const diffDays = differenceInDays(date, now);
    
    if (diffDays === 0) return includeTime ? format(date, 'h:mm a') : 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > 0 && diffDays <= 7) return format(date, 'EEEE');
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
  }
  
  return includeTime
    ? format(date, 'MMM d, yyyy h:mm a', { locale })
    : format(date, 'MMM d, yyyy', { locale });
};
```

## API Specifications

### Date Service API

```typescript
interface IDateService {
  // Date operations
  setDueDate(todoId: string, date: Date | null): void;
  clearDueDate(todoId: string): void;
  bulkSetDueDates(todoIds: string[], date: Date | null): void;
  
  // Reminder operations
  setReminder(todoId: string, settings: ReminderSettings): void;
  cancelReminder(todoId: string): void;
  getUpcomingReminders(minutes: number): ReminderSchedule[];
  
  // Recurrence operations
  setRecurrence(todoId: string, pattern: RecurrencePattern): void;
  generateNextOccurrence(todoId: string): Date | null;
  completeRecurringTask(todoId: string): void;
  
  // Query operations
  getTodosDueToday(): Todo[];
  getOverdueTodos(): Todo[];
  getTodosByDateRange(start: Date, end: Date): Todo[];
  
  // Utility methods
  parseDate(input: string): Date | null;
  formatDate(date: Date, format: DateFormat): string;
  getUrgencyLevel(todo: Todo): UrgencyLevel;
}

class DateService implements IDateService {
  constructor(
    private todoStore: ExtendedTodoStore,
    private reminderStore: ReminderStore,
    private dateParser: DateParser
  ) {}
  
  setDueDate(todoId: string, date: Date | null): void {
    this.todoStore.setDueDate(todoId, date);
    
    // Update reminder if date changed
    if (date) {
      const todo = this.todoStore.todos.find(t => t.id === todoId);
      if (todo?.reminder?.enabled) {
        this.reminderStore.scheduleReminder(todo);
      }
    } else {
      this.reminderStore.cancelReminder(todoId);
    }
  }
  
  // ... other implementations
}
```

### Reminder Scheduler API

```typescript
interface IReminderScheduler {
  start(): void;
  stop(): void;
  checkReminders(): void;
  sendNotification(todo: Todo): Promise<void>;
  scheduleNext(todo: Todo): void;
}

class ReminderScheduler implements IReminderScheduler {
  private intervalId?: number;
  private checkInterval = 60000; // 1 minute
  
  start(): void {
    this.intervalId = window.setInterval(() => {
      this.checkReminders();
    }, this.checkInterval);
    
    // Check immediately on start
    this.checkReminders();
  }
  
  stop(): void {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
  
  checkReminders(): void {
    const store = useReminderStore.getState();
    const now = new Date();
    
    const dueReminders = store.schedules.filter(
      schedule => 
        schedule.status === 'pending' &&
        new Date(schedule.scheduledFor) <= now
    );
    
    dueReminders.forEach(schedule => {
      const todo = useTodoStore.getState().todos.find(
        t => t.id === schedule.todoId
      );
      
      if (todo && !todo.completed) {
        this.sendNotification(todo);
        store.updateSchedule(schedule.todoId, { status: 'sent' });
      }
    });
  }
  
  async sendNotification(todo: Todo): Promise<void> {
    if (Notification.permission !== 'granted') return;
    
    const notification = new Notification('Todo Reminder', {
      body: todo.text,
      icon: '/icon-192.png',
      badge: '/badge-72.png',
      tag: `todo-${todo.id}`,
      requireInteraction: true,
      actions: [
        { action: 'complete', title: 'Mark Complete' },
        { action: 'snooze', title: 'Snooze 10 min' },
      ],
    });
    
    notification.onclick = () => {
      window.focus();
      // Navigate to todo
    };
  }
}
```

### Recurrence Engine API

```typescript
interface IRecurrenceEngine {
  generateDates(pattern: RecurrencePattern, start: Date, count: number): Date[];
  validatePattern(pattern: RecurrencePattern): ValidationResult;
  getNextOccurrence(pattern: RecurrencePattern, after: Date): Date | null;
  adjustForTimezone(date: Date, timezone: string): Date;
}

class RecurrenceEngine implements IRecurrenceEngine {
  generateDates(pattern: RecurrencePattern, start: Date, count: number): Date[] {
    const dates: Date[] = [];
    let current = new Date(start);
    let occurrences = 0;
    
    while (dates.length < count && occurrences < (pattern.occurrences || Infinity)) {
      if (pattern.endDate && current > new Date(pattern.endDate)) {
        break;
      }
      
      switch (pattern.type) {
        case 'daily':
          current = addDays(current, pattern.interval);
          break;
          
        case 'weekly':
          if (pattern.daysOfWeek) {
            // Find next valid day of week
            do {
              current = addDays(current, 1);
            } while (!pattern.daysOfWeek.includes(getDay(current)));
          } else {
            current = addWeeks(current, pattern.interval);
          }
          break;
          
        case 'monthly':
          current = addMonths(current, pattern.interval);
          if (pattern.dayOfMonth) {
            current = setDate(current, Math.min(pattern.dayOfMonth, getDaysInMonth(current)));
          }
          break;
          
        case 'yearly':
          current = addYears(current, pattern.interval);
          break;
      }
      
      dates.push(new Date(current));
      occurrences++;
    }
    
    return dates;
  }
  
  // ... other implementations
}
```

## Security Design

### Date Input Security

#### Input Validation
```typescript
class DateValidator {
  private readonly MIN_DATE = new Date('1900-01-01');
  private readonly MAX_DATE = new Date('2100-12-31');
  
  validate(input: string | Date): ValidationResult {
    const errors: ValidationError[] = [];
    
    // Parse date if string
    const date = typeof input === 'string' 
      ? this.parseSecurely(input) 
      : input;
    
    if (!date || !isValid(date)) {
      errors.push({
        field: 'date',
        message: 'Invalid date format',
      });
      return { isValid: false, errors };
    }
    
    // Range validation
    if (date < this.MIN_DATE || date > this.MAX_DATE) {
      errors.push({
        field: 'date',
        message: 'Date is out of valid range',
      });
    }
    
    // Prevent malicious patterns
    if (this.containsMaliciousPatterns(input.toString())) {
      errors.push({
        field: 'date',
        message: 'Invalid characters in date',
      });
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }
  
  private parseSecurely(input: string): Date | null {
    // Sanitize input
    const sanitized = input
      .replace(/<[^>]*>/g, '') // Remove HTML
      .replace(/javascript:/gi, '') // Remove JS protocol
      .trim();
    
    // Try standard parsing
    try {
      return parseISO(sanitized);
    } catch {
      // Try natural language parsing with sanitized input
      return parseNaturalDate(sanitized);
    }
  }
  
  private containsMaliciousPatterns(text: string): boolean {
    const patterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /eval\(/i,
    ];
    
    return patterns.some(pattern => pattern.test(text));
  }
}
```

#### XSS Prevention
```typescript
// Safe date rendering
const SafeDateDisplay: React.FC<{ date: Date | string }> = ({ date }) => {
  const formatted = useMemo(() => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDueDate(dateObj, { includeTime: true });
  }, [date]);
  
  // React automatically escapes text content
  return <span className="date-display">{formatted}</span>;
};

// If custom HTML needed (avoided in this feature)
const SafeDateHTML: React.FC<{ html: string }> = ({ html }) => {
  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['span', 'time'],
    ALLOWED_ATTR: ['datetime', 'class'],
  });
  
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
};
```

### Notification Security

#### Permission Handling
```typescript
class NotificationPermissionManager {
  private permissionState: NotificationPermission = 'default';
  
  async requestPermission(): Promise<boolean> {
    // Check if notifications supported
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return false;
    }
    
    // Already granted
    if (Notification.permission === 'granted') {
      this.permissionState = 'granted';
      return true;
    }
    
    // Already denied - don't ask again
    if (Notification.permission === 'denied') {
      this.permissionState = 'denied';
      return false;
    }
    
    // Request permission with user gesture
    try {
      const permission = await Notification.requestPermission();
      this.permissionState = permission;
      
      // Track permission request
      this.trackPermissionRequest(permission);
      
      return permission === 'granted';
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  }
  
  private trackPermissionRequest(result: NotificationPermission): void {
    // Analytics tracking
    if (window.analytics) {
      window.analytics.track('notification_permission', {
        result,
        timestamp: new Date().toISOString(),
      });
    }
  }
}
```

#### Content Security
```typescript
// Sanitize notification content
const createSecureNotification = (todo: Todo): Notification => {
  // Sanitize text content
  const title = 'Todo Reminder';
  const body = DOMPurify.sanitize(todo.text, {
    ALLOWED_TAGS: [], // Plain text only
    ALLOWED_ATTR: [],
  });
  
  // Create notification with safe content
  return new Notification(title, {
    body: body.substring(0, 200), // Limit length
    icon: '/icon-192.png', // Static asset
    badge: '/badge-72.png', // Static asset
    tag: `todo-${todo.id}`,
    data: {
      todoId: todo.id, // Only pass ID, not full object
    },
  });
};
```

## Performance & Scalability

### Performance Optimizations

#### Date Calculation Memoization
```typescript
// Memoize expensive date calculations
const useUrgencyLevel = (todo: Todo): UrgencyLevel => {
  return useMemo(() => {
    if (!todo.dueDate) return 'none';
    
    const now = new Date();
    const dueDate = parseISO(todo.dueDate);
    const diffDays = differenceInDays(dueDate, now);
    
    if (diffDays < 0) return 'overdue';
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'tomorrow';
    if (diffDays <= 7) return 'this-week';
    return 'future';
  }, [todo.dueDate]);
};

// Memoized sorted todos
const useSortedTodos = (todos: Todo[], sortBy: SortOption) => {
  return useMemo(() => {
    const sorted = [...todos];
    
    switch (sortBy) {
      case 'dueDate':
        return sorted.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
        
      case 'urgency':
        const urgencyOrder = ['overdue', 'today', 'tomorrow', 'this-week', 'future', 'none'];
        return sorted.sort((a, b) => {
          const aLevel = getUrgencyLevel(a);
          const bLevel = getUrgencyLevel(b);
          return urgencyOrder.indexOf(aLevel) - urgencyOrder.indexOf(bLevel);
        });
        
      default:
        return sorted;
    }
  }, [todos, sortBy]);
};
```

#### Efficient Date Filtering
```typescript
// Optimize date range queries
class DateIndex {
  private index: Map<string, Set<string>> = new Map();
  
  buildIndex(todos: Todo[]): void {
    this.index.clear();
    
    todos.forEach(todo => {
      if (!todo.dueDate) return;
      
      const date = parseISO(todo.dueDate);
      const dateKey = format(date, 'yyyy-MM-dd');
      
      if (!this.index.has(dateKey)) {
        this.index.set(dateKey, new Set());
      }
      
      this.index.get(dateKey)!.add(todo.id);
    });
  }
  
  getTodoIdsForDate(date: Date): string[] {
    const dateKey = format(date, 'yyyy-MM-dd');
    return Array.from(this.index.get(dateKey) || []);
  }
  
  getTodoIdsForRange(start: Date, end: Date): string[] {
    const ids = new Set<string>();
    let current = new Date(start);
    
    while (current <= end) {
      const dateKey = format(current, 'yyyy-MM-dd');
      const dayIds = this.index.get(dateKey);
      
      if (dayIds) {
        dayIds.forEach(id => ids.add(id));
      }
      
      current = addDays(current, 1);
    }
    
    return Array.from(ids);
  }
}
```

#### Reminder Check Optimization
```typescript
// Use Web Workers for background reminder checking
// reminder-worker.ts
self.addEventListener('message', (event) => {
  if (event.data.type === 'CHECK_REMINDERS') {
    const { schedules, currentTime } = event.data;
    
    const dueReminders = schedules.filter(schedule => 
      schedule.status === 'pending' &&
      new Date(schedule.scheduledFor).getTime() <= currentTime
    );
    
    self.postMessage({
      type: 'REMINDERS_DUE',
      reminders: dueReminders,
    });
  }
});

// Main thread
class OptimizedReminderScheduler {
  private worker: Worker;
  
  constructor() {
    this.worker = new Worker('/reminder-worker.js');
    this.worker.onmessage = this.handleWorkerMessage.bind(this);
  }
  
  checkReminders(): void {
    const schedules = useReminderStore.getState().schedules;
    
    this.worker.postMessage({
      type: 'CHECK_REMINDERS',
      schedules,
      currentTime: Date.now(),
    });
  }
  
  private handleWorkerMessage(event: MessageEvent): void {
    if (event.data.type === 'REMINDERS_DUE') {
      event.data.reminders.forEach(reminder => {
        this.sendNotification(reminder.todoId);
      });
    }
  }
}
```

### Scalability Considerations

#### Large Dataset Handling
```typescript
// Virtual scrolling for date-grouped todos
const VirtualDateGroupedList: React.FC<{ todos: Todo[] }> = ({ todos }) => {
  const groups = useMemo(() => groupTodosByDate(todos), [todos]);
  
  return (
    <VariableSizeList
      height={600}
      itemCount={groups.length}
      itemSize={getGroupHeight}
      overscanCount={3}
    >
      {({ index, style }) => (
        <DateGroup
          key={groups[index].date}
          group={groups[index]}
          style={style}
        />
      )}
    </VariableSizeList>
  );
};

// Pagination for date ranges
const usePaginatedDateRange = (
  startDate: Date,
  endDate: Date,
  pageSize = 50
) => {
  const [page, setPage] = useState(0);
  
  const todos = useTodoStore((state) => {
    const start = addDays(startDate, page * pageSize);
    const end = addDays(start, pageSize - 1);
    
    return state.getTodosByDateRange(
      max([start, startDate]),
      min([end, endDate])
    );
  });
  
  return {
    todos,
    hasNext: addDays(startDate, (page + 1) * pageSize) < endDate,
    hasPrev: page > 0,
    nextPage: () => setPage(p => p + 1),
    prevPage: () => setPage(p => Math.max(0, p - 1)),
  };
};
```

## Integration Architecture

### Integration with Core Todo

```typescript
// Extend existing todo components
const EnhancedTodoItem: React.FC<TodoItemProps> = (props) => {
  const { todo, onUpdate, ...rest } = props;
  
  return (
    <div className="todo-item-wrapper">
      <TodoItem {...props} />
      
      {/* Add due date components */}
      <div className="todo-date-section">
        <DueDateManager
          todo={todo}
          onUpdate={onUpdate}
          compact
        />
        
        {todo.dueDate && (
          <UrgencyIndicator
            urgencyLevel={getUrgencyLevel(todo)}
          />
        )}
      </div>
    </div>
  );
};

// Extend todo store with date capabilities
const extendTodoStore = (baseStore: TodoStore): ExtendedTodoStore => {
  return {
    ...baseStore,
    
    // Add date-specific state
    dateFilter: 'all',
    sortBy: 'createdAt',
    
    // Add date-specific actions
    setDueDate: (id, date) => {
      baseStore.updateTodo(id, { 
        dueDate: date?.toISOString(),
        updatedAt: Date.now(),
      });
    },
    
    // Add computed getters
    getOverdueTodos: () => {
      const now = new Date();
      return baseStore.todos.filter(todo => 
        todo.dueDate && 
        !todo.completed &&
        new Date(todo.dueDate) < now
      );
    },
  };
};
```

### Feature Module Integration

```
src/features/
├── todos/                    # Core todo feature
│   ├── components/
│   ├── stores/
│   └── hooks/
├── due-dates/               # Due dates feature
│   ├── components/
│   ├── stores/
│   ├── hooks/
│   └── services/
└── shared/                  # Shared between features
    ├── components/
    ├── utils/
    └── types/
```

### Event System Integration

```typescript
// Cross-feature event system
class DueDateEventBus extends EventTarget {
  // Emit date-related events
  emitDueDateSet(todoId: string, date: Date | null): void {
    this.dispatchEvent(new CustomEvent('duedate:set', {
      detail: { todoId, date },
    }));
  }
  
  emitReminderScheduled(todoId: string, time: Date): void {
    this.dispatchEvent(new CustomEvent('reminder:scheduled', {
      detail: { todoId, time },
    }));
  }
  
  emitRecurrenceCompleted(todoId: string, nextDate: Date): void {
    this.dispatchEvent(new CustomEvent('recurrence:completed', {
      detail: { todoId, nextDate },
    }));
  }
}

// Usage in other features
dueDateEventBus.addEventListener('duedate:set', (event) => {
  // Analytics tracking
  analytics.track('due_date_set', {
    hasDate: !!event.detail.date,
    daysFromNow: event.detail.date 
      ? differenceInDays(event.detail.date, new Date())
      : null,
  });
  
  // Future: Calendar sync
  if (calendarIntegration.isEnabled()) {
    calendarIntegration.syncTodo(event.detail.todoId);
  }
});
```

## Technology Stack

### Date & Time Libraries

| Library | Version | Purpose | Justification |
|---------|---------|---------|---------------|
| **date-fns** | 3.6.0 | Date manipulation | Tree-shakeable, immutable, comprehensive |
| **chrono-node** | 2.7.0 | Natural language parsing | Best NLP date parser for JavaScript |
| **date-fns-tz** | 3.2.0 | Timezone support | Integrates with date-fns |

### UI Components

| Component | Implementation | Justification |
|-----------|----------------|---------------|
| **Date Picker** | Custom | Full control, accessibility, mobile optimization |
| **Calendar** | Custom with date-fns | Lightweight, customizable |
| **Time Picker** | Custom | Consistent with date picker |

### Browser APIs

| API | Usage | Fallback |
|-----|-------|----------|
| **Notifications API** | Reminders | In-app toasts |
| **Intl.DateTimeFormat** | Localization | date-fns locale |
| **Web Workers** | Background tasks | Main thread with throttling |

### Supporting Libraries

```json
{
  "dependencies": {
    "date-fns": "^3.6.0",
    "chrono-node": "^2.7.0",
    "date-fns-tz": "^3.2.0",
    "@floating-ui/react": "^0.26.0",  // Positioning date picker
    "react-aria": "^3.34.0"           // Accessibility
  },
  "devDependencies": {
    "@types/chrono-node": "^2.1.7",
    "mockdate": "^3.0.5"              // Testing time-based code
  }
}
```

## Design Decisions

### Key Architectural Decisions

#### 1. date-fns over Moment.js/Day.js
**Decision**: Use date-fns for date manipulation

**Rationale**:
- Tree-shakeable - only import what you use
- Immutable operations prevent bugs
- Excellent TypeScript support
- Native Date objects, no wrapper
- Smaller bundle size (2KB vs 20KB for typical usage)

**Trade-offs**:
- Less plugin ecosystem
- No built-in timezone database
- Requires more explicit imports

#### 2. Custom Date Picker over Library
**Decision**: Build custom date picker component

**Rationale**:
- Full control over accessibility
- Mobile-specific optimizations
- Consistent with app design
- Integrate quick dates seamlessly
- Smaller bundle than full libraries

**Trade-offs**:
- More development time
- Maintenance burden
- Less battle-tested

#### 3. Browser Notifications over Push
**Decision**: Use browser Notifications API for reminders

**Rationale**:
- No backend infrastructure needed
- Works offline once scheduled
- Simple permission model
- Native OS integration

**Trade-offs**:
- Requires browser to be running
- No mobile app notifications
- Limited customization

#### 4. UTC Storage Format
**Decision**: Store all dates as UTC ISO strings

**Rationale**:
- Timezone-agnostic storage
- Easy serialization
- Standard format
- Prevents DST issues

**Trade-offs**:
- Conversion needed for display
- Slightly more complex

### Alternative Approaches Considered

#### Date Library Alternatives
1. **Moment.js**: Too large, maintenance mode
2. **Day.js**: Good but smaller ecosystem
3. **Temporal API**: Not ready yet
4. **Native Date**: Insufficient utilities

#### Storage Alternatives
1. **Unix timestamps**: Less readable
2. **Local time strings**: Timezone issues
3. **Separate date/time**: More complex
4. **Moment objects**: Not serializable

#### UI Alternatives
1. **Native input[type="date"]**: Poor UX, inconsistent
2. **React-datepicker**: Too heavy
3. **Material UI picker**: Wrong design system
4. **Ant Design picker**: Too opinionated

## Deployment Considerations

### Environment Configuration

```typescript
// Environment variables
interface DateEnvironment {
  // Feature flags
  NEXT_PUBLIC_ENABLE_NATURAL_LANGUAGE: boolean;
  NEXT_PUBLIC_ENABLE_RECURRING_TASKS: boolean;
  NEXT_PUBLIC_ENABLE_NOTIFICATIONS: boolean;
  
  // Defaults
  NEXT_PUBLIC_DEFAULT_REMINDER_MINUTES: number;
  NEXT_PUBLIC_MAX_RECURRENCE_COUNT: number;
  
  // Timezone
  NEXT_PUBLIC_DEFAULT_TIMEZONE: string;
  NEXT_PUBLIC_DETECT_TIMEZONE: boolean;
}

// Configuration
export const dateConfig = {
  features: {
    naturalLanguage: process.env.NEXT_PUBLIC_ENABLE_NATURAL_LANGUAGE === 'true',
    recurringTasks: process.env.NEXT_PUBLIC_ENABLE_RECURRING_TASKS === 'true',
    notifications: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS === 'true',
  },
  defaults: {
    reminderMinutes: Number(process.env.NEXT_PUBLIC_DEFAULT_REMINDER_MINUTES) || 15,
    maxRecurrence: Number(process.env.NEXT_PUBLIC_MAX_RECURRENCE_COUNT) || 365,
  },
  timezone: {
    default: process.env.NEXT_PUBLIC_DEFAULT_TIMEZONE || 'UTC',
    autoDetect: process.env.NEXT_PUBLIC_DETECT_TIMEZONE !== 'false',
  },
};
```

### Progressive Enhancement

```typescript
// Feature detection and fallbacks
const DateFeatureDetection = {
  hasNotifications: 'Notification' in window,
  hasIntl: 'Intl' in window && 'DateTimeFormat' in window.Intl,
  hasWorkers: 'Worker' in window,
  
  // Provide fallbacks
  getDateFormatter(): (date: Date, options: any) => string {
    if (this.hasIntl) {
      return (date, options) => new Intl.DateTimeFormat(options.locale, options).format(date);
    }
    
    // Fallback to date-fns
    return (date, options) => format(date, options.format || 'PP', { locale: options.locale });
  },
  
  getNotificationService(): INotificationService {
    if (this.hasNotifications) {
      return new BrowserNotificationService();
    }
    
    // Fallback to in-app toasts
    return new ToastNotificationService();
  },
};
```

### Migration Strategy

```typescript
// Migrate existing todos to include date fields
interface DateMigration {
  version: number;
  migrate(todos: Todo[]): TodoWithDates[];
}

const dateMigrations: DateMigration[] = [
  {
    version: 2,
    migrate: (todos) => {
      return todos.map(todo => ({
        ...todo,
        dueDate: undefined,
        dueTime: false,
        reminder: undefined,
        recurring: undefined,
      }));
    },
  },
];

// Apply migrations
export const migrateTodosForDates = (
  todos: Todo[],
  fromVersion: number,
  toVersion: number
): TodoWithDates[] => {
  let migrated = todos;
  
  for (let v = fromVersion + 1; v <= toVersion; v++) {
    const migration = dateMigrations.find(m => m.version === v);
    if (migration) {
      migrated = migration.migrate(migrated);
    }
  }
  
  return migrated as TodoWithDates[];
};
```

### Bundle Optimization

```javascript
// next.config.js
module.exports = {
  webpack: (config) => {
    // Optimize date-fns imports
    config.resolve.alias['date-fns'] = 'date-fns/esm';
    
    // Code split date features
    config.optimization.splitChunks.cacheGroups.dates = {
      test: /[\\/]node_modules[\\/](date-fns|chrono-node)[\\/]/,
      name: 'dates',
      priority: 10,
      reuseExistingChunk: true,
    };
    
    return config;
  },
};
```

## Testing Strategy

### Unit Testing

```typescript
// Date utilities testing
describe('DateService', () => {
  beforeEach(() => {
    // Mock current date
    MockDate.set('2025-01-20T10:00:00.000Z');
  });
  
  afterEach(() => {
    MockDate.reset();
  });
  
  describe('parseNaturalDate', () => {
    it('should parse relative dates', () => {
      expect(parseNaturalDate('tomorrow')).toEqual(
        new Date('2025-01-21T00:00:00.000Z')
      );
    });
    
    it('should parse day names', () => {
      expect(parseNaturalDate('next friday')).toEqual(
        new Date('2025-01-24T00:00:00.000Z')
      );
    });
  });
  
  describe('formatDueDate', () => {
    it('should show relative time for near dates', () => {
      const tomorrow = new Date('2025-01-21T10:00:00.000Z');
      expect(formatDueDate(tomorrow)).toBe('Tomorrow');
    });
    
    it('should show overdue for past dates', () => {
      const yesterday = new Date('2025-01-19T10:00:00.000Z');
      expect(formatDueDate(yesterday)).toBe('1 day overdue');
    });
  });
});
```

### Component Testing

```typescript
// Date picker testing
describe('DatePicker', () => {
  it('should handle keyboard navigation', async () => {
    const onChange = jest.fn();
    const { getByRole } = render(
      <DatePicker value={null} onChange={onChange} />
    );
    
    const input = getByRole('textbox');
    await userEvent.click(input);
    
    // Navigate with arrow keys
    await userEvent.keyboard('{ArrowDown}'); // Open calendar
    await userEvent.keyboard('{ArrowRight}'); // Next day
    await userEvent.keyboard('{Enter}'); // Select
    
    expect(onChange).toHaveBeenCalledWith(
      expect.any(Date)
    );
  });
  
  it('should be accessible', async () => {
    const { container } = render(<DatePicker value={null} onChange={jest.fn()} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Integration Testing

```typescript
// Reminder system testing
describe('ReminderScheduler', () => {
  let scheduler: ReminderScheduler;
  
  beforeEach(() => {
    // Mock notifications
    global.Notification = jest.fn();
    global.Notification.permission = 'granted';
    global.Notification.requestPermission = jest.fn().mockResolvedValue('granted');
    
    scheduler = new ReminderScheduler();
  });
  
  it('should send notification at scheduled time', async () => {
    const todo = {
      id: '1',
      text: 'Test todo',
      dueDate: '2025-01-20T15:00:00.000Z',
      reminder: { enabled: true, timing: '1-hour' },
    };
    
    // Schedule reminder
    scheduler.scheduleReminder(todo);
    
    // Advance to reminder time
    MockDate.set('2025-01-20T14:00:00.000Z');
    scheduler.checkReminders();
    
    expect(global.Notification).toHaveBeenCalledWith(
      'Todo Reminder',
      expect.objectContaining({
        body: 'Test todo',
      })
    );
  });
});
```

## Future Enhancements

### Phase 2 Features
- Calendar widget integration
- Drag-and-drop date assignment  
- Time tracking integration
- Due date templates
- Batch date operations UI

### Phase 3 Features
- AI-powered scheduling suggestions
- Team deadline coordination
- Calendar app sync (Google, Outlook)
- Location-based reminders
- Smart recurring patterns

### Phase 4 Features
- Gantt chart view
- Task dependencies
- Critical path analysis
- Workload balancing
- Deadline prediction

---

**Document Version**: 1.0.0  
**Last Updated**: 2025-07-22  
**Next Review**: After Phase 1 implementation  
**Approval Required**: Technical Lead, Architecture Team