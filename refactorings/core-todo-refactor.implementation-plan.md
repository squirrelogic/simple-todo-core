# Core Todo Refactoring Implementation Plan

## Executive Summary

This implementation plan addresses all 14 issues identified in the `core-todo.refactor.md` analysis. The plan is organized into three phases based on priority and complexity, with an estimated timeline of 3 weeks for full implementation.

## Status Overview

| Phase | Priority | Issues Addressed | Estimated Time | Status |
|-------|----------|-----------------|----------------|---------|
| Phase 1 | High | 2 critical issues | Week 1 | ✅ Completed |
| Phase 2 | Medium | 6 issues | Week 2 | 🚧 In Progress (66% complete) |
| Phase 3 | Low | 6 issues | Week 3 | 📋 Pending |

## Phase 1: Critical Issues (Week 1)

### 1.1 Fix Race Condition in TodoInput Component ✅

**Issue**: Component checks `storeError` immediately after calling `addTodo`, but state updates may not be synchronous

**Status**: ✅ COMPLETED - Implemented in commit 97cac81

**Implementation Plan**:

1. **Refactor `addTodo` action** (Day 1)
   ```typescript
   // Current: void return
   addTodo: (title: string) => void
   
   // New: Promise with result
   addTodo: (title: string) => Promise<{ success: boolean; error?: string }>
   ```

2. **Update TodoInput component** (Day 1)
   - Convert to async handling
   - Add loading state during submission
   - Handle success/failure properly
   - Only clear input on success

3. **Add proper error feedback** (Day 2)
   - Create toast notification system
   - Show user-friendly error messages
   - Add retry capability

**Files to modify**:
- `src/stores/todos/todo-store.ts`
- `src/components/todos/TodoInput.tsx`
- New: `src/components/ui/Toast.tsx`

**Tests to add**:
- Async action tests
- Error state handling tests
- UI feedback tests

### 1.2 Add Error Boundaries ✅

**Issue**: No error boundaries to catch and handle runtime errors

**Status**: ✅ COMPLETED - Implemented in commit 97cac81

**Implementation Plan**:

1. **Create base ErrorBoundary component** (Day 3)
   ```typescript
   // src/components/errors/ErrorBoundary.tsx
   - Generic error boundary with fallback UI
   - Error logging capability
   - Reset functionality
   ```

2. **Create specialized boundaries** (Day 4)
   - `TodoErrorBoundary`: For todo-specific errors
   - `AppErrorBoundary`: For app-level errors
   - `RouteErrorBoundary`: For routing errors

3. **Implement error recovery strategies** (Day 5)
   - Automatic retry for transient errors
   - Manual reset option
   - Error reporting to monitoring service
   - Graceful degradation

**New files**:
- `src/components/errors/ErrorBoundary.tsx`
- `src/components/errors/TodoErrorBoundary.tsx`
- `src/components/errors/AppErrorBoundary.tsx`
- `src/lib/errors/error-reporter.ts`

**Integration points**:
- Wrap TodoList in TodoErrorBoundary
- Wrap App in AppErrorBoundary
- Add to critical component trees

## Phase 2: Medium Priority Issues (Week 2)

### 2.1 Decompose TodoItem Component ✅

**Issue**: Component exceeds 50 lines and handles multiple responsibilities

**Status**: ✅ COMPLETED - Implemented in commit 97cac81

**Implementation Plan**:

1. **Extract TodoCheckbox component** (Day 1)
   ```typescript
   // src/components/todos/TodoCheckbox.tsx
   interface TodoCheckboxProps {
     checked: boolean
     onChange: (checked: boolean) => void
     disabled?: boolean
   }
   ```

2. **Extract TodoText component** (Day 1)
   ```typescript
   // src/components/todos/TodoText.tsx
   - Handle display mode
   - Handle edit mode
   - Manage focus states
   ```

3. **Extract TodoActions component** (Day 2)
   ```typescript
   // src/components/todos/TodoActions.tsx
   - Edit/Save/Cancel buttons
   - Delete button
   - Consistent styling
   ```

4. **Create compound component pattern** (Day 2)
   ```typescript
   // Refactored TodoItem using composition
   <Todo.Container>
     <Todo.Checkbox />
     <Todo.Text />
     <Todo.Actions />
   </Todo.Container>
   ```

5. **Extract custom hooks** (Day 3)
   - `useKeyboardNavigation`: Handle keyboard shortcuts
   - `useTodoEdit`: Manage edit state
   - `useTodoActions`: Handle todo operations

**Benefits**:
- Each component under 30 lines
- Single responsibility
- Easier to test
- Better reusability

### 2.2 Implement Store Middleware Pattern ✅

**Issue**: Repeated `persistState()` calls in every action

**Status**: ✅ COMPLETED - Implemented in commit 97cac81

