// Real MCC Reimagined 2031 Data Structure

export interface Initiative {
  id: string;
  name: string;
  goal: 'A' | 'B' | 'C' | 'D';
  subBoxes: SubBox[];
  status: 'green' | 'yellow' | 'red';
  lead: string;
  progress: number;
}

export interface SubBox {
  id: string;
  label: string;
  status: 'complete' | 'in-progress' | 'pending';
  notes: string;
}

export interface Goal {
  id: 'A' | 'B' | 'C' | 'D';
  name: string;
  description: string;
  initiatives: Initiative[];
}

export interface CabinetArea {
  id: string;
  name: string;
  lead: string;
}

// CABINET AREAS
export const cabinetAreas: CabinetArea[] = [
  { id: 'online', name: 'MCC Online', lead: 'Dr. Thomas W. Meyer' },
  { id: 'iert', name: 'IERT', lead: 'Dr. John M. Chawana' },
  { id: 'iss', name: 'Instruction and Student Services', lead: 'Ms. Sue Gochis' },
  { id: 'ce', name: 'Community Engagement', lead: 'Dr. Larry Rideaux Jr.' },
];

// GOAL A: STUDENTS, ALUMNI & COMMUNITY
const goalAInitiatives: Initiative[] = [
  {
    id: 'a1',
    name: 'Enhance MCC\'s brand using holistic student experiences as an expanded community asset',
    goal: 'A',
    status: 'green',
    lead: 'Ms. Sue Gochis',
    progress: 75,
    subBoxes: [
      { id: 'a1-1', label: 'Community Engagement Activities', status: 'in-progress', notes: '' },
      { id: 'a1-2', label: 'Brand Awareness Metrics', status: 'in-progress', notes: '' },
      { id: 'a1-3', label: 'Student Experience Programs', status: 'in-progress', notes: '' },
      { id: 'a1-4', label: 'Alumni Involvement', status: 'pending', notes: '' },
    ],
  },
  {
    id: 'a2',
    name: 'Establish a mindset for early career identification',
    goal: 'A',
    status: 'green',
    lead: 'Ms. Sue Gochis',
    progress: 60,
    subBoxes: [
      { id: 'a2-1', label: 'Career Pathway Programs', status: 'in-progress', notes: '' },
      { id: 'a2-2', label: 'Student Awareness Campaigns', status: 'in-progress', notes: '' },
      { id: 'a2-3', label: 'Employer Partnerships', status: 'pending', notes: '' },
      { id: 'a2-4', label: 'Outcome Tracking', status: 'pending', notes: '' },
    ],
  },
  {
    id: 'a3',
    name: 'Bridge community and alumni',
    goal: 'A',
    status: 'yellow',
    lead: 'Dr. Larry Rideaux Jr.',
    progress: 45,
    subBoxes: [
      { id: 'a3-1', label: 'Alumni Engagement Events', status: 'in-progress', notes: '' },
      { id: 'a3-2', label: 'Community Partnerships', status: 'pending', notes: '' },
      { id: 'a3-3', label: 'Mentorship Programs', status: 'pending', notes: '' },
      { id: 'a3-4', label: 'Feedback & Outcomes', status: 'pending', notes: '' },
    ],
  },
  {
    id: 'a4',
    name: 'Expand high-impact practices to become a student-ready college',
    goal: 'A',
    status: 'green',
    lead: 'Ms. Sue Gochis',
    progress: 70,
    subBoxes: [
      { id: 'a4-1', label: 'High-Impact Practice Implementation', status: 'in-progress', notes: '' },
      { id: 'a4-2', label: 'Student Success Metrics', status: 'in-progress', notes: '' },
      { id: 'a4-3', label: 'Support Services', status: 'in-progress', notes: '' },
      { id: 'a4-4', label: 'Retention & Completion', status: 'in-progress', notes: '' },
    ],
  },
];

