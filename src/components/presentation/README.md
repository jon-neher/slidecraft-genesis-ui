/**
 * PRESENTATION SYSTEM DIRECTORY STRUCTURE
 * 
 * This file documents the organization of the presentation system.
 * Follow this structure to maintain consistency and avoid breaking changes.
 * 
 * /src/components/presentation/
 * ├── EnhancedSlideDeck.tsx          # Main component - mode router only
 * ├── PresentationController.tsx     # High-level controller (use this in pages)
 * ├── types.ts                       # TypeScript definitions
 * │
 * ├── modes/                         # Individual presentation modes
 * │   ├── PresentMode.tsx           # Fullscreen presentation view
 * │   ├── EditMode.tsx              # Drag-and-drop editor wrapper
 * │   ├── ViewMode.tsx              # Standard viewing mode
 * │   └── OverviewMode.tsx          # Grid overview of slides
 * │
 * ├── hooks/                         # Reusable state and logic
 * │   ├── usePresentationState.ts   # State management
 * │   ├── useKeyboardNavigation.ts  # Keyboard controls
 * │   └── usePresentationActions.ts # Common actions
 * │
 * ├── utils/                         # Pure utility functions
 * │   └── slideDataConverter.ts     # Puck <-> Slide conversion
 * │
 * ├── analytics/                     # Analytics components
 * │   ├── MetricsGrid.tsx
 * │   ├── EngagementChart.tsx
 * │   └── ActivityFeed.tsx
 * │
 * ├── settings/                      # Settings panels
 * │   └── (future settings components)
 * │
 * └── theme/                         # Theme customization
 *     └── (future theme components)
 * 
 * RULES FOR AI AGENTS:
 * 1. Keep components focused - one responsibility per file
 * 2. Use the hooks for shared logic across modes
 * 3. Put pure functions in utils/
 * 4. Don't merge mode components back into EnhancedSlideDeck
 * 5. Follow the established naming conventions
 * 6. Test the data converter when changing Puck integration
 */

// This is a documentation file - no exports needed
export {};