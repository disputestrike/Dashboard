import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Settings, Shield, Lock, Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { trpc } from '@/lib/trpc';

export default function AdminPanel() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');

  // Mock data for demonstration
  const mockUsers = [
    { id: 1, name: 'Dr. Sarah Johnson', email: 'sjohnson@mcc.edu', role: 'admin', institutions: ['MCC-KC-01', 'MCC-KC-02'], status: 'Active' },
    { id: 2, name: 'James Chen', email: 'jchen@mcc.edu', role: 'user', institutions: ['MCC-KC-03'], status: 'Active' },
    { id: 3, name: 'Maria Rodriguez', email: 'mrodriguez@mcc.edu', role: 'user', institutions: ['MCC-KC-04', 'MCC-KC-05'], status: 'Active' },
    { id: 4, name: 'David Thompson', email: 'dthompson@mcc.edu', role: 'user', institutions: ['MCC-KC-06'], status: 'Inactive' },
  ];

  const mockRoles = [
    { id: 1, name: 'Executive', permissions: ['view_all', 'export_reports', 'manage_users'], users: 2 },
    { id: 2, name: 'Institution Lead', permissions: ['view_own', 'submit_data', 'view_reports'], users: 8 },
    { id: 3, name: 'Data Analyst', permissions: ['view_all', 'export_reports'], users: 4 },
    { id: 4, name: 'Viewer', permissions: ['view_own'], users: 12 },
  ];

  const mockPermissions = [
    { id: 1, name: 'view_all', description: 'View all institutions data' },
    { id: 2, name: 'view_own', description: 'View only assigned institutions' },
    { id: 3, name: 'submit_data', description: 'Submit performance data' },
    { id: 4, name: 'export_reports', description: 'Export reports and dashboards' },
    { id: 5, name: 'manage_users', description: 'Manage users and roles' },
    { id: 6, name: 'manage_institutions', description: 'Manage institutions' },
    { id: 7, name: 'audit_logs', description: 'View audit logs' },
  ];

  if (!user || user.role !== 'admin') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Card>
            <CardContent className="pt-6">
              <p className="text-red-600 font-medium">Access Denied: Admin privileges required</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground mt-1">Manage users, roles, permissions, and system settings</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Roles</span>
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">Permissions</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">User Management</h2>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add User
              </Button>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Email</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Role</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Institutions</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockUsers.map((u) => (
                        <tr key={u.id} className="border-b border-border hover:bg-secondary transition-colors">
                          <td className="py-3 px-4 font-medium text-foreground">{u.name}</td>
                          <td className="py-3 px-4 text-muted-foreground">{u.email}</td>
                          <td className="py-3 px-4">
                            <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>{u.role}</Badge>
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{u.institutions.length} assigned</td>
                          <td className="py-3 px-4">
                            {u.status === 'Active' ? (
                              <div className="flex items-center gap-1 text-green-600">
                                <CheckCircle className="w-4 h-4" />
                                <span>Active</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-red-600">
                                <XCircle className="w-4 h-4" />
                                <span>Inactive</span>
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button className="p-1 hover:bg-secondary rounded transition-colors">
                                <Edit2 className="w-4 h-4 text-blue-600" />
                              </button>
                              <button className="p-1 hover:bg-secondary rounded transition-colors">
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Roles Tab */}
          <TabsContent value="roles" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Role Management</h2>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Role
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockRoles.map((role) => (
                <Card key={role.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{role.name}</CardTitle>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Permissions:</p>
                      <div className="flex flex-wrap gap-2">
                        {role.permissions.map((perm) => (
                          <Badge key={perm} variant="outline" className="text-xs">
                            {perm}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <p className="text-sm text-muted-foreground">{role.users} users assigned</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-4">
            <h2 className="text-xl font-semibold">Permission Matrix</h2>

            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Permission</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Description</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Used By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockPermissions.map((perm) => (
                        <tr key={perm.id} className="border-b border-border hover:bg-secondary transition-colors">
                          <td className="py-3 px-4 font-mono text-foreground text-xs">{perm.name}</td>
                          <td className="py-3 px-4 text-muted-foreground">{perm.description}</td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {mockRoles
                                .filter((r) => r.permissions.includes(perm.name))
                                .map((r) => (
                                  <Badge key={r.id} variant="outline" className="text-xs">
                                    {r.name}
                                  </Badge>
                                ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <h2 className="text-xl font-semibold">System Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Data Retention</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Audit Log Retention (days)</label>
                    <input type="number" defaultValue="365" className="w-full mt-2 px-3 py-2 border border-border rounded-lg" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Snapshot Frequency</label>
                    <select className="w-full mt-2 px-3 py-2 border border-border rounded-lg">
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>
                  <Button>Save Settings</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">Email Alerts on Red Status</label>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">Weekly Summary Report</label>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">Data Submission Reminders</label>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>
                  <Button>Update Preferences</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
