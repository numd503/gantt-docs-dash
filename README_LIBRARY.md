# Gantt Timeline Library

A lightweight JavaScript library for rendering interactive Gantt/timeline diagrams from Excel files. Designed for enterprise environments with minimal dependencies.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

✨ **Key Capabilities**
- 📊 Parse and visualize Excel project data
- 🔍 Advanced filtering (task type, status, priority, epic)
- 📅 Three-phase visualization (Analytics, Development, Testing)
- 🎨 Highly customizable styling
- 📱 Responsive and interactive timeline
- 📦 Minimal dependencies (vis-timeline + SheetJS)
- 📖 MkDocs documentation compatible
- 🏢 Enterprise-ready

## Quick Start

### Installation

```bash
npm install vis-timeline vis-data xlsx
```

### Basic Usage

```typescript
import { GanttLibrary } from './lib/ganttLibrary';

// Initialize
const gantt = new GanttLibrary({
  container: document.getElementById('timeline')!
});

// Load Excel file
await gantt.loadFromExcel('/path/to/data.xlsx');

// Apply filters
gantt.setFilters({
  taskTypes: ['PMP Q3'],
  priorities: ['Высокий']
});
```

### HTML Usage

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="gantt-library.css">
</head>
<body>
  <div id="timeline" style="height: 600px;"></div>
  
  <script src="gantt-library.js"></script>
  <script>
    const gantt = new GanttLibrary({
      container: document.getElementById('timeline')
    });
    gantt.loadFromExcel('data.xlsx');
  </script>
</body>
</html>
```

## Excel File Format

Your Excel file should include these columns:

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| Task Type | String | Yes | Project/task category |
| Epic Name | String | No | Epic or feature group |
| Task Name | String | Yes | Task title |
| Task Status | String | No | Current status |
| Приоритет | String | No | Priority level |
| Plan — Analytics — Start | Date | No | Analytics phase start |
| Plan — Analytics — End | Date | No | Analytics phase end |
| Plan — Development — Start | Date | No | Development phase start |
| Plan — Development — End | Date | No | Development phase end |
| Plan — Testing — Start | Date | No | Testing phase start |
| Plan — Testing — End | Date | No | Testing phase end |

**Supported Date Formats:**
- Excel serial dates
- DD/MM/YYYY strings

## API Reference

### Constructor

```typescript
new GanttLibrary(config: GanttConfig)
```

**GanttConfig:**
```typescript
interface GanttConfig {
  container: HTMLElement;        // DOM element for timeline
  showFilters?: boolean;         // Show filter UI
  showLegend?: boolean;          // Show phase legend
  defaultView?: 'month' | 'quarter' | 'year';
  locale?: string;               // Date locale
}
```

### Methods

#### `loadFromExcel(file: File | string): Promise<void>`
Load and parse Excel data.

```typescript
// From URL
await gantt.loadFromExcel('/data/project.xlsx');

// From File input
const file = fileInput.files[0];
await gantt.loadFromExcel(file);
```

#### `setFilters(filters: FilterOptions): void`
Apply filters to the timeline.

```typescript
gantt.setFilters({
  taskTypes: ['PMP Q3', 'PMP Q4'],
  statuses: ['Готово', 'В работе'],
  priorities: ['Высокий'],
  epics: ['Feature A', 'Feature B']
});
```

#### `getUniqueValues(field: keyof TaskData): string[]`
Get unique values for a field (useful for building filter UIs).

```typescript
const statuses = gantt.getUniqueValues('taskStatus');
const priorities = gantt.getUniqueValues('priority');
```

#### `destroy(): void`
Clean up and remove the timeline.

```typescript
gantt.destroy();
```

## MkDocs Integration

### Step 1: Build the Library

```bash
npm run build
```

### Step 2: Copy to MkDocs

```
docs/
  assets/
    gantt-library.js
    gantt-library.css
  data/
    project-plan.xlsx
```

### Step 3: Configure mkdocs.yml

```yaml
extra_javascript:
  - assets/gantt-library.js

