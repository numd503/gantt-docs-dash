# Gantt Timeline Library - MkDocs Integration

## Quick Start

This library renders interactive Gantt charts from Excel files in MkDocs documentation sites.

## Excel File Format

**Required columns**: Task Type, Task Name  
**Optional columns**: Epic Name, Task Status, Приоритет, Production Deadline, Plan — Analytics — Start/End, Plan — Development — Start/End, Plan — Testing — Start/End  
**Date format**: Excel serial or DD/MM/YYYY

**Release file** (optional): Release, DevCutDate columns

## MkDocs Integration

### 1. Build the UMD Bundle

```bash
npm run build -- --mode library
```

This creates `dist/gantt-library.js` and `dist/gantt-library.css` as browser-compatible UMD bundles that work directly in the browser.

### 2. Setup MkDocs

Copy files to your MkDocs directory:
```
docs/
  assets/
    gantt-library.js      # from dist/
    gantt-library.css     # from dist/
  data/
    tasks.xlsx            # your project data
    releases.xlsx         # optional release schedule
```

### 3. Embed in Markdown

Create `docs/timeline.md`:

```html
# Project Timeline

<link rel="stylesheet" href="../assets/gantt-library.css">

<!-- Controls (file upload, releases toggle, filters) -->
<div id="gantt-controls"></div>

<!-- Filters panel (hidden by default) -->
<div id="gantt-filters-container" style="display: none;"></div>

<!-- Timeline container -->
<div id="timeline" style="width: 100%; height: 600px;"></div>

<!-- Legend -->
<div id="gantt-legend"></div>

<script src="../assets/gantt-library.js"></script>
<script>
  // Initialize GanttLibrary
  const gantt = new window.GanttLibrary({
    container: document.getElementById('timeline'),
    maxTaskNameLength: 50,
    colors: {
      analytics: '#6366f1',
      development: '#8b5cf6', 
      testing: '#10b981',
      releases: '#f59e0b'
    }
  });
  
  // Render UI controls (file upload, releases toggle, filter button)
  gantt.renderControls(document.getElementById('gantt-controls'));
  
  // Render legend
  gantt.renderLegend(document.getElementById('gantt-legend'));
  
  // Optional: Load data automatically on page load
  gantt.loadFromExcel('../data/tasks.xlsx');
</script>
```

## Configuration Options

```typescript
new GanttLibrary({
  container: HTMLElement,           // Required: DOM element
  maxTaskNameLength: 50,            // Max characters for task names
  showFilters: false,               // Show filter UI
  showLegend: false,                // Show phase legend
  showReleases: false,              // Show release timeline
  colors: {                         // Custom phase colors (HSL)
    analytics: '#6366f1',
    development: '#8b5cf6',
    testing: '#10b981',
    releases: '#f59e0b'
  }
})
```

## Key Methods

### Data Loading
- `loadFromExcel(file)` - Load tasks from Excel file or URL
- `loadReleasesFromExcel(file)` - Load release schedule from Excel file or URL

### Filtering & Display
- `setFilters(filters)` - Apply task filters programmatically
- `setShowReleases(show)` - Toggle release timeline visibility

### UI Rendering (for MkDocs integration)
- `renderControls(container)` - Render file upload buttons, releases toggle, and filter button
- `renderFilters(container)` - Render filter panel with dropdowns for task type, status, priority, epic
- `renderLegend(container)` - Render phase legend

### Utility
- `getUniqueValues(field)` - Get unique values for a specific field (useful for custom filters)
- `destroy()` - Clean up timeline instance

## CSS Customization

Override phase colors in your MkDocs `extra.css`:

```css
.vis-item.phase-analytics { background-color: #6366f1 !important; }
.vis-item.phase-development { background-color: #8b5cf6 !important; }
.vis-item.phase-testing { background-color: #10b981 !important; }
.vis-item.phase-releases { background-color: #f59e0b !important; }
```

## Troubleshooting

**"GanttLibrary is not defined"**: Ensure you built with `--mode library` flag  
**Timeline not rendering**: Container needs explicit height (e.g., `height: 600px`)  
**Wrong file paths**: Use relative paths from your markdown file location  
**Dates not parsing**: Use DD/MM/YYYY format or Excel serial dates
