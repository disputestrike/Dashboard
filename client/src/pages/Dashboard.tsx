import { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Clock, Calendar, Zap, Download, Settings, Plus, Trash2, Edit2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { institutions, variables, generatePerformanceData, ganttTasks, calculateHealthSummary } from '@/lib/mockData';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { SubBoxEditModal } from '@/components/SubBoxEditModal';

export default function Dashboard() {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [selectedInstitution, setSelectedInstitution] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('December');
  const exportMutation = trpc.export.toExcel.useMutation();
  const logoutMutation = trpc.auth.logout.useMutation();

  const performanceData = useMemo(() => generatePerformanceData(), []);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Handle export file download
  useEffect(() => {
    if (exportMutation.data?.success && exportMutation.data?.buffer) {
      const buffer = Buffer.from(exportMutation.data.buffer, 'base64');
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = exportMutation.data.fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  }, [exportMutation.data]);

  // Filter data based on selections
  const filteredData = useMemo(() => {
    return performanceData.filter((record) => {
      const matchInstitution = selectedInstitution === 'all' || record.institutionId === selectedInstitution;
      const matchCategory = selectedCategory === 'all' || variables.find((v) => v.name === record.variableName)?.category === selectedCategory;
      return matchInstitution && matchCategory;
    });
  }, [performanceData, selectedInstitution, selectedCategory]);

  // Calculate health summary
  const health = useMemo(() => calculateHealthSummary(filteredData), [filteredData]);

  // Prepare chart data
  const institutionHealthData = useMemo(() => {
    const institutionStats: Record<string, { green: number; yellow: number; red: number }> = {};
    institutions.forEach((inst) => {
      institutionStats[inst.name] = { green: 0, yellow: 0, red: 0 };
    });

    filteredData.forEach((record) => {
      const inst = institutions.find((i) => i.id === record.institutionId);
      if (inst) {
        institutionStats[inst.name][record.status.toLowerCase() as 'green' | 'yellow' | 'red']++;
      }
    });

    return Object.entries(institutionStats).map(([name, stats]) => ({
      name,
      Green: stats.green,
      Yellow: stats.yellow,
      Red: stats.red,
    }));
  }, [filteredData]);

  const categoryHealthData = useMemo(() => {
    const categoryStats: Record<string, { green: number; yellow: number; red: number }> = {};
    variables.forEach((v) => {
      if (selectedCategory === 'all' || v.category === selectedCategory) {
        categoryStats[v.category] = categoryStats[v.category] || { green: 0, yellow: 0, red: 0 };
      }
    });

    filteredData.forEach((record) => {
      const variable = variables.find((v) => v.name === record.variableName);
      if (variable && (selectedCategory === 'all' || variable.category === selectedCategory)) {
        categoryStats[variable.category][record.status.toLowerCase() as 'green' | 'yellow' | 'red']++;
      }
    });

    return Object.entries(categoryStats).map(([name, stats]) => ({
      name,
      ...stats,
    }));
  }, [filteredData, selectedCategory]);

  const statusDistribution = [
    { name: 'Green', value: health.green, color: '#16a34a' },
    { name: 'Yellow', value: health.yellow, color: '#f59e0b' },
    { name: 'Red', value: health.red, color: '#dc2626' },
  ];

  const trendData = [
    { month: 'Jan', Green: 20 },
    { month: 'Feb', Green: 18 },
    { month: 'Mar', Green: 21 },
    { month: 'Apr', Green: 19 },
    { month: 'May', Green: 17 },
    { month: 'Jun', Green: 14 },
    { month: 'Jul', Green: 18 },
    { month: 'Aug', Green: 24 },
    { month: 'Sep', Green: 19 },
    { month: 'Oct', Green: 23 },
    { month: 'Nov', Green: 20 },
    { month: 'Dec', Green: 18 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#003D7A] to-[#003D7A] text-white shadow-lg">
        <div className="container py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-[#F4B024] flex items-center justify-center font-bold text-lg">MCC</div>
            <div>
              <h1 className="text-2xl font-bold">MCC Kansas City</h1>
              <p className="text-sm text-gray-300">Institutional Performance Dashboard</p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={async () => {
              await logoutMutation.mutateAsync();
              setLocation('/');
            }}
            className="text-white hover:bg-white/20"
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center flex-1">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">Cabinet Areas</label>
                <Select value={selectedInstitution} onValueChange={setSelectedInstitution}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cabinet Areas</SelectItem>
                    {institutions.map((inst) => (
                      <SelectItem key={inst.id} value={inst.id}>
                        {inst.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">Goals</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Goals</SelectItem>
                    <SelectItem value="A">Goal A: Students, Alumni & Community</SelectItem>
                    <SelectItem value="B">Goal B: Organization</SelectItem>
                    <SelectItem value="C">Goal C: Resource Management</SelectItem>
                    <SelectItem value="D">Goal D: Employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">Month</label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button variant="outline" onClick={() => setLocation('/gantt')} className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              View Gantt
            </Button>
            <Button 
              variant="outline" 
              onClick={() => exportMutation.mutate({ institutionId: selectedInstitution, month: selectedMonth })}
              disabled={exportMutation.isPending}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              {exportMutation.isPending ? 'Exporting...' : 'Export Excel'}
            </Button>
            {user?.role === 'admin' && (
              <Button 
                variant="outline" 
                onClick={() => setLocation('/admin')}
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Admin
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        {/* Health Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-gray-600">Healthy Status</div>
              <div className="text-3xl font-bold text-green-600 mt-2">{health.green}%</div>
              <div className="text-xs text-gray-500 mt-1">{health.green} of 432 metrics</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-600">
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-gray-600">Green Status</div>
              <div className="text-3xl font-bold text-green-600 mt-2">{health.green}</div>
              <div className="text-xs text-gray-500 mt-1">Performing as expected</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-gray-600">Yellow Status</div>
              <div className="text-3xl font-bold text-yellow-600 mt-2">{health.yellow}</div>
              <div className="text-xs text-gray-500 mt-1">Needs attention</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-gray-600">Red Status</div>
              <div className="text-3xl font-bold text-red-600 mt-2">{health.red}</div>
              <div className="text-xs text-gray-500 mt-1">Critical attention required</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="chart-container">
            <CardHeader>
              <CardTitle>Overall Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={statusDistribution} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="chart-container lg:col-span-2">
            <CardHeader>
              <CardTitle>Performance Trend (12 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Green" stroke="#16a34a" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Institution Health */}
          <Card className="chart-container">
            <CardHeader>
              <CardTitle>Institution Health Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={institutionHealthData.slice(0, 6)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Green" fill="#16a34a" />
                  <Bar dataKey="Yellow" fill="#f59e0b" />
                  <Bar dataKey="Red" fill="#dc2626" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Performance */}
          <Card className="chart-container">
            <CardHeader>
              <CardTitle>Performance by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={categoryHealthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="green" fill="#16a34a" />
                  <Bar dataKey="yellow" fill="#f59e0b" />
                  <Bar dataKey="red" fill="#dc2626" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Active Institutional Initiatives */}
        <InitiativesSection selectedGoal={selectedCategory} />
      </div>
    </div>
  );
}

// ============ INITIATIVES SECTION COMPONENT ============

const GOAL_TABS = [
  { id: 'A', label: 'Goal A: Students, Alumni & Community' },
  { id: 'B', label: 'Goal B: Organization' },
  { id: 'C', label: 'Goal C: Resource Management' },
  { id: 'D', label: 'Goal D: Employees' },
  { id: 'all', label: 'All Goals' },
];

function InitiativesSection({ selectedGoal }: { selectedGoal: string }) {
  const [editingSubBox, setEditingSubBox] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedGoalTab, setSelectedGoalTab] = useState<string>('A');
  const [showAddInitiative, setShowAddInitiative] = useState(false);
  const [newInitiativeTitle, setNewInitiativeTitle] = useState('');
  const [newInitiativeDesc, setNewInitiativeDesc] = useState('');
  
  const initiativesQuery = trpc.initiatives.getAll.useQuery();
  const deleteInitiativeMutation = trpc.initiatives.delete.useMutation();
  const deleteSubBoxMutation = trpc.initiatives.deleteSubBox.useMutation();
  const createInitiativeMutation = trpc.initiatives.create.useMutation();
  
  const initiatives = initiativesQuery.data || [];

  // Sync with the Goals dropdown filter from parent component
  useEffect(() => {
    if (selectedGoal && selectedGoal !== 'all') {
      setSelectedGoalTab(selectedGoal);
    } else if (selectedGoal === 'all') {
      setSelectedGoalTab('all');
    }
  }, [selectedGoal]);

  const goalInitiatives = selectedGoalTab === 'all' 
    ? initiatives 
    : initiatives.filter(i => i.goal === selectedGoalTab);

  const handleDeleteInitiative = async (id: number) => {
    if (confirm('Delete this initiative and all sub-boxes?')) {
      await deleteInitiativeMutation.mutateAsync({ id });
      initiativesQuery.refetch();
    }
  };

  const handleDeleteSubBox = async (id: number) => {
    if (confirm('Delete this sub-box?')) {
      await deleteSubBoxMutation.mutateAsync({ id });
      setEditingSubBox(null);
      initiativesQuery.refetch();
    }
  };

  const handleAddInitiative = async () => {
    if (!newInitiativeTitle.trim()) {
      alert('Please enter an initiative title');
      return;
    }
    
    if (selectedGoalTab === 'all') {
      alert('Please select a specific goal (A, B, C, or D)');
      return;
    }
    
    try {
      await createInitiativeMutation.mutateAsync({
        goal: selectedGoalTab as 'A' | 'B' | 'C' | 'D',
        title: newInitiativeTitle,
        description: newInitiativeDesc,
        owner: 'TBD',
      });
      setNewInitiativeTitle('');
      setNewInitiativeDesc('');
      setShowAddInitiative(false);
      initiativesQuery.refetch();
    } catch (error) {
      console.error('Failed to create initiative:', error);
      alert('Failed to create initiative');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complete':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'At Risk':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <>
      <Card className="chart-container">
        <CardHeader>
          <CardTitle>Active Institutional Initiatives</CardTitle>
        </CardHeader>
        
        {/* Tab Navigation */}
        <div className="px-6 pb-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-2">
            {GOAL_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedGoalTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedGoalTab === tab.id
                    ? 'bg-[#003D7A] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Add Initiative Button */}
            {!showAddInitiative && (
              <Button
                onClick={() => setShowAddInitiative(true)}
                className="flex items-center gap-2 bg-[#003D7A] hover:bg-[#002855]"
              >
                <Plus className="w-4 h-4" />
                Add Initiative to {GOAL_TABS.find(t => t.id === selectedGoalTab)?.label.split(':')[0]}
              </Button>
            )}

            {/* Add Initiative Form */}
            {showAddInitiative && (
              <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                <h4 className="font-semibold text-[#003D7A] mb-3">New Initiative</h4>
                <input
                  type="text"
                  placeholder="Initiative title"
                  value={newInitiativeTitle}
                  onChange={(e) => setNewInitiativeTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#003D7A]"
                />
                <textarea
                  placeholder="Description (optional)"
                  value={newInitiativeDesc}
                  onChange={(e) => setNewInitiativeDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#003D7A]"
                  rows={2}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddInitiative}
                    disabled={createInitiativeMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {createInitiativeMutation.isPending ? 'Creating...' : 'Create'}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowAddInitiative(false);
                      setNewInitiativeTitle('');
                      setNewInitiativeDesc('');
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Initiatives List */}
            {goalInitiatives.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No initiatives found. Create one to get started.</p>
              </div>
            ) : (
              goalInitiatives.map((initiative) => (
                <div 
                  key={initiative.id}
                  className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                  style={{
                    borderLeft: '4px solid #003D7A',
                    background: 'linear-gradient(135deg, rgba(0,61,122,0.02) 0%, rgba(244,176,36,0.01) 100%)',
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#003D7A] text-base">{initiative.title}</h4>
                      {initiative.description && (
                        <p className="text-sm text-gray-600 mt-1">{initiative.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteInitiative(initiative.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Sub-boxes Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                    {[1, 2, 3, 4].map((boxNum) => (
                      <button
                        key={boxNum}
                        onClick={() => {
                          setEditingSubBox({
                            id: initiative.id * 10 + boxNum,
                            initiativeId: initiative.id,
                            title: `Sub-box ${boxNum}`,
                            status: 'Not Started',
                          });
                          setShowModal(true);
                        }}
                        className="p-3 rounded border-2 border-gray-300 bg-white hover:bg-gray-50 transition-all hover:shadow-md text-left group"
                        style={{
                          borderStyle: 'solid',
                          boxShadow: '0 2px 4px rgba(0,61,122,0.1), inset 0 1px 0 rgba(255,255,255,0.5)',
                        }}
                      >
                        <div className="text-xs font-medium text-[#003D7A] group-hover:text-[#F4B024]">
                          Sub-box {boxNum}
                        </div>
                        <div className="text-2xl text-gray-300 group-hover:text-gray-400 mt-1">+</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sub-box Edit Modal */}
      {showModal && editingSubBox && (
        <SubBoxEditModal
          isOpen={showModal}
          subBox={editingSubBox}
          initiativeId={editingSubBox.initiativeId}
          onClose={() => {
            setShowModal(false);
            setEditingSubBox(null);
          }}
          onSuccess={() => {
            initiativesQuery.refetch();
            setShowModal(false);
            setEditingSubBox(null);
          }}
        />
      )}
    </>
  );
}
