# Dynamic Index Pages - Technical Documentation

## Current State

### Page Hierarchy Model
The current schema uses **URL-based hierarchy** through slugs:
- Index pages: `sua-estadia`, `cafe-gastronomia`, `lazer-estrutura`
- Child pages: `sua-estadia/check-in`, `cafe-gastronomia/cafe-da-manha`

### Implementation: URL Prefix Matching
We've implemented `get_index_pages` Edge Function that uses URL prefix matching:

```sql
-- Get child pages using prefix
SELECT * FROM pages 
WHERE slug LIKE 'sua-estadia/%'
AND status = 'published';
```

### Navigation Structure
- `navigation_nodes` table stores top-level navigation items
- No explicit parent_id for child pages in navigation
- Pages are linked via `page_id` in navigation_nodes

### Available Tables for Index Pages

| Table | Purpose |
|-------|---------|
| `pages` | Page metadata (title, slug, template) |
| `page_routes` | URL routing for pages |
| `navigation_nodes` | Primary navigation items |
| `content_blocks` | Page content (used for some index pages) |

## When to Add parent_id

The current URL-prefix approach works but has limitations:

### Limitations of URL Prefix Matching
1. **No explicit hierarchy** - Can't easily query "all children of X"
2. **Slug coupling** - Renaming parent requires updates everywhere
3. **Complex queries** - Need string manipulation for hierarchy
4. **No ordering** - Can't control child display order via parent

### Benefits of Adding parent_id
```sql
-- Schema change
ALTER TABLE guest_guide.pages 
ADD COLUMN parent_id UUID REFERENCES guest_guide.pages(id);

-- Query becomes simple
SELECT * FROM pages 
WHERE parent_id = 'parent-uuid'
ORDER BY sort_order;
```

### When to Make This Change
1. **When adding many nested pages** - Complex hierarchies benefit
2. **When needing page reordering** - parent_id + sort_order enables drag-drop
3. **When building admin UI** - Explicit hierarchy is easier to manage
4. **When decoupling slugs** - Allow different URL from parent relationship

### Recommendation
**Keep current approach for now** if:
- Only 1-2 levels of depth
- Few index pages (5-7)
- Slugs are stable (rarely renamed)

**Add parent_id** when:
- Building multi-level hierarchies (3+ levels)
- Need admin UI for page management
- Want drag-drop page ordering
- Slugs need to be flexible

## Current Implementation

### Edge Function: get_index_pages
```typescript
// Request
{ property_id: string, slug: string, locale?: string }

// Response
{
  parent: { slug, title, description },
  children: [{ slug, title, description, template }]
}
```

### Frontend Component: DynamicIndexPage
- Fetches index data from API
- Falls back to static subcategories
- Uses color mapping for visual consistency

## Migration Path

1. Current: URL prefix matching ✅
2. Next: Add parent_id column (optional)
3. Future: Build admin UI with drag-drop
