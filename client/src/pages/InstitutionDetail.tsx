import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { institutions, variables, generatePerformanceData } from '@/lib/mockData';
import { ChevronLeft, TrendingUp, TrendingDown } from 'lucide-react';

export default function InstitutionDetail() {
  const [location, setLocation] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const institutionId = params.get('id') || 'MCC-KC-01';

  const institution = institutions.find((i) => i.id === institutionId);
  const performanceData = useMemo(() => generatePerformanceData(), []);

  const institutionData = useMemo(() => {
    return performanceData.filter((d) => d.institutionId === institutionId);
  }, [performanceData, institutionId]);

  const healthSummary = useMemo(() => {
    const green = institutionData.filter((d) => d.status === 'Green').length;
    const yellow = institutionData.filter((d) => d.status === 'Yellow').length;
    const red = institutionData.filter((d) => d.status === 'Red').length;
    return { green, yellow, red, total: institutionData.length };
  }, [institutionData]);

  const variablePerformance = useMemo(() => {
    const stats: Record<string, { green: number; yellow: number; red: number }> = {};
    variables.forEach((v) => {
      stats[v.name] = { green: 0, yellow: 0, red: 0 };
    });

    institutionData.forEach((record) => {
      if (stats[record.variableName]) {
        stats[record.variableName][record.status.toLowerCase() as 'green' | 'yellow' | 'red']++;
      }
    });

    return Object.entries(stats).map(([name, counts]) => ({
      name,
      ...counts,
      total: counts.green + counts.yellow + counts.red,
      healthPercentage: Math.round((counts.green / (counts.green + counts.yellow + counts.red)) * 100),
    }));
  }, [institutionData]);

  const monthlyTrend = useMemo(() => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months.map((month) => {
      const monthData = institutionData.filter((d) => d.month === month);
      const green = monthData.filter((d) => d.status === 'Green').length;
      const yellow = monthData.filter((d) => d.status === 'Yellow').length;
      const red = monthData.filter((d) => d.status === 'Red').length;
      return {
        month: month.substring(0, 3),
        Green: green,
        Yellow: yellow,
        Red: red,
      };
    });
  }, [institutionData]);

  if (!institution) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Institution not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card shadow-sm">
        <div className="container py-6">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => setLocation('/')} className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">{institution.name}</h1>
              <p className="text-muted-foreground mt-1">Detailed Performance Analysis</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Institution ID</span>
              <p className="font-medium text-foreground">{institution.id}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Category</span>
              <p className="font-medium text-foreground">{institution.category}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Lead Executive</span>
              <p className="font-medium text-foreground">{institution.owner}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge className="mt-1">{institution.status}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="kpi-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Overall Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{Math.round((healthSummary.green / healthSummary.total) * 100)}%</div>
              <p className="text-xs text-muted-foreground mt-2">{healthSummary.green} of {healthSummary.total} metrics</p>
            </CardContent>
          </Card>

          <Card className="kpi-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Green Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{healthSummary.green}</div>
              <p className="text-xs text-muted-foreground mt-2">Performing well</p>
            </CardContent>
          </Card>

          <Card className="kpi-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Yellow Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{healthSummary.yellow}</div>
              <p className="text-xs text-muted-foreground mt-2">Needs monitoring</p>
            </CardContent>
          </Card>

          <Card className="kpi-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Red Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{healthSummary.red}</div>
              <p className="text-xs text-muted-foreground mt-2">Requires action</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Monthly Trend */}
          <Card className="chart-container">
            <CardHeader>
              <CardTitle>Monthly Performance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" />
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

          {/* Variable Performance */}
          <Card className="chart-container">
            <CardHeader>
              <CardTitle>Variable Health Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {variablePerformance.slice(0, 5).map((variable) => (
                  <div key={variable.name} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-foreground">{variable.name}</span>
                        <span className="text-sm font-bold text-green-600">{variable.healthPercentage}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: `${variable.healthPercentage}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Variable Performance Table */}
        <Card className="chart-container">
          <CardHeader>
            <CardTitle>Detailed Variable Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Variable</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Green</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Yellow</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Red</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Health %</th>
                  </tr>
                </thead>
                <tbody>
                  {variablePerformance.map((variable) => (
                    <tr key={variable.name} className="border-b border-border hover:bg-secondary transition-colors">
                      <td className="py-3 px-4 font-medium text-foreground">{variable.name}</td>
                      <td className="text-center py-3 px-4">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {variable.green}
                        </Badge>
                      </td>
                      <td className="text-center py-3 px-4">
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          {variable.yellow}
                        </Badge>
                      </td>
                      <td className="text-center py-3 px-4">
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          {variable.red}
                        </Badge>
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className="font-bold text-green-600">{variable.healthPercentage}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