// GOAL B: ORGANIZATION
const goalBInitiatives: Initiative[] = [
  {
    id: 'b1',
    name: 'Build a world-class first impression experience',
    goal: 'B',
    status: 'green',
    lead: 'Dr. Tyjaun A. Lee',
    progress: 65,
    subBoxes: [
      { id: 'b1-1', label: 'Enrollment Experience Design', status: 'in-progress', notes: '' },
      { id: 'b1-2', label: 'Student Onboarding', status: 'in-progress', notes: '' },
      { id: 'b1-3', label: 'Campus Facilities', status: 'pending', notes: '' },
      { id: 'b1-4', label: 'Satisfaction Metrics', status: 'pending', notes: '' },
    ],
  },
  {
    id: 'b2',
    name: 'Demonstrate student-focused decision making',
    goal: 'B',
    status: 'yellow',
    lead: 'Dr. John M. Chawana',
    progress: 50,
    subBoxes: [
      { id: 'b2-1', label: 'Data-Driven Decisions', status: 'in-progress', notes: '' },
      { id: 'b2-2', label: 'Student Feedback Integration', status: 'in-progress', notes: '' },
      { id: 'b2-3', label: 'Policy Changes', status: 'pending', notes: '' },
      { id: 'b2-4', label: 'Impact Assessment', status: 'pending', notes: '' },
    ],
  },
  {
    id: 'b3',
    name: 'Implement a student-centered approach',
    goal: 'B',
    status: 'green',
    lead: 'Ms. Sue Gochis',
    progress: 72,
    subBoxes: [
      { id: 'b3-1', label: 'Curriculum Alignment', status: 'in-progress', notes: '' },
      { id: 'b3-2', label: 'Service Delivery', status: 'in-progress', notes: '' },
      { id: 'b3-3', label: 'Student Voice Mechanisms', status: 'in-progress', notes: '' },
      { id: 'b3-4', label: 'Continuous Improvement', status: 'in-progress', notes: '' },
    ],
  },
  {
    id: 'b4',
    name: 'Provide high-quality programs & services',
    goal: 'B',
    status: 'green',
    lead: 'Dr. Thomas W. Meyer',
    progress: 68,
    subBoxes: [
      { id: 'b4-1', label: 'Program Quality Standards', status: 'in-progress', notes: '' },
      { id: 'b4-2', label: 'Service Excellence', status: 'in-progress', notes: '' },
      { id: 'b4-3', label: 'Resource Allocation', status: 'pending', notes: '' },
      { id: 'b4-4', label: 'Outcome Measures', status: 'pending', notes: '' },
    ],
  },
];

// GOAL C: RESOURCE MANAGEMENT
const goalCInitiatives: Initiative[] = [
  {
    id: 'c1',
    name: 'Expand support for underrepresented populations',
    goal: 'C',
    status: 'yellow',
    lead: 'Dr. John M. Chawana',
    progress: 55,
    subBoxes: [
      { id: 'c1-1', label: 'Equity Programs', status: 'in-progress', notes: '' },
      { id: 'c1-2', label: 'Access Initiatives', status: 'in-progress', notes: '' },
      { id: 'c1-3', label: 'Support Services', status: 'pending', notes: '' },
      { id: 'c1-4', label: 'Enrollment & Success Metrics', status: 'pending', notes: '' },
    ],
  },
  {
    id: 'c2',
    name: 'Remove barriers to access',
    goal: 'C',
    status: 'yellow',
    lead: 'Dr. Tyjaun A. Lee',
    progress: 48,
    subBoxes: [
      { id: 'c2-1', label: 'Barrier Identification', status: 'in-progress', notes: '' },
      { id: 'c2-2', label: 'Solution Implementation', status: 'pending', notes: '' },
      { id: 'c2-3', label: 'Cost Reduction Initiatives', status: 'pending', notes: '' },
      { id: 'c2-4', label: 'Accessibility Improvements', status: 'pending', notes: '' },
    ],
  },
  {
    id: 'c3',
    name: 'Develop 21st Century technology infrastructure',
    goal: 'C',
    status: 'red',
    lead: 'Dr. John M. Chawana',
    progress: 35,
    subBoxes: [
      { id: 'c3-1', label: 'Technology Assessment', status: 'in-progress', notes: '' },
      { id: 'c3-2', label: 'Infrastructure Upgrades', status: 'pending', notes: '' },
      { id: 'c3-3', label: 'Digital Learning Tools', status: 'pending', notes: '' },
      { id: 'c3-4', label: 'User Adoption & Training', status: 'pending', notes: '' },
    ],
  },
  {
    id: 'c4',
    name: 'Promote effective & efficient stewardship of resources',
    goal: 'C',
    status: 'green',
    lead: 'Dr. Tyjaun A. Lee',
    progress: 62,
    subBoxes: [
      { id: 'c4-1', label: 'Budget Planning', status: 'in-progress', notes: '' },
      { id: 'c4-2', label: 'Resource Optimization', status: 'in-progress', notes: '' },
      { id: 'c4-3', label: 'Sustainability Initiatives', status: 'pending', notes: '' },
      { id: 'c4-4', label: 'Financial Health Indicators', status: 'pending', notes: '' },
    ],
  },
];

