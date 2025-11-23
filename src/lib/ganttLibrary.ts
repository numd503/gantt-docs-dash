import { DataSet } from 'vis-data';
import { Timeline } from 'vis-timeline';
import * as XLSX from 'xlsx';
import 'vis-timeline/styles/vis-timeline-graph2d.css';

export interface TaskData {
  taskType: string;
  epicName: string;
  taskName: string;
  taskStatusFull: string;
  taskStatus: string;
  priority: string;
  effort: string;
  isAnalytical: boolean;
  assignee: string;
  analyticsStart?: Date;
  analyticsEnd?: Date;
  developmentStart?: Date;
  developmentEnd?: Date;
  testingStart?: Date;
  testingEnd?: Date;
}

export interface ReleaseData {
  release: string;
  devCutDate: Date;
}

export interface GanttConfig {
  container: HTMLElement;
  showFilters?: boolean;
  showLegend?: boolean;
  defaultView?: 'month' | 'quarter' | 'year';
  locale?: string;
  labelWidth?: string; // Width of the task name labels (e.g., '25%', '300px')
  maxTaskNameLength?: number; // Maximum characters for task names
  colors?: {
    analytics?: string; // CSS color for Analytics phase
    development?: string; // CSS color for Development phase
    testing?: string; // CSS color for Testing phase
    release?: string; // CSS color for Release boxes
  };
  showReleases?: boolean; // Whether to show release schedule
}

export interface FilterOptions {
  taskTypes?: string[];
  statuses?: string[];
  priorities?: string[];
  epics?: string[];
}

export class GanttLibrary {
  private timeline: Timeline | null = null;
  private dataSet: DataSet<any> | null = null;
  private rawData: TaskData[] = [];
  private releaseData: ReleaseData[] = [];
  private container: HTMLElement;
  private config: GanttConfig;
  private filters: FilterOptions = {};

  constructor(config: GanttConfig) {
    this.container = config.container;
    this.config = {
      labelWidth: '25%',
      maxTaskNameLength: 50,
      showReleases: false,
      colors: {
        analytics: '#6366f1', // Vibrant indigo
        development: '#8b5cf6', // Vibrant purple
        testing: '#10b981', // Vibrant green
        release: '#f59e0b', // Vibrant orange for releases
      },
      ...config,
    };
    this.applyCustomColors();
  }

  private applyCustomColors(): void {
    // Inject custom colors as CSS variables
    const style = document.createElement('style');
    style.id = 'gantt-custom-colors';
    const existingStyle = document.getElementById('gantt-custom-colors');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    style.innerHTML = `
      .vis-item.phase-analytics {
        background-color: ${this.config.colors?.analytics} !important;
        color: white !important;
      }
      .vis-item.phase-development {
        background-color: ${this.config.colors?.development} !important;
        color: white !important;
      }
      .vis-item.phase-testing {
        background-color: ${this.config.colors?.testing} !important;
        color: white !important;
      }
      .vis-item.phase-release {
        background-color: ${this.config.colors?.release} !important;
        color: white !important;
        font-weight: 600 !important;
      }
    `;
    document.head.appendChild(style);
  }

  async loadFromExcel(file: File | string): Promise<void> {
    let arrayBuffer: ArrayBuffer;

    if (typeof file === 'string') {
      // Load from URL
      const response = await fetch(file);
      arrayBuffer = await response.arrayBuffer();
    } else {
      // Load from File object
      arrayBuffer = await file.arrayBuffer();
    }

    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet);

