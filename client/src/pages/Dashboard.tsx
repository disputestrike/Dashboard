import { useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Clock, Calendar, Zap, Download, Settings } from 'lucide-react';
import { useLocation } from 'wouter';
import { institutions, variables, generatePerformanceData, ganttTasks, calculateHealthSummary } from '@/lib/mockData';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { useEffect } from 'react';

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
        <Card className="chart-container">
          <CardHeader>
            <CardTitle>Active Institutional Initiatives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Goal A */}
              <div className="border-l-4 border-l-blue-600 pl-4">
                <h3 className="text-lg font-bold text-[#003D7A] mb-4">Goal A: Students, Alumni & Community</h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-[#003D7A] mb-3">Enhance MCC's brand using holistic student experiences as an expanded community asset</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-white border-2 border-blue-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 1</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-blue-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 2</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-blue-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 3</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-blue-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 4</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-[#003D7A] mb-3">Establish a mindset for early career identification</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-white border-2 border-blue-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 1</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-blue-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 2</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-blue-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 3</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-blue-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 4</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-[#003D7A] mb-3">Bridge community and alumni</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-white border-2 border-blue-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 1</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-blue-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 2</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-blue-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 3</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-blue-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 4</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-[#003D7A] mb-3">Expand high-impact practices to become a student-ready college</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-white border-2 border-blue-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 1</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-blue-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 2</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-blue-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 3</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-blue-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 4</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Goal B */}
              <div className="border-l-4 border-l-green-600 pl-4">
                <h3 className="text-lg font-bold text-[#003D7A] mb-4">Goal B: Organization</h3>
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-[#003D7A] mb-3">Build a world-class first impression experience</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-white border-2 border-green-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 1</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-green-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 2</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-green-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 3</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-green-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 4</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-[#003D7A] mb-3">Demonstrate student-focused decision making</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-white border-2 border-green-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 1</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-green-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 2</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-green-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 3</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-green-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 4</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-[#003D7A] mb-3">Implement a student-centered approach</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-white border-2 border-green-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 1</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-green-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 2</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-green-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 3</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-green-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 4</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-[#003D7A] mb-3">Provide high-quality programs & services</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-white border-2 border-green-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 1</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-green-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 2</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-green-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 3</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-green-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 4</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Goal C */}
              <div className="border-l-4 border-l-amber-600 pl-4">
                <h3 className="text-lg font-bold text-[#003D7A] mb-4">Goal C: Resource Management</h3>
                <div className="space-y-4">
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-[#003D7A] mb-3">Expand support for underrepresented populations</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-white border-2 border-amber-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 1</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-amber-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 2</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-amber-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 3</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-amber-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 4</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-[#003D7A] mb-3">Remove barriers to access</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-white border-2 border-amber-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 1</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-amber-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 2</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-amber-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 3</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-amber-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 4</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-[#003D7A] mb-3">Develop 21st Century technology infrastructure</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-white border-2 border-amber-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 1</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-amber-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 2</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-amber-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 3</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-amber-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 4</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-[#003D7A] mb-3">Promote effective & efficient stewardship of resources</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-white border-2 border-amber-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 1</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-amber-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 2</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-amber-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 3</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-amber-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 4</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Goal D */}
              <div className="border-l-4 border-l-purple-600 pl-4">
                <h3 className="text-lg font-bold text-[#003D7A] mb-4">Goal D: Employees</h3>
                <div className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-[#003D7A] mb-3">Become a destination workplace (IT)</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-white border-2 border-purple-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 1</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-purple-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 2</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-purple-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 3</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-purple-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 4</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-[#003D7A] mb-3">Emphasize employee development: personal & professional, with an emphasis on student success</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-white border-2 border-purple-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 1</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-purple-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 2</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-purple-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 3</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                      <div className="bg-white border-2 border-purple-200 rounded p-3 text-center">
                        <div className="text-xs font-medium text-[#003D7A]">Sub-box 4</div>
                        <div className="text-2xl font-bold text-[#F4B024] mt-1">—</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
