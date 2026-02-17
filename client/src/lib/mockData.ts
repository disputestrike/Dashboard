import { type PerformanceData, type Institution, type Variable, type GanttTask } from '@shared/types';

// Cabinet Areas (replacing "Institutions")
export const institutions: Institution[] = [
  { id: 'CAB-01', name: 'MCC Online', category: 'Cabinet', owner: 'Dr. Thomas W. Meyer', status: 'Active' },
  { id: 'CAB-02', name: 'IERT', category: 'Cabinet', owner: 'Dr. John M. Chawana', status: 'Active' },
  { id: 'CAB-03', name: 'Instruction and Student Services', category: 'Cabinet', owner: 'Ms. Sue Gochis', status: 'Active' },
  { id: 'CAB-04', name: 'Community Engagement', category: 'Cabinet', owner: 'Dr. Larry Rideaux Jr.', status: 'Active' },
];

// Goals (A, B, C, D)
export const variables: Variable[] = [
  { id: 'GOAL-A', name: 'Goal A', category: 'A', targetType: 'Maximize', greenThreshold: 0.95, yellowThreshold: 0.85 },
  { id: 'GOAL-B', name: 'Goal B', category: 'B', targetType: 'Maximize', greenThreshold: 0.9, yellowThreshold: 0.8 },
  { id: 'GOAL-C', name: 'Goal C', category: 'C', targetType: 'Maintain', greenThreshold: 0.05, yellowThreshold: 0.1 },
  { id: 'GOAL-D', name: 'Goal D', category: 'D', targetType: 'Maximize', greenThreshold: 1, yellowThreshold: 0.9 },
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
        const actualValue = Math.floor(Math.random() * 100) + 40;
        const status = actualValue >= 85 ? 'Green' : actualValue >= 70 ? 'Yellow' : 'Red';

        data.push({
          id: recordId++,
          institutionId: inst.id,
          institutionName: inst.name,
          variableName: variable.name,
          month,
          targetValue,
          actualValue,
          status,
          percentageOfTarget: (actualValue / targetValue) * 100,
        });
      });
    });
  });

  return data;
};

// Gantt tasks - Real MCC Institutional Initiatives
export const ganttTasks: GanttTask[] = [
  {
    id: 'INIT-001',
    name: 'Goal A: Enhance MCC Brand & Student Experience',
    assignedTo: 'Dr. Thomas W. Meyer (MCC Online)',
    startDate: '2026-01-01',
    endDate: '2026-06-30',
    percentComplete: 65,
    baselineStart: '2026-01-01',
    baselineEnd: '2026-06-30',
    status: 'In Progress',
  },
  {
    id: 'INIT-002',
    name: 'Goal B: Student-Centered Decision Making',
    assignedTo: 'Dr. John M. Chawana (IERT)',
    startDate: '2026-02-01',
    endDate: '2026-08-31',
    percentComplete: 55,
    baselineStart: '2026-02-01',
    baselineEnd: '2026-08-31',
    status: 'In Progress',
  },
  {
    id: 'INIT-003',
    name: 'Goal C: Resource Management & Technology',
    assignedTo: 'Ms. Sue Gochis (Instruction & Student Services)',
    startDate: '2026-01-15',
    endDate: '2026-09-30',
    percentComplete: 45,
    baselineStart: '2026-01-15',
    baselineEnd: '2026-09-30',
    status: 'In Progress',
  },
  {
    id: 'INIT-004',
    name: 'Goal D: Destination Workplace Initiative',
    assignedTo: 'Dr. Larry Rideaux Jr. (Community Engagement)',
    startDate: '2026-03-01',
    endDate: '2026-12-31',
    percentComplete: 35,
    baselineStart: '2026-03-01',
    baselineEnd: '2026-12-31',
    status: 'In Progress',
  },
  {
    id: 'INIT-005',
    name: 'Institutional Effectiveness & Assessment',
    assignedTo: 'Dr. Thomas W. Meyer (MCC Online)',
    startDate: '2026-02-15',
    endDate: '2026-11-30',
    percentComplete: 50,
    baselineStart: '2026-02-15',
    baselineEnd: '2026-11-30',
    status: 'In Progress',
  },
  {
    id: 'INIT-006',
    name: 'Cabinet Area Alignment & Collaboration',
    assignedTo: 'Dr. John M. Chawana (IERT)',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    percentComplete: 60,
    baselineStart: '2026-01-01',
    baselineEnd: '2026-12-31',
    status: 'In Progress',
  },
];

// Calculate institutional health summary
export const calculateHealthSummary = (data: PerformanceData[]) => {
  const green = data.filter((d) => d.status === 'Green').length;
  const yellow = data.filter((d) => d.status === 'Yellow').length;
  const red = data.filter((d) => d.status === 'Red').length;
  const total = data.length || 1;

  return {
    green: Math.round((green / total) * 100),
    yellow: Math.round((yellow / total) * 100),
    red: Math.round((red / total) * 100),
    greenCount: green,
    yellowCount: yellow,
    redCount: red,
    total,
  };
};
