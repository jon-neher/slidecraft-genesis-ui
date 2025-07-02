# Presentation System Database Schema

## Overview
The presentation system uses Supabase with the following key tables for slide management and version control.

## Core Tables

### presentations_generated
Main presentation metadata and status tracking.

```sql
CREATE TABLE presentations_generated (
  presentation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  context JSONB,
  generation_status presentation_status_enum DEFAULT 'pending',
  requested_at TIMESTAMPTZ DEFAULT now(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  generated_file_url TEXT,
  thumbnail_url TEXT
);
```

**RLS Policies**: User can only access their own presentations.

### presentations_revisions
Version-controlled slide data storage (Puck editor data).

```sql
CREATE TABLE presentations_revisions (
  presentation_id UUID NOT NULL REFERENCES presentations_generated(presentation_id),
  version INTEGER NOT NULL,
  slides JSONB NOT NULL, -- Puck editor data
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID NOT NULL,
  PRIMARY KEY (presentation_id, version)
);
```

**Critical Notes**:
- `slides` column stores Puck.js editor data as JSONB
- Version numbers auto-increment for each presentation
- Each save creates a new revision (no overwrites)

**RLS Policies**: Users can access revisions for their presentations.

## Data Flow Patterns

### Saving Presentations
```typescript
// 1. Get latest version
const { data: latestRevision } = await supabase
  .from("presentations_revisions")
  .select("version")
  .eq("presentation_id", id)
  .order("version", { ascending: false })
  .limit(1)
  .maybeSingle();

// 2. Increment version
const nextVersion = (latestRevision?.version || 0) + 1;

// 3. Insert new revision
const { error } = await supabase
  .from("presentations_revisions")
  .insert({
    presentation_id: id,
    slides: puckData, // Raw Puck editor data
    version: nextVersion,
    created_by: userId
  });
```

### Loading Presentations
```typescript
// Load latest revision
const { data: revision } = await supabase
  .from("presentations_revisions")
  .select("slides")
  .eq("presentation_id", id)
  .order("version", { ascending: false })
  .limit(1)
  .maybeSingle();

// Convert to presentation format
const slides = convertPuckToSlides(revision.slides);
```

## Integration Patterns

### Data Conversion
The system maintains separation between Puck editor data and presentation rendering:

- **Storage**: Raw Puck data in `presentations_revisions.slides`
- **Runtime**: Converted to `Slide[]` format for presentation
- **Converter**: `slideDataConverter.ts` handles the transformation

### Version Control
- Each edit creates a new revision
- No data loss - all versions preserved
- Users can potentially view revision history (future feature)

## Security Considerations

### Row Level Security (RLS)
All tables have RLS enabled with user-scoped policies:
- Users can only access their own presentations
- Users can only create revisions for their presentations
- Service role has full access for system operations

### Data Validation
- Presentation titles are required
- User IDs are validated against authentication
- JSONB slides data is flexible but should follow Puck schema

## Future Considerations

### Scaling
- Consider archiving old revisions for large presentations
- Implement revision cleanup policies
- Add indexing on frequently queried columns

### Features
- Revision comparison and rollback
- Collaborative editing with conflict resolution
- Presentation sharing and permissions
- Export format storage