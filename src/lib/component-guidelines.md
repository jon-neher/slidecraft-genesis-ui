
# Component Color Guidelines - MANDATORY REQUIREMENTS

## Background Color Standards - ALWAYS REQUIRED

### Critical Rules (NEVER BREAK THESE)
1. **Every component MUST have an explicit background** - never rely on inheritance
2. **NEVER use yellow, amber, or orange colors** - these are forbidden
3. **Always test components in isolation** - they must work standalone
4. **Use BrandSafeContainer for all major containers**

### Mandatory Background Colors
```tsx
// ✅ REQUIRED - Always explicit backgrounds
<Card className="bg-white border border-gray-200">
  <CardContent className="bg-white">
    Content here
  </CardContent>
</Card>

// ✅ REQUIRED - Use BrandSafeContainer for major sections  
<BrandSafeContainer variant="primary">
  <div className="bg-white p-6">
    Content
  </div>
</BrandSafeContainer>

// ❌ FORBIDDEN - Never rely on CSS variables or inheritance
<Card className="bg-card">
  <CardContent>
    Content here
  </CardContent>
</Card>
```

### Component Creation Checklist - MANDATORY
Before creating/updating any component:

- [ ] Added explicit `bg-white` or `bg-ice-white` to main container
- [ ] Added explicit `text-slate-gray` for text color
- [ ] Used `border-gray-200` for borders
- [ ] NO yellow, amber, or orange colors anywhere
- [ ] Tested component in isolation
- [ ] Added BrandSafeContainer wrapper if it's a major section
- [ ] Verified no CSS variable fallbacks cause issues

### Safe Color Tokens - USE THESE ONLY
```tsx
// Backgrounds
bg-ice-white      // Primary app background
bg-white          // Card and container backgrounds  
bg-gray-50        // Muted backgrounds
bg-electric-indigo/5  // Subtle accent backgrounds

// Text
text-slate-gray   // Primary text
text-gray-600     // Secondary text
text-electric-indigo  // Accent text

// Borders  
border-gray-200   // Primary borders
border-electric-indigo // Accent borders
```

### Automated Enforcement
The system now includes:
- **Runtime color violation detection** - logs errors and adds visual indicators
- **Build-time color auditing** - prevents forbidden colors from shipping
- **Component wrappers** - automatically fix color violations in development
- **CSS overrides** - force safe defaults at the browser level

### Emergency Color Fix Protocol
If yellow appears anywhere:
1. Immediately add `bg-white` or `bg-ice-white` to the affected component
2. Check for missing explicit backgrounds in parent components
3. Verify no CSS variable fallbacks are causing issues
4. Use BrandSafeContainer wrapper as an additional safety layer

### Prevention Mechanisms Now Active
- Browser-level CSS overrides prevent yellow from ever appearing
- Development-time visual indicators show color violations immediately  
- Component wrappers automatically fix violations in development
- Build-time validation prevents violations from reaching production

## REMEMBER: NO EXCEPTIONS TO THESE RULES
Every component must follow these guidelines. The automated systems will catch violations, but following these rules from the start saves time and ensures brand consistency.