**Implementation Plan**:

1. **Create middleware system** (Day 3)
   ```typescript
   // src/stores/middleware/types.ts
   type Middleware = (store: StoreApi) => (next: StateCreator) => StateCreator
   ```

2. **Implement persistence middleware** (Day 4)
   ```typescript
   // src/stores/middleware/persistence.ts
   - Auto-persist after state changes
   - Debounce for performance
   - Handle storage errors
   ```

3. **Add development middleware** (Day 4)
   ```typescript
   // src/stores/middleware/logger.ts
   - Action logging
   - State diff visualization
   - Performance metrics
   ```

4. **Create middleware composer** (Day 5)
   ```typescript
   // src/stores/middleware/compose.ts
   - Combine multiple middleware
   - Proper execution order
   - Type safety
   ```

**Migration strategy**:
- Remove manual `persistState()` calls
- Apply middleware to store creation
- Maintain backward compatibility

### 2.3 Standardize Error Handling 🚧

**Issue**: Inconsistent error handling patterns across codebase

**Status**: 🚧 IN PROGRESS

**Implementation Plan**:

1. **Define error types** (Day 5)
   ```typescript
   // src/types/errors.ts
   - ValidationError
   - StorageError
   - NetworkError
   - UnknownError
   ```

2. **Create error utilities** (Day 5)
   ```typescript
   // src/lib/errors/error-utils.ts
   - Error factory functions
   - Error type guards
   - Error serialization
   ```

3. **Implement consistent handling**
   - All async operations use try/catch
   - All errors have user-friendly messages
   - All errors are properly typed

## Phase 3: Low Priority Enhancements (Week 3)

### 3.1 Performance Optimizations ✅

**Status**: ✅ COMPLETED

1. **Add memoization** (Day 1)
   - Memoize `getFilteredTodos`
   - Memoize `getStats`
   - Use React.memo for components

2. **Implement virtual scrolling** (Day 2)
   - For lists > 100 items
   - Maintain scroll position
   - Smooth scrolling

3. **Add code splitting** (Day 2)
   - Lazy load features
   - Route-based splitting
   - Component-level splitting

### 3.2 Documentation & Testing ✅

**Status**: ✅ COMPLETED

1. **Add JSDoc comments** (Day 3)
   - All public APIs
   - Complex functions
   - Component props

2. **Create Storybook stories** (Day 4)
   - Component variations
   - Error states
   - Loading states

3. **Add integration tests** (Day 4)
   - User workflows
   - Error scenarios
   - Performance tests

### 3.3 Developer Experience ✅

**Status**: ✅ COMPLETED

1. **Create dev utilities** (Day 5)
   - Debug helpers
   - Performance profiler
   - State inspector

2. **Add feature flags** (Day 5)
   - Runtime toggling
   - A/B testing support
   - Gradual rollout

3. **Create migration guides**
   - Breaking change documentation
   - Code examples
   - Automated codemods

## Implementation Guidelines

### For each refactoring:

1. **Before starting**:
   - Review current implementation
   - Write tests for current behavior
   - Document breaking changes

2. **During implementation**:
   - Follow existing code style
   - Maintain backward compatibility
   - Add comprehensive tests
   - Update documentation

3. **After completion**:
   - Run full test suite
   - Check performance impact
   - Update CHANGELOG
   - Create migration guide

### Success Criteria

- [ ] All tests pass
- [ ] No performance regression
- [ ] Code coverage maintained/improved
- [ ] Documentation updated
- [ ] Lint rules pass
- [ ] TypeScript strict mode compatible

## Risk Mitigation

1. **Breaking Changes**
   - Use feature flags for gradual rollout
   - Provide compatibility layer
   - Clear migration path

2. **Performance Impact**
   - Benchmark before/after
   - Profile critical paths
   - Optimize hot paths

3. **User Experience**
   - A/B test major changes
   - Gather user feedback
   - Rollback strategy

## Rollout Strategy

1. **Development Environment** (Week 1)
   - Full implementation
   - Internal testing
   - Performance profiling

2. **Staging Environment** (Week 2)
   - Integration testing
   - Load testing
   - Security review

3. **Production** (Week 3)
   - Gradual rollout (10% → 50% → 100%)
   - Monitor error rates
   - Track performance metrics

## Monitoring & Metrics

### Track these metrics:
- Error boundary trigger rate
- Performance metrics (FCP, TTI)
- Bundle size changes
- Test coverage percentage
- User engagement metrics

## Conclusion

This comprehensive refactoring plan addresses all identified issues while maintaining code quality and user experience. The phased approach allows for gradual implementation with proper testing and rollback capabilities at each stage.

## Next Steps

1. Review and approve plan
2. Set up tracking dashboard
3. Begin Phase 1 implementation
4. Daily progress updates
5. Weekly stakeholder reviews