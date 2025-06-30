
# Color System Guidelines for AI Agents

## Brand Color Specifications

### Primary Brand Colors
- **Electric Indigo**: `#5A2EFF` - Primary brand color for CTAs, accents
- **Slate Gray**: `#3A3D4D` - Primary text color, dark elements  
- **Ice White**: `#FAFAFB` - Primary background, light text
- **Neon Mint**: `#30F2B3` - Success states, positive accents
- **Soft Coral**: `#FF6B6B` - Error states, warnings

### Color Usage Rules

#### ✅ DO Use These Colors
```css
/* Backgrounds */
bg-ice-white, bg-white, bg-electric-indigo, bg-neon-mint, bg-gray-50

/* Text Colors */  
text-slate-gray, text-electric-indigo, text-ice-white, text-gray-600

/* Borders */
border-gray-200, border-electric-indigo, border-neon-mint
```

#### ❌ NEVER Use These Colors
```css
/* Forbidden Colors */
bg-yellow-*, text-yellow-*, border-yellow-*
bg-orange-*, text-orange-*, border-orange-*  
bg-amber-*, text-amber-*, border-amber-*
bg-lime-*, text-lime-*, border-lime-*
```

## Component Color Standards

### Buttons
- **Primary**: `bg-electric-indigo text-ice-white hover:bg-electric-indigo/90`
- **Secondary**: `bg-white text-slate-gray border border-gray-200 hover:bg-gray-50`
- **Success**: `bg-neon-mint text-slate-gray hover:bg-neon-mint/90`
- **Destructive**: `bg-red-500 text-ice-white hover:bg-red-500/90`

### Cards & Containers
- **Default**: `bg-white border border-gray-200`
- **Elevated**: `bg-white shadow-lg border border-gray-100`
- **Muted**: `bg-gray-50 border border-gray-200`

### Text Hierarchy
- **Primary**: `text-slate-gray` (headings, important content)
- **Secondary**: `text-gray-600` (body text, descriptions)
- **Muted**: `text-gray-500` (captions, metadata)
- **Accent**: `text-electric-indigo` (links, highlights)

## Implementation Guidelines

### 1. Always Use Color Validation
```typescript
import { getColorCombination, safeColor } from '@/lib/color-validation';

// Use predefined combinations
const colors = getColorCombination('accent');

// Or use safe color utilities
className={safeColor.bg.primary}
```

### 2. CSS Variable Mapping
Our CSS variables are mapped to brand colors:
- `--primary: 90 46 255` (electric-indigo)
- `--background: 250 250 251` (ice-white)
- `--foreground: 58 61 77` (slate-gray)

### 3. Consistent Component Patterns
```tsx
// ✅ Good - Brand-aligned button
<Button className="bg-electric-indigo text-ice-white hover:bg-electric-indigo/90">
  Click me
</Button>

// ❌ Bad - Using system colors that may not align
<Button className="bg-primary text-primary-foreground">
  Click me
</Button>
```

## Quality Assurance

### Pre-Implementation Checklist
- [ ] All colors use approved brand palette
- [ ] No yellow, orange, or amber colors used
- [ ] Proper contrast ratios maintained
- [ ] Hover states use brand-aligned colors
- [ ] Colors tested in light mode

### Common Violations to Avoid
1. **System Color Fallbacks**: Never rely on CSS variable fallbacks
2. **Non-Brand Colors**: Avoid colors outside our brand palette
3. **Poor Contrast**: Ensure text is readable on backgrounds
4. **Inconsistent Hover States**: Use consistent hover color patterns

## Tools & Utilities

### Color Validation Functions
- `validateColorClass()` - Check if color class is approved
- `getColorCombination()` - Get consistent color schemes
- `auditColors()` - Find color violations in development

### Safe Color Objects
Use `safeColor` object for guaranteed brand-aligned colors:
```typescript
safeColor.bg.primary    // bg-ice-white
safeColor.text.accent   // text-electric-indigo  
safeColor.border.primary // border-gray-200
```
## Linting Guidelines

All code must pass the project's ESLint configuration (`eslint.config.js`). Run `npm run lint` locally and fix any issues before opening a PR. You can use `npm run lint -- --fix` to automatically fix simple problems.

## Testing Guidelines

Run the Jest test suite with Node.js 20:
```bash
npm test
```


## Emergency Color Reference

If you need to quickly fix a color issue:
1. **Replace yellow/orange**: Use `text-slate-gray` or `text-electric-indigo`
2. **Replace system backgrounds**: Use `bg-white` or `bg-ice-white`
3. **Replace system borders**: Use `border-gray-200`
4. **For CTAs**: Use `bg-electric-indigo text-ice-white`

Remember: **Consistency is key**. When in doubt, stick to the core brand colors and use the validation utilities.
