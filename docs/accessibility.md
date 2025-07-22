# Accessibility Guide

The Simple Todo application is designed with accessibility in mind, following WCAG 2.1 Level AA standards to ensure all users can effectively manage their tasks.

## Keyboard Navigation

### Global Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Navigate forward through interactive elements |
| `Shift + Tab` | Navigate backward through interactive elements |
| `Enter` | Activate buttons, submit forms, save edits |
| `Escape` | Cancel current action (clear input, cancel edit) |
| `Space` | Toggle checkboxes, activate buttons |

### Todo List Navigation

| Key | Action |
|-----|--------|
| `↑` Arrow Up | Focus previous todo item |
| `↓` Arrow Down | Focus next todo item |
| `Enter` | Start editing focused todo |
| `Escape` | Cancel editing |
| `Delete` | Delete todo (with confirmation) |

### Filter Navigation

The filter buttons support standard keyboard navigation:
- Use `Tab` to move between filters
- Use `Space` or `Enter` to select a filter
- Currently selected filter is announced to screen readers

## Screen Reader Support

### ARIA Labels

All interactive elements have appropriate ARIA labels:

```html
<!-- Todo checkbox -->
<input 
  type="checkbox" 
  aria-label="Mark 'Buy groceries' as completed"
/>

<!-- Delete button -->
<button 
  aria-label="Delete 'Buy groceries'"
>

<!-- Filter button -->
<button 
  role="tab" 
  aria-selected="true"
  aria-label="Show all todos (5)"
>
```

### Live Regions

Dynamic content updates are announced to screen readers:

```html
<!-- Todo count -->
<span aria-live="polite">3 items left</span>

<!-- List updates -->
<div role="list" aria-live="polite">
  <!-- Todo items -->
</div>
```

### Status Messages

Important status changes are announced:
- Todo added/deleted
- Filter changed
- Error messages
- Confirmation requests

## Focus Management

### Focus Indicators

All interactive elements have visible focus indicators:
- Blue outline for most elements
- High contrast (4.5:1 ratio)
- Never removed, only styled

### Focus Restoration

After destructive actions, focus is intelligently managed:
- After deleting a todo, focus moves to the next item
- After canceling an edit, focus returns to the todo item
- After clearing input with Escape, focus remains on input

## Color and Contrast

### Color Ratios

All text meets WCAG AA contrast requirements:
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- Interactive elements: 3:1 minimum

### Color Independence

Information is not conveyed by color alone:
- Completed todos use strikethrough AND opacity
- Errors use text AND icons
- States use multiple visual indicators

## Form Accessibility

### Input Labels

All form inputs have associated labels:

```html
<input
  type="text"
  placeholder="What needs to be done?"
  aria-label="New todo input"
  aria-invalid={!!error}
  aria-describedby={error ? 'todo-input-error' : undefined}
/>
```

### Error Handling

Error messages are properly associated:

```html
<input aria-describedby="todo-input-error" />
<p id="todo-input-error" role="alert">
  Todo text is required
</p>
```

### Character Count

Remaining character count is announced:

```html
<span aria-live="polite" aria-label="23 characters remaining">
  23
</span>
```

## Semantic HTML

The application uses semantic HTML elements:

```html
<header>
  <h1>Simple Todo</h1>
</header>

<main>
  <section aria-label="Todo input">
    <!-- Input form -->
  </section>
  
  <section aria-label="Todo list">
    <div role="list">
      <article role="listitem">
        <!-- Todo item -->
      </article>
    </div>
  </section>
</main>

<footer>
  <!-- Statistics and actions -->
</footer>
```

## Responsive Design

### Touch Targets

All interactive elements meet minimum size requirements:
- Minimum 44x44px touch targets
- Adequate spacing between targets
- Larger targets on mobile devices

### Zoom Support

The application supports up to 200% zoom:
- No horizontal scrolling
- All content remains accessible
- Text remains readable

## Testing Accessibility

### Automated Testing

Run accessibility tests:

```bash
npm run test:a11y
```

### Manual Testing

1. **Keyboard Testing**
   - Navigate entire app without mouse
   - Ensure all features accessible
   - Check focus indicators

2. **Screen Reader Testing**
   - Test with NVDA (Windows)
   - Test with JAWS (Windows)
   - Test with VoiceOver (macOS/iOS)
   - Test with TalkBack (Android)

3. **Color Testing**
   - Use Chrome DevTools color blindness simulation
   - Check contrast ratios
   - Verify information not color-dependent

### Browser Extensions

Recommended testing tools:
- axe DevTools
- WAVE (WebAIM)
- Lighthouse (Chrome DevTools)

## Common Accessibility Patterns

### Loading States

```tsx
<div role="status" aria-live="polite">
  <span className="sr-only">Loading todos...</span>
  <Spinner aria-hidden="true" />
</div>
```

### Empty States

```tsx
<div role="status">
  <p>No todos yet. Add one above!</p>
</div>
```

### Confirmations

```tsx
<button
  aria-label={
    showConfirm 
      ? "Confirm delete 'Buy groceries'" 
      : "Delete 'Buy groceries'"
  }
>
  {showConfirm ? 'Confirm?' : 'Delete'}
</button>
```

## Accessibility Checklist

Before releasing features, ensure:

- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible and clear
- [ ] ARIA labels on all controls
- [ ] Error messages associated with inputs
- [ ] Color contrast meets WCAG AA
- [ ] Screen reader tested
- [ ] No keyboard traps
- [ ] Focus management after actions
- [ ] Semantic HTML used
- [ ] Touch targets adequate size

## Future Improvements

### Planned Enhancements

1. **High Contrast Mode**
   - Detect and respect system preferences
   - Provide manual toggle

2. **Reduced Motion**
   - Respect prefers-reduced-motion
   - Disable animations when requested

3. **Voice Control**
   - Voice commands for common actions
   - Integration with assistive technologies

4. **Customization**
   - Font size controls
   - Color theme options
   - Layout preferences

## Resources

### Standards
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

### Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Learning
- [Web Accessibility Initiative](https://www.w3.org/WAI/)
- [A11y Project](https://www.a11yproject.com/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

## Reporting Issues

If you encounter accessibility issues:

1. Open an issue with the `accessibility` label
2. Include:
   - Description of the issue
   - Steps to reproduce
   - Assistive technology used
   - Expected behavior
   - Screenshots if applicable

We take accessibility seriously and will prioritize fixing any barriers to usage.