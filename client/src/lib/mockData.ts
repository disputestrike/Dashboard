import { type PerformanceData, type Institution, type PerformanceVariable, type GanttTask } from '@shared/types';

// Cabinet Areas (Correct institutional names)
export const institutions: Institution[] = [
  // Cabinet Areas
  { id: 1, institutionId: 'CAB-01', name: 'Community and College Relations', category: 'Cabinet', owner: 'Dr. Larry Rideaux Jr.', status: 'Active', createdAt: new Date(), updatedAt: new Date() },
  { id: 2, institutionId: 'CAB-02', name: 'Administrative Services', category: 'Cabinet', owner: 'Dr. John M. Chawana', status: 'Active', createdAt: new Date(), updatedAt: new Date() },
  { id: 3, institutionId: 'CAB-03', name: 'Instruction and Student Services', category: 'Cabinet', owner: 'Ms. Sue Gochis', status: 'Active', createdAt: new Date(), updatedAt: new Date() },
  { id: 4, institutionId: 'CAB-04', name: 'IERT', category: 'Cabinet', owner: 'Dr. John M. Chawana', status: 'Active', createdAt: new Date(), updatedAt: new Date() },
  { id: 5, institutionId: 'CAB-05', name: 'MCC Online', category: 'Cabinet', owner: 'Dr. Thomas W. Meyer', status: 'Active', createdAt: new Date(), updatedAt: new Date() },
  
  // Campuses
  { id: 6, institutionId: 'SCH-01', name: 'Blue River Campus', category: 'Campus', owner: 'Campus Director', status: 'Active', createdAt: new Date(), updatedAt: new Date() },
  { id: 7, institutionId: 'SCH-02', name: 'Longview Campus', category: 'Campus', owner: 'Campus Director', status: 'Active', createdAt: new Date(), updatedAt: new Date() },
  { id: 8, institutionId: 'SCH-03', name: 'Maple Woods Campus', category: 'Campus', owner: 'Campus Director', status: 'Active', createdAt: new Date(), updatedAt: new Date() },
  { id: 9, institutionId: 'SCH-04', name: 'Penn Valley Campus', category: 'Campus', owner: 'Campus Director', status: 'Active', createdAt: new Date(), updatedAt: new Date() },
];

// Goals (A, B, C, D)
export const variables: PerformanceVariable[] = [
  { id: 1, variableId: 'GOAL-A', name: 'Goal A', category: 'A', description: 'Students, Alumni & Community', createdAt: new Date(), updatedAt: new Date() },
  { id: 2, variableId: 'GOAL-B', name: 'Goal B', category: 'B', description: 'Organization', createdAt: new Date(), updatedAt: new Date() },
  { id: 3, variableId: 'GOAL-C', name: 'Goal C', category: 'C', description: 'Resource Management', createdAt: new Date(), updatedAt: new Date() },
  { id: 4, variableId: 'GOAL-D', name: 'Goal D', category: 'D', description: 'Employees', createdAt: new Date(), updatedAt: new Date() },
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
          variableId: variable.id,
          month,
          year: 2026,
          baselineValue: targetValue.toString(),
          actualValue: actualValue.toString(),
          status,
          createdAt: new Date(),
          updatedAt: new Date(),
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
    assignedTo: 'Dr. John M. Chawana (Administrative Services)',
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
    assignedTo: 'Dr. Larry Rideaux Jr. (Community and College Relations)',
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
    assignedTo: 'Dr. John M. Chawana (Administrative Services)',
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
