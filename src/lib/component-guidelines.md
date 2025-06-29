
# Component Color Guidelines

## Background Color Standards

### Always Use Explicit Backgrounds
- Never rely on CSS variable fallbacks for critical UI elements
- Always specify `bg-white` or appropriate background class
- Test components in isolation to ensure proper backgrounds

### Card Components
```tsx
// ✅ Good - Explicit background
<Card className="bg-white border border-gray-200">
  <CardContent className="bg-white">
    Content here
  </CardContent>
</Card>

// ❌ Bad - Relying on CSS variables that might fallback
<Card className="bg-card">
  <CardContent>
    Content here
  </CardContent>
</Card>
```

### Color Token Usage
Always use the color validation utility:
```tsx
import { getColorCombination } from '@/lib/color-validation';

const colors = getColorCombination('default');
// Guaranteed consistent color scheme
```

### Testing Checklist
- [ ] Component has explicit background color
- [ ] Component tested in light/dark modes
- [ ] Component tested on different screen sizes
- [ ] No yellow or unexpected colors appearing
- [ ] Proper contrast ratios maintained

### Prevention Rules
1. Never use `bg-card` without explicit override
2. Always test new components individually
3. Use color tokens from validation utility
4. Document any custom color usage
5. Regular color audit of existing components
