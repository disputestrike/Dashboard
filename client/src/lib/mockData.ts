// Mock data for MCC Kansas City Performance Dashboard

export interface Institution {
  id: string;
  name: string;
  category: string;
  owner: string;
  status: 'Active' | 'Inactive';
}

export interface Variable {
  id: string;
  name: string;
  category: string;
  targetType: 'Maximize' | 'Minimize' | 'Maintain';
  greenThreshold: number;
  yellowThreshold: number;
}

export interface PerformanceData {
  recordId: string;
  institutionId: string;
  variableName: string;
  month: string;
  targetValue: number;
  actualValue: number;
  status: 'Green' | 'Yellow' | 'Red';
  lastUpdated: string;
}

export interface GanttTask {
  id: string;
  name: string;
  assignedTo: string;
  startDate: string;
  endDate: string;
  percentComplete: number;
  baselineStart: string;
  baselineEnd: string;
  status: 'Not Started' | 'In Progress' | 'Complete' | 'At Risk';
}

// 12 Institutions
export const institutions: Institution[] = [
  { id: 'MCC-KC-01', name: 'Penn Valley', category: 'Academic', owner: 'Dr. Sarah Johnson', status: 'Active' },
  { id: 'MCC-KC-02', name: 'Blue River', category: 'Academic', owner: 'Dr. Michael Chen', status: 'Active' },
  { id: 'MCC-KC-03', name: 'Longview', category: 'Academic', owner: 'Dr. Patricia Williams', status: 'Active' },
  { id: 'MCC-KC-04', name: 'Maple Woods', category: 'Academic', owner: 'Dr. James Rodriguez', status: 'Active' },
  { id: 'MCC-KC-05', name: 'Online', category: 'Academic', owner: 'Dr. Emily Martinez', status: 'Active' },
  { id: 'MCC-KC-06', name: 'Business & Technology', category: 'Operations', owner: 'Mr. David Thompson', status: 'Active' },
  { id: 'MCC-KC-07', name: 'Student Services Central', category: 'Student Services', owner: 'Ms. Lisa Anderson', status: 'Active' },
  { id: 'MCC-KC-08', name: 'Administrative Services', category: 'Admin', owner: 'Mr. Robert Davis', status: 'Active' },
  { id: 'MCC-KC-09', name: 'Financial Aid', category: 'Student Services', owner: 'Ms. Jennifer White', status: 'Active' },
  { id: 'MCC-KC-10', name: 'Human Resources', category: 'Admin', owner: 'Ms. Karen Brown', status: 'Active' },
  { id: 'MCC-KC-11', name: 'Information Technology', category: 'Operations', owner: 'Mr. Christopher Lee', status: 'Active' },
  { id: 'MCC-KC-12', name: 'Facilities Management', category: 'Operations', owner: 'Mr. Anthony Garcia', status: 'Active' },
];

// 10 Variables
export const variables: Variable[] = [
  { id: 'VAR-001', name: 'Enrollment Count', category: 'Academic', targetType: 'Maximize', greenThreshold: 0.95, yellowThreshold: 0.85 },
  { id: 'VAR-002', name: 'Retention Rate', category: 'Academic', targetType: 'Maximize', greenThreshold: 0.9, yellowThreshold: 0.8 },
  { id: 'VAR-003', name: 'Budget Variance', category: 'Financial', targetType: 'Maintain', greenThreshold: 0.05, yellowThreshold: 0.1 },
  { id: 'VAR-004', name: 'Compliance Audit Score', category: 'Compliance', targetType: 'Maximize', greenThreshold: 1, yellowThreshold: 0.9 },
  { id: 'VAR-005', name: 'Student Satisfaction', category: 'Student Services', targetType: 'Maximize', greenThreshold: 0.8, yellowThreshold: 0.7 },
  { id: 'VAR-006', name: 'Faculty Load', category: 'Academic', targetType: 'Maintain', greenThreshold: 0.9, yellowThreshold: 0.8 },
  { id: 'VAR-007', name: 'Grant Funding', category: 'Financial', targetType: 'Maximize', greenThreshold: 1, yellowThreshold: 0.8 },
  { id: 'VAR-008', name: 'Facility Utilization', category: 'Operations', targetType: 'Maximize', greenThreshold: 0.75, yellowThreshold: 0.6 },
  { id: 'VAR-009', name: 'IT Uptime', category: 'Operations', targetType: 'Maximize', greenThreshold: 0.99, yellowThreshold: 0.95 },
  { id: 'VAR-010', name: 'Employee Turnover', category: 'Admin', targetType: 'Minimize', greenThreshold: 0.1, yellowThreshold: 0.2 },
];