    this.rawData = this.parseExcelData(jsonData);
    this.render();
  }

  async loadReleasesFromExcel(file: File | string): Promise<void> {
    let arrayBuffer: ArrayBuffer;

    if (typeof file === 'string') {
      const response = await fetch(file);
      arrayBuffer = await response.arrayBuffer();
    } else {
      arrayBuffer = await file.arrayBuffer();
    }

    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet);

    this.releaseData = this.parseReleaseData(jsonData);
    this.render();
  }

  private parseReleaseData(data: any[]): ReleaseData[] {
    return data.map((row: any) => ({
      release: String(row['Release'] || ''),
      devCutDate: this.parseDate(row['DevCutDate']) || new Date(),
    })).filter(r => r.release && r.devCutDate);
  }

  private parseExcelData(data: any[]): TaskData[] {
    return data.map((row: any) => ({
      taskType: row['Task Type'] || '',
      epicName: row['Epic Name'] || '',
      taskName: row['Task Name'] || '',
      taskStatusFull: row['Task Status Full'] || '',
      taskStatus: row['Task Status'] || '',
      priority: row['Приоритет'] || '',
      effort: row['Ожидаемые трудозатраты'] || '',
      isAnalytical: row['Аналитическая задача'] === true || row['Аналитическая задача'] === 'True',
      assignee: row['Response'] || '',
      analyticsStart: this.parseDate(row['Plan — Analytics — Start']),
      analyticsEnd: this.parseDate(row['Plan — Analytics — End']),
      developmentStart: this.parseDate(row['Plan — Development — Start']),
      developmentEnd: this.parseDate(row['Plan — Development — End']),
      testingStart: this.parseDate(row['Plan — Testing — Start']),
      testingEnd: this.parseDate(row['Plan — Testing — End']),
    }));
  }

  private parseDate(dateValue: any): Date | undefined {
    if (!dateValue) return undefined;
    
    if (dateValue instanceof Date) return dateValue;
    
    // Handle Excel serial dates
    if (typeof dateValue === 'number') {
      const date = XLSX.SSF.parse_date_code(dateValue);
      return new Date(date.y, date.m - 1, date.d);
    }
    
    // Handle string dates
    if (typeof dateValue === 'string') {
      const parts = dateValue.split('/');
      if (parts.length === 3) {
        return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      }
    }
    
    return undefined;
  }

  setFilters(filters: FilterOptions): void {
    this.filters = filters;
    this.render();
  }

  setShowReleases(show: boolean): void {
    this.config.showReleases = show;
    this.render();
  }

  private getFilteredData(): TaskData[] {
    let filtered = [...this.rawData];

    if (this.filters.taskTypes && this.filters.taskTypes.length > 0) {
      filtered = filtered.filter(task => this.filters.taskTypes!.includes(task.taskType));
    }

    if (this.filters.statuses && this.filters.statuses.length > 0) {
      filtered = filtered.filter(task => this.filters.statuses!.includes(task.taskStatus));
    }

    if (this.filters.priorities && this.filters.priorities.length > 0) {
      filtered = filtered.filter(task => this.filters.priorities!.includes(task.priority));
    }

    if (this.filters.epics && this.filters.epics.length > 0) {
      filtered = filtered.filter(task => this.filters.epics!.includes(task.epicName));
    }

    return filtered;
  }

  private render(): void {
    const filteredData = this.getFilteredData();
    const items: any[] = [];
    const groups: any[] = [];
    const groupMap = new Map<string, number>();

    let groupId = 0;

    // Add Release schedule as the first row if enabled
    if (this.config.showReleases && this.releaseData.length > 0) {
      const releaseGroupKey = 'releases';
      groupMap.set(releaseGroupKey, groupId);
      groups.push({
        id: groupId,
        content: `<div class="task-label"><strong>Releases</strong></div>`,
      });
      
      // Create release boxes
      for (let i = 0; i < this.releaseData.length; i++) {
        const currentRelease = this.releaseData[i];
        const previousRelease = i > 0 ? this.releaseData[i - 1] : null;
        
        const startDate = previousRelease ? previousRelease.devCutDate : currentRelease.devCutDate;
        const endDate = currentRelease.devCutDate;
        
        items.push({
          id: `release-${currentRelease.release}`,
          group: groupId,
          content: `Release ${currentRelease.release}`,
          start: startDate,
          end: endDate,
          className: 'phase-release',
          title: `Release ${currentRelease.release}<br/>DevCutDate: ${endDate.toLocaleDateString()}`,
          type: 'range',
        });
      }
      
      groupId++;
    }

    filteredData.forEach((task, index) => {
      // Each task gets its own group to ensure stages appear consecutively on the same row
      const groupKey = `${task.epicName || 'Без эпика'} - ${task.taskName}`;
      
      if (!groupMap.has(groupKey)) {
        groupMap.set(groupKey, groupId);
        
        // Truncate task name if too long
        const maxLength = this.config.maxTaskNameLength || 50;
        const truncatedTaskName = task.taskName.length > maxLength 
          ? task.taskName.substring(0, maxLength) + '...' 
          : task.taskName;
        
        groups.push({
          id: groupId,
          content: `<div class="task-label"><strong title="${task.taskName}">${truncatedTaskName}</strong><br/><small>${task.epicName || 'Без эпика'}</small></div>`,
        });
        groupId++;
      }

      const currentGroupId = groupMap.get(groupKey)!;

      // Add Analytics phase
      if (task.analyticsStart && task.analyticsEnd) {
        items.push({
          id: `${index}-analytics`,
          group: currentGroupId,
          content: 'Analytics',
          start: task.analyticsStart,
          end: task.analyticsEnd,
          className: 'phase-analytics',
          title: this.createTooltip(task, 'Analytics'),
          type: 'range',
        });
      }

      // Add Development phase (should start after Analytics)
      if (task.developmentStart && task.developmentEnd) {
        items.push({
          id: `${index}-development`,
          group: currentGroupId,
          content: 'Development',
          start: task.developmentStart,
          end: task.developmentEnd,
          className: 'phase-development',
          title: this.createTooltip(task, 'Development'),
          type: 'range',
        });
      }

      // Add Testing phase (should start after Development)
      if (task.testingStart && task.testingEnd) {
        items.push({
          id: `${index}-testing`,
          group: currentGroupId,
          content: 'Testing',
          start: task.testingStart,
          end: task.testingEnd,
          className: 'phase-testing',
          title: this.createTooltip(task, 'Testing'),
          type: 'range',
        });
      }
    });

    this.dataSet = new DataSet(items);
    const groupsDataSet = new DataSet(groups);

    const options = {
      stack: false, // Don't stack items - each task's stages appear on the same row
      orientation: 'top',
      showCurrentTime: true,
      zoomMin: 1000 * 60 * 60 * 24 * 7, // 1 week
      zoomMax: 1000 * 60 * 60 * 24 * 365 * 2, // 2 years
      margin: {
        item: 10,
      },
      width: '100%',
      groupOrder: 'id', // Maintain order
    };

    if (this.timeline) {
      this.timeline.destroy();
    }

    this.timeline = new Timeline(this.container, this.dataSet, groupsDataSet, options);
  }

  private createTooltip(task: TaskData, phase: string): string {
    return `
      <strong>${task.taskName}</strong><br/>
      Phase: ${phase}<br/>
      Status: ${task.taskStatus}<br/>
      Priority: ${task.priority}<br/>
      ${task.assignee ? `Assignee: ${task.assignee}<br/>` : ''}
      Epic: ${task.epicName || 'N/A'}
    `;
  }

  getUniqueValues(field: keyof TaskData): string[] {
    const values = new Set<string>();
    this.rawData.forEach(task => {
      const value = task[field];
      if (value && typeof value === 'string') {
        values.add(value);
      }
    });
    return Array.from(values).sort();
  }

  destroy(): void {
    if (this.timeline) {
      this.timeline.destroy();
      this.timeline = null;
    }
  }
}
