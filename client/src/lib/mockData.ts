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

// 5 Physical Schools + 4 Cabinet Areas
export const institutions: Institution[] = [
  // Physical Schools
  { id: 'SCHOOL-01', name: 'Blue River', category: 'School', owner: 'Dr. Michael Chen', status: 'Active' },
  { id: 'SCHOOL-02', name: 'Longview', category: 'School', owner: 'Dr. Patricia Williams', status: 'Active' },
  { id: 'SCHOOL-03', name: 'Maple Woods', category: 'School', owner: 'Dr. James Rodriguez', status: 'Active' },
  { id: 'SCHOOL-04', name: 'Penn Valley', category: 'School', owner: 'Dr. Sarah Johnson', status: 'Active' },
  { id: 'SCHOOL-05', name: 'Online', category: 'School', owner: 'Dr. Emily Martinez', status: 'Active' },
  // Cabinet Areas
  { id: 'CAB-01', name: 'MCC Online', category: 'Cabinet', owner: 'Dr. Thomas W. Meyer', status: 'Active' },
  { id: 'CAB-02', name: 'IERT', category: 'Cabinet', owner: 'Dr. John M. Chawana', status: 'Active' },
  { id: 'CAB-03', name: 'Instruction and Student Services', category: 'Cabinet', owner: 'Ms. Sue Gochis', status: 'Active' },
  { id: 'CAB-04', name: 'Community Engagement', category: 'Cabinet', owner: 'Dr. Larry Rideaux Jr.', status: 'Active' },
];

// Goals (A, B, C, D)
export const variables: Variable[] = [
  { id: 'GOAL-A', name: 'Goal A', category: 'Students, Alumni & Community', targetType: 'Maximize', greenThreshold: 0.95, yellowThreshold: 0.85 },
  { id: 'GOAL-B', name: 'Goal B', category: 'Organization', targetType: 'Maximize', greenThreshold: 0.9, yellowThreshold: 0.8 },
  { id: 'GOAL-C', name: 'Goal C', category: 'Resource Management', targetType: 'Maintain', greenThreshold: 0.05, yellowThreshold: 0.1 },
  { id: 'GOAL-D', name: 'Goal D', category: 'Employees', targetType: 'Maximize', greenThreshold: 1, yellowThreshold: 0.9 },
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
