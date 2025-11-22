# Gantt Timeline Library Integration Guide

## Overview

This library provides a lightweight solution for rendering Gantt/timeline diagrams from Excel files. It uses minimal dependencies (vis-timeline and SheetJS) and can be embedded in MkDocs documentation.

## Features

- **Excel Data Import**: Parse structured XLSX files with project tasks
- **Three-Phase Visualization**: Analytics, Development, and Testing phases
- **Advanced Filtering**: Filter by task type, status, priority, and epic
- **Interactive Timeline**: Zoom, pan, and explore your project timeline
- **Minimal Dependencies**: Only vis-timeline and SheetJS required
- **MkDocs Compatible**: Easy embedding in static documentation

## Excel File Structure

Your Excel file should contain these columns:

| Column Name | Description | Required |
|------------|-------------|----------|
| Task Type | Category/project phase | Yes |
| Epic Name | Epic or feature group | Optional |
| Task Name | Task title | Yes |
| Task Status | Current status | Optional |
| Приоритет | Priority level | Optional |
| Plan — Analytics — Start | Analytics phase start date | Optional |
| Plan — Analytics — End | Analytics phase end date | Optional |
| Plan — Development — Start | Development phase start date | Optional |
| Plan — Development — End | Development phase end date | Optional |
| Plan — Testing — Start | Testing phase start date | Optional |
| Plan — Testing — End | Testing phase end date | Optional |

**Date Format**: Dates can be in Excel serial format or DD/MM/YYYY string format.

## Installation

### For React/TypeScript Projects

```bash
npm install vis-timeline vis-data xlsx
```

Then import and use:

```typescript
import { GanttLibrary } from './lib/ganttLibrary';

const gantt = new GanttLibrary({
  container: document.getElementById('timeline')!,
  showFilters: true,
  showLegend: true
});

await gantt.loadFromExcel('/path/to/data.xlsx');
```

### For MkDocs / Static HTML

1. **Build the standalone bundle**:
   ```bash
   npm run build
   ```

2. **Copy the built files** to your MkDocs `docs/` directory:
   ```
   docs/
     assets/
       gantt-library.js
       gantt-library.css
     data/
       your-project-data.xlsx
   ```

3. **Create a custom HTML page** or use MkDocs HTML blocks:

```html
<!-- In your markdown file or custom HTML -->
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="assets/gantt-library.css">
</head>
<body>
  <div id="gantt-container" style="width: 100%; height: 600px;"></div>
  
  <script src="assets/gantt-library.js"></script>
  <script>
    // Initialize the Gantt library
    const gantt = new GanttLibrary({
      container: document.getElementById('gantt-container'),
      showFilters: true,
      showLegend: true
    });
    
    // Load your Excel file
    gantt.loadFromExcel('data/your-project-data.xlsx')
      .then(() => console.log('Gantt loaded successfully'))
      .catch(err => console.error('Error loading Gantt:', err));
  </script>
</body>
</html>
```

## API Reference

### Constructor

```typescript
new GanttLibrary(config: GanttConfig)
```

**GanttConfig Options**:
- `container: HTMLElement` - DOM element to render the timeline
- `showFilters?: boolean` - Enable filter UI (default: false)
- `showLegend?: boolean` - Show phase legend (default: false)
- `defaultView?: 'month' | 'quarter' | 'year'` - Initial view (default: 'month')
- `locale?: string` - Locale for date formatting (default: browser locale)

### Methods

#### loadFromExcel(file: File | string)
Load data from an Excel file.

```typescript
// From URL
await gantt.loadFromExcel('/data/project.xlsx');

// From File input
const fileInput = document.getElementById('file-input') as HTMLInputElement;
const file = fileInput.files[0];
await gantt.loadFromExcel(file);
```

#### setFilters(filters: FilterOptions)
Apply filters to the timeline.