// Generate performance data for 12 months
export const generatePerformanceData = (): PerformanceData[] => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const data: PerformanceData[] = [];
  let recordId = 1;

  institutions.forEach((inst) => {
    variables.forEach((variable) => {
      months.forEach((month) => {
        const targetValue = Math.floor(Math.random() * 100) + 50;
        const variance = (Math.random() - 0.5) * 30;
        const actualValue = Math.floor(targetValue + variance);
        const performanceRatio = actualValue / targetValue;

        let status: 'Green' | 'Yellow' | 'Red' = 'Red';
        if (variable.targetType === 'Maximize') {
          if (performanceRatio >= variable.greenThreshold) status = 'Green';
          else if (performanceRatio >= variable.yellowThreshold) status = 'Yellow';
        } else if (variable.targetType === 'Minimize') {
          if (performanceRatio <= variable.greenThreshold) status = 'Green';
          else if (performanceRatio <= variable.yellowThreshold) status = 'Yellow';
        } else {
          if (Math.abs(performanceRatio - 1) <= variable.greenThreshold) status = 'Green';
          else if (Math.abs(performanceRatio - 1) <= variable.yellowThreshold) status = 'Yellow';
        }

        data.push({
          recordId: `REC-${recordId++}`,
          institutionId: inst.id,
          variableName: variable.name,
          month,
          targetValue,
          actualValue,
          status,
          lastUpdated: new Date(2026, Math.floor(Math.random() * 2), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        });
      });
    });
  });

  return data;
};

// Gantt tasks
export const ganttTasks: GanttTask[] = [
  {
    id: 'TASK-001',
    name: 'Enrollment Campaign Q1',
    assignedTo: 'Dr. Sarah Johnson',
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    percentComplete: 75,
    baselineStart: '2026-01-01',
    baselineEnd: '2026-03-31',
    status: 'In Progress',
  },
  {
    id: 'TASK-002',
    name: 'Retention Program Launch',
    assignedTo: 'Ms. Lisa Anderson',
    startDate: '2026-02-01',
    endDate: '2026-06-30',
    percentComplete: 50,
    baselineStart: '2026-02-01',
    baselineEnd: '2026-06-30',
    status: 'In Progress',
  },
  {
    id: 'TASK-003',
    name: 'Budget Reconciliation',
    assignedTo: 'Mr. Robert Davis',
    startDate: '2026-01-15',
    endDate: '2026-02-28',
    percentComplete: 100,
    baselineStart: '2026-01-15',
    baselineEnd: '2026-02-28',
    status: 'Complete',
  },
  {
    id: 'TASK-004',
    name: 'Compliance Audit Preparation',
    assignedTo: 'Dr. Patricia Williams',
    startDate: '2026-03-01',
    endDate: '2026-05-31',
    percentComplete: 30,
    baselineStart: '2026-03-01',
    baselineEnd: '2026-05-31',
    status: 'In Progress',
  },
  {
    id: 'TASK-005',
    name: 'IT Infrastructure Upgrade',
    assignedTo: 'Mr. Christopher Lee',
    startDate: '2026-04-01',
    endDate: '2026-08-31',
    percentComplete: 20,
    baselineStart: '2026-04-01',
    baselineEnd: '2026-08-31',
    status: 'In Progress',
  },
  {
    id: 'TASK-006',
    name: 'Faculty Development Program',
    assignedTo: 'Dr. Michael Chen',
    startDate: '2026-02-15',
    endDate: '2026-12-31',
    percentComplete: 40,
    baselineStart: '2026-02-15',
    baselineEnd: '2026-12-31',
    status: 'In Progress',
  },
];

// Calculate institutional health summary
export const calculateHealthSummary = (data: PerformanceData[]) => {
  const greenCount = data.filter((d) => d.status === 'Green').length;
  const yellowCount = data.filter((d) => d.status === 'Yellow').length;
  const redCount = data.filter((d) => d.status === 'Red').length;

  return {
    green: greenCount,
    yellow: yellowCount,
    red: redCount,
    total: data.length,
    healthPercentage: Math.round((greenCount / data.length) * 100),
  };
};
