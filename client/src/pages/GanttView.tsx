import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ganttTasks } from '@/lib/mockData';
import { ChevronLeft, Calendar } from 'lucide-react';
import { useLocation } from 'wouter';

export default function GanttView() {
  const [location, setLocation] = useLocation();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const calculateTaskPosition = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const startMonth = start.getMonth();
    const endMonth = end.getMonth();
    const duration = endMonth - startMonth + 1;

    return {
      startMonth,
      duration: Math.max(1, duration),
    };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card shadow-sm">
        <div className="container py-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setLocation('/')} className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">12-Month Institutional Initiatives</h1>
              <p className="text-muted-foreground mt-1">Gantt Chart View - Project Timeline & Baseline Tracking</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        <Card className="chart-container">
          <CardHeader>
            <CardTitle>Project Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-max">
                {/* Month Headers */}
                <div className="flex gap-1 mb-4">
                  <div className="w-64 flex-shrink-0" />
                  {months.map((month) => (
                    <div key={month} className="w-24 text-center text-xs font-medium text-muted-foreground">
                      {month}
                    </div>
                  ))}
                </div>

                {/* Tasks */}
                <div className="space-y-4">
                  {ganttTasks.map((task) => {
                    const { startMonth, duration } = calculateTaskPosition(task.baselineStart, task.baselineEnd);
                    const offsetLeft = startMonth * 96; // 96px per month (w-24)

                    return (
                      <div key={task.id} className="flex gap-1">
                        {/* Task Name */}
                        <div className="w-64 flex-shrink-0">
                          <div className="pr-4">
                            <h4 className="font-medium text-foreground text-sm">{task.name}</h4>
                            <p className="text-xs text-muted-foreground">{task.assignedTo}</p>
                          </div>
                        </div>

                        {/* Gantt Bar Container */}
                        <div className="flex-1 relative h-12 bg-secondary rounded-lg overflow-hidden">
                          {/* Baseline (lighter bar) */}
                          <div
                            className="absolute top-1 h-3 bg-blue-200 dark:bg-blue-900 rounded opacity-50"
                            style={{
                              left: `${offsetLeft}px`,
                              width: `${duration * 96}px`,
                            }}
                          />

                          {/* Actual Progress Bar */}
                          <div
                            className={`absolute top-5 h-3 rounded ${
                              task.status === 'Complete'
                                ? 'bg-green-600'
                                : task.status === 'At Risk'
                                  ? 'bg-red-600'
                                  : 'bg-blue-600'
                            }`}
                            style={{
                              left: `${offsetLeft}px`,
                              width: `${(duration * 96 * task.percentComplete) / 100}px`,
                            }}
                          />

                          {/* Status Badge */}
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                            <Badge
                              variant={task.status === 'Complete' ? 'default' : task.status === 'At Risk' ? 'destructive' : 'secondary'}
                              className="text-xs"
                            >
                              {task.percentComplete}%
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="mt-8 pt-4 border-t border-border">
                  <div className="flex flex-wrap gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-2 bg-blue-200 dark:bg-blue-900 rounded" />
                      <span className="text-muted-foreground">Baseline Schedule</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-2 bg-blue-600 rounded" />
                      <span className="text-muted-foreground">Actual Progress</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-2 bg-red-600 rounded" />
                      <span className="text-muted-foreground">At Risk</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-2 bg-green-600 rounded" />
                      <span className="text-muted-foreground">Complete</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Task Details */}
        <Card className="chart-container mt-6">
          <CardHeader>
            <CardTitle>Task Details & Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ganttTasks.map((task) => (
                <div key={task.id} className="border-b border-border pb-4 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-foreground">{task.name}</h4>
                      <p className="text-sm text-muted-foreground">Assigned to: {task.assignedTo}</p>
                    </div>
                    <Badge variant={task.status === 'Complete' ? 'default' : task.status === 'At Risk' ? 'destructive' : 'secondary'}>{task.status}</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Start Date</span>
                      <p className="font-medium text-foreground">{task.startDate}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">End Date</span>
                      <p className="font-medium text-foreground">{task.endDate}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Progress</span>
                      <p className="font-medium text-foreground">{task.percentComplete}%</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Variance</span>
                      <p className="font-medium text-foreground">
                        {new Date(task.endDate).getTime() > new Date(task.baselineEnd).getTime() ? '+' : ''}
                        {Math.round((new Date(task.endDate).getTime() - new Date(task.baselineEnd).getTime()) / (1000 * 60 * 60 * 24))} days
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
