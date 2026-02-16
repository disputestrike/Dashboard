import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { allGoals, cabinetAreas, executiveCabinet, campuses, months } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, LogOut } from 'lucide-react';
import { useLocation } from 'wouter';
import { useState } from 'react';

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const logoutMutation = trpc.auth.logout.useMutation();
  const [selectedGoal, setSelectedGoal] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [exportLoading, setExportLoading] = useState(false);

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    setLocation('/login');
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const response = await fetch('/api/trpc/export.generateExcel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `MCC_Dashboard_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExportLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'green':
        return '#10b981';
      case 'yellow':
        return '#f59e0b';
      case 'red':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'green':
        return <Badge className="bg-green-500 hover:bg-green-600">On Track</Badge>;
      case 'yellow':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">At Risk</Badge>;
      case 'red':
        return <Badge className="bg-red-500 hover:bg-red-600">Off Track</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  // Calculate overall statistics
  const allInitiatives = allGoals.flatMap((g) => g.initiatives);
  const statusCounts = {
    green: allInitiatives.filter((i) => i.status === 'green').length,
    yellow: allInitiatives.filter((i) => i.status === 'yellow').length,
    red: allInitiatives.filter((i) => i.status === 'red').length,
  };

  const goalProgressData = allGoals.map((goal) => ({
    goal: `Goal ${goal.id}`,
    progress: Math.round(
      goal.initiatives.reduce((sum, init) => sum + init.progress, 0) / goal.initiatives.length
    ),
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#003D7A] to-[#0052A3] border-b-4 border-[#F4B024] shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                <span className="text-[#003D7A] font-bold text-lg">MCC</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">MCC Kansas City</h1>
                <p className="text-[#F4B024] text-sm font-medium">Institutional Performance Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={handleExport}
                disabled={exportLoading}
                className="bg-[#F4B024] hover:bg-[#E6A91F] text-[#003D7A] font-semibold"
              >
                <Download className="w-4 h-4 mr-2" />
                {exportLoading ? 'Exporting...' : 'Export Excel'}
              </Button>
              <Button
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {logoutMutation.isPending ? 'Signing out...' : 'Sign Out'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Cabinet Areas Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#003D7A] mb-4">Cabinet Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cabinetAreas.map((area) => (
              <Card key={area.id} className="border-l-4 border-l-[#003D7A] hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-[#003D7A]">{area.name}</CardTitle>
                  <CardDescription className="text-sm">{area.lead}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-l-4 border-l-green-500 bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#003D7A]">On Track</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{statusCounts.green}</div>
              <p className="text-xs text-gray-600 mt-1">Initiatives</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500 bg-yellow-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#003D7A]">At Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{statusCounts.yellow}</div>
              <p className="text-xs text-gray-600 mt-1">Initiatives</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500 bg-red-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#003D7A]">Off Track</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{statusCounts.red}</div>
              <p className="text-xs text-gray-600 mt-1">Initiatives</p>
            </CardContent>
          </Card>
        </div>

        {/* Strategic Goals */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#003D7A] mb-4">Strategic Goals</h2>

          <Tabs value={selectedGoal} onValueChange={(val) => setSelectedGoal(val as 'A' | 'B' | 'C' | 'D')}>
            <TabsList className="grid w-full grid-cols-4 bg-[#003D7A]/10">
              {allGoals.map((goal) => (
                <TabsTrigger
                  key={goal.id}
                  value={goal.id}
                  className="data-[state=active]:bg-[#003D7A] data-[state=active]:text-white"
                >
                  <span className="font-bold">Goal {goal.id}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {allGoals.map((goal) => (
              <TabsContent key={goal.id} value={goal.id} className="space-y-6">
                {/* Goal Header */}
                <Card className="border-l-4 border-l-[#003D7A] bg-[#003D7A]/5">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl text-[#003D7A]">Goal {goal.id}: {goal.name}</CardTitle>
                        <CardDescription className="mt-2">{goal.description}</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-[#003D7A]">{goal.initiatives.length}</div>
                        <div className="text-sm text-gray-600">Initiatives</div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Initiatives */}
                <div className="space-y-4">
                  {goal.initiatives.map((initiative) => (
                    <Card key={initiative.id} className="border-l-4" style={{ borderLeftColor: getStatusColor(initiative.status) }}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base text-[#003D7A]">{initiative.name}</CardTitle>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-sm text-gray-600">Lead: {initiative.lead}</span>
                              {getStatusBadge(initiative.status)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-[#003D7A]">{initiative.progress}%</div>
                            <div className="text-xs text-gray-600">Progress</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {/* 4 Sub-boxes */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                          {initiative.subBoxes.map((subBox) => (
                            <div
                              key={subBox.id}
                              className={`p-4 rounded-lg border-2 transition-colors ${
                                subBox.status === 'complete'
                                  ? 'border-green-300 bg-green-50'
                                  : subBox.status === 'in-progress'
                                  ? 'border-blue-300 bg-blue-50'
                                  : 'border-gray-300 bg-gray-50'
                              }`}
                            >
                              <div className="text-sm font-semibold text-[#003D7A]">{subBox.label}</div>
                              <div className="text-xs text-gray-600 mt-2 capitalize">{subBox.status.replace('-', ' ')}</div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#003D7A]">Initiative Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'On Track', value: statusCounts.green, fill: '#10b981' },
                      { name: 'At Risk', value: statusCounts.yellow, fill: '#f59e0b' },
                      { name: 'Off Track', value: statusCounts.red, fill: '#ef4444' },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    dataKey="value"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#f59e0b" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#003D7A]">Goal Progress Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={goalProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="goal" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="progress" fill="#003D7A" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Executive Cabinet */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-[#003D7A]">Executive Cabinet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {executiveCabinet.map((exec, idx) => (
                <div key={idx} className="p-4 border border-gray-200 rounded-lg hover:border-[#003D7A] hover:bg-[#003D7A]/5 transition-colors">
                  <div className="font-semibold text-[#003D7A]">{exec.name}</div>
                  <div className="text-sm text-gray-600 mt-1">{exec.title}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Campuses */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#003D7A]">MCC Campuses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {campuses.map((campus) => (
                <div key={campus.id} className="p-4 border border-gray-200 rounded-lg hover:border-[#F4B024] hover:bg-[#F4B024]/5 transition-colors">
                  <div className="font-semibold text-[#003D7A]">{campus.name}</div>
                  <div className="text-sm text-gray-600 mt-1">President: {campus.president}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
