import { useState, useMemo, useEffect } from 'react';
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

  const trendData = useMemo(() => {
    return months.map((month) => {
      const monthData = performanceData.filter((d) => d.month === month);
      const green = monthData.filter((d) => d.status === 'Green').length;
      return {
        month: month.substring(0, 3),
        Green: green,
        Total: monthData.length,
      };
    });
  }, [performanceData]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#003D7A] to-[#0052A3] border-b-4 border-[#F4B024]">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/mcc-logo.svg" alt="MCC Logo" className="h-12 w-12" />
              <div>
                <h1 className="text-3xl font-bold text-white">MCC Kansas City</h1>
                <p className="text-blue-100 mt-1">Institutional Performance Dashboard</p>
              </div>
            </div>
            <div className="text-right">
              {user && (
                <Button 
                  variant="ghost"
                  onClick={() => {
                    logoutMutation.mutate(undefined, {
                      onSuccess: () => {
                        logout();
                        setLocation('/login');
                      }
                    });
                  }}
                  disabled={logoutMutation.isPending}
                  className="text-white hover:bg-white/20"
                >
                  {logoutMutation.isPending ? 'Signing out...' : 'Sign Out'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-border bg-card">
        <div className="container py-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium text-foreground mb-2 block">Cabinet Areas</label>
              <Select value={selectedInstitution} onValueChange={setSelectedInstitution}>
                <SelectTrigger>
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

            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium text-foreground mb-2 block">Goals</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Goals</SelectItem>
                  <SelectItem value="Students, Alumni & Community">Goal A: Students, Alumni & Community</SelectItem>
                  <SelectItem value="Organization">Goal B: Organization</SelectItem>
                  <SelectItem value="Resource Management">Goal C: Resource Management</SelectItem>
                  <SelectItem value="Employees">Goal D: Employees</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium text-foreground mb-2 block">Month</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
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
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="kpi-card border-l-4 border-l-green-600 bg-gradient-to-br from-green-50 to-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#003D7A]">Healthy Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-green-600">{health.healthPercentage}%</span>
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-xs text-[#003D7A] mt-2">{health.green} of {health.total} metrics</p>
            </CardContent>
          </Card>

          <Card className="kpi-card border-l-4 border-l-green-600 bg-gradient-to-br from-green-50 to-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#003D7A]">Green Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{health.green}</div>
              <p className="text-xs text-[#003D7A] mt-2">Performing as expected</p>
            </CardContent>
          </Card>

          <Card className="kpi-card border-l-4 border-l-amber-600 bg-gradient-to-br from-amber-50 to-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#003D7A]">Yellow Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-amber-600">{health.yellow}</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-xs text-[#003D7A] mt-2">Needs attention</p>
            </CardContent>
          </Card>

          <Card className="kpi-card border-l-4 border-l-red-600 bg-gradient-to-br from-red-50 to-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#003D7A]">Red Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-red-600">{health.red}</span>
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>
              <p className="text-xs text-[#003D7A] mt-2">Critical attention required</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Status Distribution */}
          <Card className="chart-container border-t-4 border-t-[#003D7A]">
            <CardHeader className="bg-gradient-to-r from-[#003D7A]/5 to-[#F4B024]/5">
              <CardTitle className="text-[#003D7A]">Overall Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
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

          {/* Trend Over Time */}
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
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="green" fill="#16a34a" name="Green" />
                  <Bar dataKey="yellow" fill="#f59e0b" name="Yellow" />
                  <Bar dataKey="red" fill="#dc2626" name="Red" />
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

function InitiativesSection({ selectedGoal }: { selectedGoal: string }) {
  const [editingSubBox, setEditingSubBox] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedGoalFilter, setSelectedGoalFilter] = useState<string>('all');
  
  const initiativesQuery = trpc.initiatives.getAll.useQuery();
  const deleteInitiativeMutation = trpc.initiatives.delete.useMutation();
  const deleteSubBoxMutation = trpc.initiatives.deleteSubBox.useMutation();
  
  const subBoxesQueries = {
    A: trpc.initiatives.getSubBoxes.useQuery({ initiativeId: 1 }, { enabled: false }),
    B: trpc.initiatives.getSubBoxes.useQuery({ initiativeId: 2 }, { enabled: false }),
    C: trpc.initiatives.getSubBoxes.useQuery({ initiativeId: 3 }, { enabled: false }),
    D: trpc.initiatives.getSubBoxes.useQuery({ initiativeId: 4 }, { enabled: false }),
  };

  const initiatives = initiativesQuery.data || [];

  const goalInitiatives = selectedGoalFilter === 'all' 
    ? initiatives 
    : initiatives.filter(i => i.goal === selectedGoalFilter);

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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Active Institutional Initiatives</CardTitle>
          <Select value={selectedGoalFilter} onValueChange={setSelectedGoalFilter}>
            <SelectTrigger className="w-64">
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
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
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

      <SubBoxEditModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingSubBox(null);
        }}
        subBox={editingSubBox}
        initiativeId={editingSubBox?.initiativeId || 0}
        onSuccess={() => {
          initiativesQuery.refetch();
        }}
      />
    </>
  );
}
