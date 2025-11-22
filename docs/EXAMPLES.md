# Gantt Library Usage Examples

## Basic Examples

### 1. Simple Timeline

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="gantt-library.css">
</head>
<body>
  <div id="timeline" style="height: 500px;"></div>
  
  <script src="gantt-library.js"></script>
  <script>
    const gantt = new GanttLibrary({
      container: document.getElementById('timeline')
    });
    
    gantt.loadFromExcel('project-data.xlsx');
  </script>
</body>
</html>
```

### 2. Timeline with File Upload

```html
<input type="file" id="file-input" accept=".xlsx" />
<div id="timeline" style="height: 500px;"></div>

<script>
  const gantt = new GanttLibrary({
    container: document.getElementById('timeline')
  });
  
  document.getElementById('file-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      gantt.loadFromExcel(file)
        .then(() => alert('Timeline loaded!'))
        .catch(err => alert('Error: ' + err.message));
    }
  });
</script>
```

### 3. Timeline with Predefined Filters

```javascript
const gantt = new GanttLibrary({
  container: document.getElementById('timeline'),
  showFilters: true
});

await gantt.loadFromExcel('data.xlsx');

// Apply initial filters
gantt.setFilters({
  taskTypes: ['PMP Q3'],
  priorities: ['Высокий', 'Средний']
});
```

## Advanced Examples

### 4. Dynamic Filter UI

```html
<div>
  <h3>Filters</h3>
  <div id="filters"></div>
  <button id="apply-filters">Apply Filters</button>
  <button id="clear-filters">Clear Filters</button>
</div>
<div id="timeline" style="height: 600px;"></div>

<script>
  const gantt = new GanttLibrary({
    container: document.getElementById('timeline')
  });
  
  let selectedFilters = {};
  
  gantt.loadFromExcel('data.xlsx').then(() => {
    // Build filter UI dynamically
    const filterContainer = document.getElementById('filters');
    
    // Task Type filter
    const taskTypes = gantt.getUniqueValues('taskType');
    const taskTypeSelect = createMultiSelect('Task Type', taskTypes);
    filterContainer.appendChild(taskTypeSelect);
    
    // Status filter
    const statuses = gantt.getUniqueValues('taskStatus');
    const statusSelect = createMultiSelect('Status', statuses);
    filterContainer.appendChild(statusSelect);
    
    // Priority filter
    const priorities = gantt.getUniqueValues('priority');
    const prioritySelect = createMultiSelect('Priority', priorities);
    filterContainer.appendChild(prioritySelect);
  });
  
  function createMultiSelect(label, options) {
    const div = document.createElement('div');
    div.innerHTML = `<label>${label}:</label>`;
    
    const select = document.createElement('select');
    select.multiple = true;
    select.style.width = '200px';
    select.style.height = '100px';
    
    options.forEach(opt => {
      const option = document.createElement('option');
      option.value = opt;
      option.textContent = opt;
      select.appendChild(option);
    });
    
    div.appendChild(select);
    return div;
  }
  
  document.getElementById('apply-filters').addEventListener('click', () => {
    // Collect selected filters
    const filters = {};
    // Add filter collection logic
    gantt.setFilters(filters);
  });
  
  document.getElementById('clear-filters').addEventListener('click', () => {
    gantt.setFilters({});
  });
</script>
```

### 5. Multiple Timelines

```html
<h2>Q3 Timeline</h2>
<div id="timeline-q3" style="height: 400px;"></div>

<h2>Q4 Timeline</h2>
<div id="timeline-q4" style="height: 400px;"></div>

<script>
  const ganttQ3 = new GanttLibrary({
    container: document.getElementById('timeline-q3')
  });
  
  const ganttQ4 = new GanttLibrary({
    container: document.getElementById('timeline-q4')
  });
  
  // Load same data but apply different filters
  Promise.all([
    ganttQ3.loadFromExcel('data.xlsx'),
    ganttQ4.loadFromExcel('data.xlsx')
  ]).then(() => {
    ganttQ3.setFilters({ taskTypes: ['PMP Q3'] });
    ganttQ4.setFilters({ taskTypes: ['PMP Q4'] });
  });
