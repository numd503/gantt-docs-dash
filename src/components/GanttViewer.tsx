import { useEffect, useRef, useState } from 'react';
import { GanttLibrary, FilterOptions } from '@/lib/ganttLibrary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

export const GanttViewer = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const ganttRef = useRef<GanttLibrary | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [availableFilters, setAvailableFilters] = useState({
    taskTypes: [] as string[],
    statuses: [] as string[],
    priorities: [] as string[],
    epics: [] as string[],
  });

  useEffect(() => {
    if (!timelineRef.current) return;

    ganttRef.current = new GanttLibrary({
      container: timelineRef.current,
      showFilters: true,
      showLegend: true,
    });

    // Load example data
    loadExampleData();

    return () => {
      ganttRef.current?.destroy();
    };
  }, []);

  const loadExampleData = async () => {
    try {
      await ganttRef.current?.loadFromExcel('/data/plan_example.xlsx');
      
      // Get unique values for filters
      if (ganttRef.current) {
        setAvailableFilters({
          taskTypes: ganttRef.current.getUniqueValues('taskType'),
          statuses: ganttRef.current.getUniqueValues('taskStatus'),
          priorities: ganttRef.current.getUniqueValues('priority'),
          epics: ganttRef.current.getUniqueValues('epicName'),
        });
      }
      
      setIsLoaded(true);
      toast.success('Gantt chart loaded successfully');
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load Gantt chart');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await ganttRef.current?.loadFromExcel(file);
      
      if (ganttRef.current) {
        setAvailableFilters({
          taskTypes: ganttRef.current.getUniqueValues('taskType'),
          statuses: ganttRef.current.getUniqueValues('taskStatus'),
          priorities: ganttRef.current.getUniqueValues('priority'),
          epics: ganttRef.current.getUniqueValues('epicName'),
        });
      }
      
      setIsLoaded(true);
      toast.success('File uploaded and processed');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to process file');
    }
  };

  const applyFilters = () => {
    ganttRef.current?.setFilters(filters);
    toast.success('Filters applied');
  };

  const clearFilters = () => {
    setFilters({});
    ganttRef.current?.setFilters({});
    toast.success('Filters cleared');
  };

  const addFilter = (type: keyof FilterOptions, value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: [...(prev[type] || []), value],
    }));
  };

  const removeFilter = (type: keyof FilterOptions, value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: (prev[type] || []).filter(v => v !== value),
    }));
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Project Timeline</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Label htmlFor="file-upload" className="cursor-pointer">
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Excel
                  </span>
                </Button>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </Label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {showFilters && (
            <div className="mb-4 p-4 border rounded-lg bg-muted/50 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Task Type</Label>
                  <Select onValueChange={(value) => addFilter('taskTypes', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFilters.taskTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Status</Label>
                  <Select onValueChange={(value) => addFilter('statuses', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFilters.statuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Priority</Label>
                  <Select onValueChange={(value) => addFilter('priorities', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFilters.priorities.map(priority => (
                        <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Epic</Label>
                  <Select onValueChange={(value) => addFilter('epics', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select epic" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFilters.epics.map(epic => (
                        <SelectItem key={epic} value={epic}>{epic}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Active filters */}
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters).map(([type, values]) =>
                  (values as string[]).map(value => (
                    <Badge key={`${type}-${value}`} variant="secondary" className="gap-1">
                      {value}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => removeFilter(type as keyof FilterOptions, value)}
                      />
                    </Badge>
                  ))
                )}
              </div>

              <div className="flex gap-2">
                <Button onClick={applyFilters} size="sm">
                  Apply Filters
                </Button>
                <Button onClick={clearFilters} variant="outline" size="sm">
                  Clear All
                </Button>
              </div>
            </div>
          )}

          <div className="gantt-container">
            <div ref={timelineRef} className="border rounded-lg bg-card" />
          </div>

          {!isLoaded && (
            <div className="text-center py-8 text-muted-foreground">
              Upload an Excel file or loading example data...
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded phase-analytics" />
              <span className="text-sm">Analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded phase-development" />
              <span className="text-sm">Development</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded phase-testing" />
              <span className="text-sm">Testing</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