extra_css:
  - assets/gantt-library.css

markdown_extensions:
  - attr_list
  - md_in_html
```

### Step 4: Use in Markdown

```markdown
# Project Timeline

<div id="gantt-container" style="height: 600px;"></div>

<script>
  const gantt = new GanttLibrary({
    container: document.getElementById('gantt-container')
  });
  gantt.loadFromExcel('../data/project-plan.xlsx');
</script>
```

## Customization

### CSS Styling

```css
/* Custom phase colors */
.vis-item.phase-analytics {
  background-color: #3498db !important;
}

.vis-item.phase-development {
  background-color: #2ecc71 !important;
}

.vis-item.phase-testing {
  background-color: #f39c12 !important;
}

/* Custom timeline appearance */
.vis-timeline {
  font-family: 'Inter', sans-serif !important;
}
```

### JavaScript Configuration

```typescript
const gantt = new GanttLibrary({
  container: document.getElementById('timeline')!,
  showFilters: true,
  showLegend: true,
  defaultView: 'quarter',
  locale: 'ru-RU'
});
```

## Examples

### Example 1: File Upload

```html
<input type="file" id="file-input" accept=".xlsx" />
<div id="timeline" style="height: 500px;"></div>

<script>
  const gantt = new GanttLibrary({
    container: document.getElementById('timeline')
  });
  
  document.getElementById('file-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) gantt.loadFromExcel(file);
  });
</script>
```

### Example 2: Dynamic Filters

```javascript
const gantt = new GanttLibrary({
  container: document.getElementById('timeline')
});

await gantt.loadFromExcel('data.xlsx');

// Build filter UI from data
const taskTypes = gantt.getUniqueValues('taskType');
const statuses = gantt.getUniqueValues('taskStatus');

// Apply selected filters
gantt.setFilters({
  taskTypes: selectedTypes,
  statuses: selectedStatuses
});
```

### Example 3: Multiple Timelines

```javascript
const ganttQ3 = new GanttLibrary({
  container: document.getElementById('timeline-q3')
});

const ganttQ4 = new GanttLibrary({
  container: document.getElementById('timeline-q4')
});

// Load same data with different filters
await Promise.all([
  ganttQ3.loadFromExcel('data.xlsx'),
  ganttQ4.loadFromExcel('data.xlsx')
]);

ganttQ3.setFilters({ taskTypes: ['PMP Q3'] });
ganttQ4.setFilters({ taskTypes: ['PMP Q4'] });
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- IE 11 (with polyfills)

## Dependencies

- **vis-timeline** (^7.7.0) - Timeline visualization
- **vis-data** (^7.1.0) - Data management
- **xlsx** (^0.18.0) - Excel parsing

## Documentation

- [Integration Guide](docs/INTEGRATION.md) - Detailed integration instructions
- [Examples](docs/EXAMPLES.md) - Complete usage examples
- [Live Demo](https://your-demo-url.com) - Interactive demonstration

## Troubleshooting

### Timeline not rendering
- Ensure container has defined height
- Check Excel file path is correct
- Verify console for errors

### Dates not parsing
- Use DD/MM/YYYY format or Excel dates
- Check column names match exactly
- Verify date columns contain valid dates

### MkDocs integration issues
- Verify script paths are correct
- Enable HTML/JavaScript in MkDocs config
- Check browser console for loading errors

## Performance Tips

1. **Large datasets**: Split into multiple files or use pagination
2. **Filtering**: Apply filters server-side for >1000 tasks
3. **Caching**: Cache parsed Excel data when possible
4. **Lazy loading**: Load timeline only when visible

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Add tests for new features
4. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details

## Support

- 📧 Email: support@example.com
- 📝 Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-repo/discussions)

## Acknowledgments

- [vis-timeline](https://github.com/visjs/vis-timeline) - Excellent timeline library
- [SheetJS](https://github.com/SheetJS/sheetjs) - Powerful Excel parser
- Enterprise teams providing requirements and feedback

---

**Built with ❤️ for enterprise project management**