```typescript
gantt.setFilters({
  taskTypes: ['PMP Q3', 'PMP Q4'],
  statuses: ['Готово', 'В работе'],
  priorities: ['Высокий'],
  epics: ['Feature A']
});
```

#### getUniqueValues(field: keyof TaskData)
Get all unique values for a specific field (useful for building filter UIs).

```typescript
const allStatuses = gantt.getUniqueValues('taskStatus');
const allPriorities = gantt.getUniqueValues('priority');
```

#### destroy()
Clean up and remove the timeline.

```typescript
gantt.destroy();
```

## Customization

### CSS Customization

The library uses CSS custom properties for easy theming:

```css
/* Override phase colors */
.vis-item.phase-analytics {
  background-color: #3498db !important;
}

.vis-item.phase-development {
  background-color: #2ecc71 !important;
}

.vis-item.phase-testing {
  background-color: #f39c12 !important;
}

/* Customize timeline appearance */
.vis-timeline {
  font-family: 'Your Font', sans-serif !important;
}
```

### JavaScript Configuration

```typescript
// Advanced configuration example
const gantt = new GanttLibrary({
  container: document.getElementById('timeline')!,
  showFilters: true,
  showLegend: true,
  defaultView: 'quarter',
  locale: 'ru-RU'
});

// Programmatic filtering
gantt.setFilters({
  priorities: ['Высокий', 'Средний']
});

// Get filter options dynamically
const taskTypes = gantt.getUniqueValues('taskType');
console.log('Available task types:', taskTypes);
```

## MkDocs Integration Examples

### Example 1: Embedded in Markdown

Create a file `docs/gantt.md`:

```markdown
# Project Timeline

<div id="gantt-timeline" style="width: 100%; height: 600px; border: 1px solid #ddd;"></div>

<script src="../assets/gantt-library.js"></script>
<script>
  const gantt = new GanttLibrary({
    container: document.getElementById('gantt-timeline')
  });
  gantt.loadFromExcel('../data/project-plan.xlsx');
</script>
```

### Example 2: With Filter UI

```markdown
# Project Timeline with Filters

<div>
  <div style="margin-bottom: 20px;">
    <label>Task Type:
      <select id="task-type-filter">
        <option value="">All</option>
        <option value="PMP Q3">PMP Q3</option>
        <option value="PMP Q4">PMP Q4</option>
      </select>
    </label>
  </div>
  
  <div id="gantt-timeline" style="height: 600px;"></div>
</div>

<script src="../assets/gantt-library.js"></script>
<script>
  const gantt = new GanttLibrary({
    container: document.getElementById('gantt-timeline')
  });
  
  gantt.loadFromExcel('../data/project-plan.xlsx');
  
  document.getElementById('task-type-filter').addEventListener('change', (e) => {
    const value = e.target.value;
    gantt.setFilters(value ? { taskTypes: [value] } : {});
  });
</script>
```

## Troubleshooting

### Issue: Timeline not rendering
- Ensure the container element has a defined height
- Check that the Excel file path is correct
- Open browser console for error messages

### Issue: Dates not parsing correctly
- Verify date format in Excel (DD/MM/YYYY or Excel serial dates)
- Check column names match exactly (case-sensitive)

### Issue: MkDocs not loading JavaScript
- Ensure script files are in the correct relative path
- Check MkDocs configuration allows custom HTML/JavaScript
- Use browser network tab to verify file loading

## Performance Tips

1. **Large datasets**: Consider splitting data across multiple files
2. **Filtering**: Use server-side filtering for datasets >1000 tasks
3. **Caching**: Cache parsed Excel data if reloading frequently
4. **Lazy loading**: Load timeline only when visible on page

## License

This library uses:
- vis-timeline (Apache-2.0 / MIT)
- SheetJS (Apache-2.0)

## Support

For issues or questions:
1. Check the example Excel file format
2. Review API documentation above
3. Test with the provided demo application
4. Check browser console for errors
