# Design Fixes for Austin FC Predictions App

## Priority 1: Fix Button Overlap

### Issue:
Selected buttons scale to 110%, causing overlap with adjacent buttons in the grid.

### Solution Options:

**Option A: Remove scale, use only color/border/shadow (RECOMMENDED)**
- More stable layout
- Better accessibility
- Still provides clear visual feedback
- No layout shift

**Option B: Increase gap and add isolation**
- Increase gap from gap-4 to gap-8
- Use `isolation: isolate` on button container
- More spacing needed overall

**Option C: Scale inward instead of outward**
- Use negative margins to compensate
- More complex CSS
- Still causes subtle layout shift

## Priority 2: Responsive Typography

### Issue:
text-6xl (60px) header is too large on mobile

### Fix:
```tsx
className="text-4xl sm:text-5xl lg:text-6xl"
```

## Priority 3: Accessibility

### Missing:
- Focus-visible styles for keyboard navigation
- Motion-safe preferences for animations
- ARIA labels on interactive elements

### Add:
```css
button:focus-visible {
  outline: 2px solid var(--verde);
  outline-offset: 4px;
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Priority 4: Mobile Optimization

### Issues:
- Button grid might be cramped on small screens
- No breakpoints for various screen sizes
- Submit button could be sticky at bottom

### Improvements:
- Add responsive gap sizing
- Consider stacking buttons on very small screens (< 375px)
- Make submit button sticky on scroll

## Priority 5: Visual Refinements

### Suggestions:
- Add subtle hover animation to cards (translateY instead of scale)
- Pulse animation on progress bar as it fills
- Smooth color transitions on buttons
- Add loading skeleton for initial question load
