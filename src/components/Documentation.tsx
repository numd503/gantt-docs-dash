import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, FileCode, BookOpen } from 'lucide-react';

export const Documentation = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Library Documentation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="quickstart" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
              <TabsTrigger value="api">API Reference</TabsTrigger>
              <TabsTrigger value="mkdocs">MkDocs Integration</TabsTrigger>
            </TabsList>

            <TabsContent value="quickstart" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Installation</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`npm install vis-timeline vis-data xlsx`}
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Basic Usage</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`import { GanttLibrary } from './lib/ganttLibrary';

const gantt = new GanttLibrary({
  container: document.getElementById('timeline')
});

// Load from Excel file
await gantt.loadFromExcel('/data/plan.xlsx');

// Apply filters
gantt.setFilters({
  taskTypes: ['PMP Q3'],
  priorities: ['Высокий']
});`}
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Excel File Format</h3>
                <p className="text-muted-foreground mb-2">
                  Your Excel file should contain these columns:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                  <li>Task Type</li>
                  <li>Epic Name</li>
                  <li>Task Name</li>
                  <li>Task Status</li>
                  <li>Приоритет (Priority)</li>
                  <li>Plan — Analytics — Start/End</li>
                  <li>Plan — Development — Start/End</li>
                  <li>Plan — Testing — Start/End</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="api" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Constructor</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`new GanttLibrary(config: GanttConfig)

interface GanttConfig {
  container: HTMLElement;
  showFilters?: boolean;
  showLegend?: boolean;
  defaultView?: 'month' | 'quarter' | 'year';
  locale?: string;
}`}
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Methods</h3>
                <div className="space-y-3">
                  <div className="bg-muted p-4 rounded-lg">
                    <code className="text-sm font-mono">loadFromExcel(file: File | string): Promise&lt;void&gt;</code>
                    <p className="text-sm text-muted-foreground mt-2">
                      Load data from an Excel file (File object or URL path).
                    </p>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <code className="text-sm font-mono">setFilters(filters: FilterOptions): void</code>
                    <p className="text-sm text-muted-foreground mt-2">
                      Apply filters to the timeline display.
                    </p>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <code className="text-sm font-mono">getUniqueValues(field: keyof TaskData): string[]</code>
                    <p className="text-sm text-muted-foreground mt-2">
                      Get all unique values for a specific field (useful for building filter UIs).
                    </p>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <code className="text-sm font-mono">destroy(): void</code>
                    <p className="text-sm text-muted-foreground mt-2">
                      Clean up and remove the timeline from the DOM.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Filter Options</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`interface FilterOptions {
  taskTypes?: string[];
  statuses?: string[];
  priorities?: string[];
  epics?: string[];
}`}
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="mkdocs" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Embedding in MkDocs</h3>
                <p className="text-muted-foreground mb-3">
                  To use this library in your MkDocs documentation:
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">1. Build the library</h4>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`npm run build`}
                    </pre>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">2. Copy assets to MkDocs</h4>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`docs/
  assets/
    gantt-library.js
    gantt-library.css
  data/
    your-project-data.xlsx`}
                    </pre>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">3. Create HTML in Markdown</h4>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`# Project Timeline

<div id="gantt-container" style="height: 600px;"></div>

<script src="../assets/gantt-library.js"></script>
<script>
  const gantt = new GanttLibrary({
    container: document.getElementById('gantt-container')
  });
  
  gantt.loadFromExcel('../data/project-plan.xlsx');
</script>`}
                    </pre>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">4. Update mkdocs.yml</h4>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`extra_javascript:
  - assets/gantt-library.js

extra_css:
  - assets/gantt-library.css

markdown_extensions:
  - attr_list
  - md_in_html`}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="bg-accent/20 p-4 rounded-lg border border-accent">
                <h4 className="font-medium mb-2">💡 Pro Tip</h4>
                <p className="text-sm text-muted-foreground">
                  For enterprise environments with limited internet access, ensure all dependencies
                  (vis-timeline, xlsx) are bundled into your build. The current setup uses a
                  minimal dependency approach perfect for restricted environments.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCode className="w-5 h-5" />
            Additional Resources
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-start gap-2">
            <Code className="w-4 h-4 mt-1 text-primary" />
            <div>
              <p className="font-medium">Integration Guide</p>
              <p className="text-sm text-muted-foreground">
                See <code>docs/INTEGRATION.md</code> for detailed integration instructions
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Code className="w-4 h-4 mt-1 text-primary" />
            <div>
              <p className="font-medium">Examples</p>
              <p className="text-sm text-muted-foreground">
                See <code>docs/EXAMPLES.md</code> for complete usage examples
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