</script>
```

### 6. Custom Styling

```html
<style>
  /* Custom color scheme */
  .vis-item.phase-analytics {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  }
  
  .vis-item.phase-development {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) !important;
  }
  
  .vis-item.phase-testing {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%) !important;
  }
  
  /* Custom timeline background */
  .vis-panel.vis-background {
    background: linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%) !important;
  }
  
  /* Custom item hover effect */
  .vis-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
    transition: all 0.2s ease;
  }
</style>
```

### 7. Integration with MkDocs Material Theme

```markdown
# Project Timeline

!!! note "Interactive Timeline"
    Use the filters below to customize your view

<div style="background: var(--md-code-bg-color); padding: 20px; border-radius: 4px;">
  <div id="gantt-filters" style="margin-bottom: 20px;">
    <select id="status-filter" style="padding: 5px 10px;">
      <option value="">All Statuses</option>
      <option value="Готово">Готово</option>
      <option value="В работе">В работе</option>
      <option value="Бэклог">Бэклог</option>
    </select>
  </div>
  
  <div id="timeline" style="height: 600px; background: white; border-radius: 4px;"></div>
</div>

<script src="../assets/gantt-library.js"></script>
<script>
  const gantt = new GanttLibrary({
    container: document.getElementById('timeline')
  });
  
  gantt.loadFromExcel('../data/project-plan.xlsx');
  
  document.getElementById('status-filter').addEventListener('change', (e) => {
    const status = e.target.value;
    gantt.setFilters(status ? { statuses: [status] } : {});
  });
</script>
```

### 8. Responsive Timeline

```html
<div id="timeline-container">
  <div id="timeline"></div>
</div>

<script>
  let gantt;
  
  function initTimeline() {
    const container = document.getElementById('timeline');
    const width = document.getElementById('timeline-container').offsetWidth;
    
    // Set height based on screen size
    container.style.height = window.innerWidth < 768 ? '400px' : '600px';
    
    gantt = new GanttLibrary({
      container: container,
      defaultView: window.innerWidth < 768 ? 'year' : 'quarter'
    });
    
    gantt.loadFromExcel('data.xlsx');
  }
  
  // Initialize on load
  initTimeline();
  
  // Reinitialize on resize (debounced)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      gantt.destroy();
      initTimeline();
    }, 250);
  });
</script>
```

## MkDocs Configuration

Add to your `mkdocs.yml`:

```yaml
extra_javascript:
  - assets/gantt-library.js

extra_css:
  - assets/gantt-library.css

markdown_extensions:
  - attr_list
  - md_in_html
```

## Tips for Production Use

1. **Minify your bundle**: Use tools like Terser for production builds
2. **CDN hosting**: Host vis-timeline and xlsx from CDN for better caching
3. **Lazy loading**: Only load the library on pages that use it
4. **Error handling**: Always wrap loadFromExcel in try-catch
5. **Loading indicators**: Show spinners while data loads
6. **Browser support**: Test in target browsers (IE11+ with polyfills)

## Common Patterns

### Pattern 1: Save/Load User Filters

```javascript
// Save filters to localStorage
function saveFilters(filters) {
  localStorage.setItem('gantt-filters', JSON.stringify(filters));
}

// Load filters from localStorage
function loadFilters() {
  const saved = localStorage.getItem('gantt-filters');
  return saved ? JSON.parse(saved) : {};
}

// Usage
const savedFilters = loadFilters();
gantt.setFilters(savedFilters);

// Listen for filter changes
document.getElementById('apply-filters').addEventListener('click', () => {
  const filters = getCurrentFilters(); // Your filter collection logic
  saveFilters(filters);
  gantt.setFilters(filters);
});
```

### Pattern 2: Export Timeline as Image

```javascript
// Note: Requires html2canvas library
async function exportTimeline() {
  const canvas = await html2canvas(document.getElementById('timeline'));
  const link = document.createElement('a');
  link.download = 'timeline.png';
  link.href = canvas.toDataURL();
  link.click();
}
```

### Pattern 3: Print-Friendly View

```css
@media print {
  .gantt-filters,
  .gantt-controls {
    display: none;
  }
  
  #timeline {
    height: auto !important;
    page-break-inside: avoid;
  }
  
  .vis-item {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
}
```