// GOAL D: EMPLOYEES
const goalDInitiatives: Initiative[] = [
  {
    id: 'd1',
    name: 'Become a destination workplace (IT)',
    goal: 'D',
    status: 'green',
    lead: 'Dr. Tyjaun A. Lee',
    progress: 58,
    subBoxes: [
      { id: 'd1-1', label: 'Recruitment Strategy', status: 'in-progress', notes: '' },
      { id: 'd1-2', label: 'Workplace Culture', status: 'in-progress', notes: '' },
      { id: 'd1-3', label: 'Retention Programs', status: 'pending', notes: '' },
      { id: 'd1-4', label: 'Employee Satisfaction', status: 'pending', notes: '' },
    ],
  },
  {
    id: 'd2',
    name: 'Emphasize employee development: personal & professional, with an emphasis on student success',
    goal: 'D',
    status: 'yellow',
    lead: 'Dr. Tyjaun A. Lee',
    progress: 52,
    subBoxes: [
      { id: 'd2-1', label: 'Professional Development Programs', status: 'in-progress', notes: '' },
      { id: 'd2-2', label: 'Training & Certification', status: 'in-progress', notes: '' },
      { id: 'd2-3', label: 'Career Pathways', status: 'pending', notes: '' },
      { id: 'd2-4', label: 'Performance & Growth Metrics', status: 'pending', notes: '' },
    ],
  },
];

// ALL GOALS
export const allGoals: Goal[] = [
  {
    id: 'A',
    name: 'Students, Alumni & Community',
    description: 'Stakeholder Perspective: Students, Alumni and Community',
    initiatives: goalAInitiatives,
  },
  {
    id: 'B',
    name: 'Organization',
    description: 'Stakeholder Perspective: Organization',
    initiatives: goalBInitiatives,
  },
  {
    id: 'C',
    name: 'Resource Management',
    description: 'Stakeholder Perspective: Resource Management',
    initiatives: goalCInitiatives,
  },
  {
    id: 'D',
    name: 'Employees',
    description: 'Stakeholder Perspective: Employees',
    initiatives: goalDInitiatives,
  },
];

// EXECUTIVE CABINET
export const executiveCabinet = [
  { name: 'Dr. Kimberly Beatty', title: 'MCC Chancellor' },
  { name: 'Dr. John M. Chawana', title: 'Vice Chancellor, Institutional Intelligence, Planning and Transformation' },
  { name: 'Ms. Sue Gochis', title: 'Vice Chancellor, Student Success and Engagement, and President, MCC-Blue River' },
  { name: 'Dr. Thomas W. Meyer', title: 'Vice Chancellor of Instruction and President, MCC-Online' },
  { name: 'Dr. Tammy Robinson', title: 'President, MCC-Penn Valley' },
  { name: 'Dr. Ryan Crider', title: 'President, MCC-Longview' },
  { name: 'Dr. Ellen Crowe', title: 'President, MCC-Maple Woods' },
  { name: 'Dr. Tyjaun A. Lee', title: 'Vice Chancellor, Administrative Services' },
  { name: 'Dr. Larry Rideaux Jr.', title: 'Vice Chancellor for College and Community Relations' },
];

// CAMPUSES
export const campuses = [
  { id: 'br', name: 'Blue River', president: 'Ms. Sue Gochis' },
  { id: 'lv', name: 'Longview', president: 'Dr. Ryan Crider' },
  { id: 'mw', name: 'Maple Woods', president: 'Dr. Ellen Crowe' },
  { id: 'pv', name: 'Penn Valley', president: 'Dr. Tammy Robinson' },
  { id: 'on', name: 'Online', president: 'Dr. Thomas W. Meyer' },
];

// MONTHS FOR 12-MONTH TRACKING
export const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
