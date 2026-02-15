import { useState, useEffect } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Users, Shield, Lock, Building2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPanelRBAC() {
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedInstitution, setSelectedInstitution] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());

  // Fetch data
  const rolesQuery = trpc.rbac.getAllRoles.useQuery();
  const permissionsQuery = trpc.rbac.getAllPermissions.useQuery();
  const assignUserMutation = trpc.rbac.assignUserToInstitution.useMutation();
  const removeUserMutation = trpc.rbac.removeUserFromInstitution.useMutation();

  if (user?.role !== 'admin') {
    return (
      <DashboardLayout>
        <div className="p-8 text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-600">Only administrators can access this panel.</p>
        </div>
      </DashboardLayout>
    );
  }

  const handleAssignUser = async () => {
    if (!selectedUser || !selectedInstitution || !selectedRole) {
      toast.error('Please select user, institution, and role');
      return;
    }

    try {
      const result = await assignUserMutation.mutateAsync({
        userId: parseInt(selectedUser),
        institutionId: parseInt(selectedInstitution),
        roleId: parseInt(selectedRole),
      });

      if (result.success) {
        toast.success('User assigned successfully');
        setSelectedUser('');
        setSelectedInstitution('');
        setSelectedRole('');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to assign user');
    }
  };

  const handleRemoveUser = async () => {
    if (!selectedUser || !selectedInstitution) {
      toast.error('Please select user and institution');
      return;
    }

    try {
      const result = await removeUserMutation.mutateAsync({
        userId: parseInt(selectedUser),
        institutionId: parseInt(selectedInstitution),
      });

      if (result.success) {
        toast.success('User removed successfully');
        setSelectedUser('');
        setSelectedInstitution('');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to remove user');
    }
  };

  const togglePermission = (permId: string) => {
    const newPerms = new Set(selectedPermissions);
    if (newPerms.has(permId)) {
      newPerms.delete(permId);
    } else {
      newPerms.add(permId);
    }
    setSelectedPermissions(newPerms);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
            <Shield className="w-8 h-8" />
            Admin Control Panel
          </h1>
          <p className="text-gray-600">Manage users, roles, permissions, and institutional access</p>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Roles & Permissions
            </TabsTrigger>
            <TabsTrigger value="institutions" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Institutions
            </TabsTrigger>
          </TabsList>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Assign User to Institution</CardTitle>
                <CardDescription>
                  Select a user and assign them to an institution with a specific role
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Select User</label>
                    <Select value={selectedUser} onValueChange={setSelectedUser}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose user..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">John Smith (john@mcc.edu)</SelectItem>
                        <SelectItem value="2">Jane Doe (jane@mcc.edu)</SelectItem>
                        <SelectItem value="3">Bob Johnson (bob@mcc.edu)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Select Institution</label>
                    <Select value={selectedInstitution} onValueChange={setSelectedInstitution}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose institution..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Metropolitan Community College - Kansas City</SelectItem>
                        <SelectItem value="2">Business & Technology Center</SelectItem>
                        <SelectItem value="3">Health Sciences Division</SelectItem>
                        <SelectItem value="4">Liberal Arts Division</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Select Role</label>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose role..." />
                      </SelectTrigger>
                      <SelectContent>
                        {rolesQuery.data?.data?.map((role: any) => (
                          <SelectItem key={role.id} value={role.id.toString()}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleAssignUser} disabled={assignUserMutation.isPending}>
                    {assignUserMutation.isPending ? 'Assigning...' : 'Assign User'}
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleRemoveUser} 
                    disabled={removeUserMutation.isPending}
                  >
                    {removeUserMutation.isPending ? 'Removing...' : 'Remove User'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Assignments</CardTitle>
                <CardDescription>Users and their institutional access</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="grid grid-cols-4 gap-4 p-3 bg-gray-100 rounded font-semibold text-sm">
                    <div>User</div>
                    <div>Institution</div>
                    <div>Role</div>
                    <div>Status</div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 p-3 border rounded">
                    <div>John Smith</div>
                    <div>MCC Kansas City</div>
                    <div>Institution Lead</div>
                    <div className="text-green-600">Active</div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 p-3 border rounded">
                    <div>Jane Doe</div>
                    <div>Business & Tech</div>
                    <div>Data Analyst</div>
                    <div className="text-green-600">Active</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Roles & Permissions Tab */}
          <TabsContent value="roles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Available Roles</CardTitle>
                <CardDescription>System roles and their permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rolesQuery.data?.data?.map((role: any) => (
                    <div key={role.id} className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">{role.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {['view_dashboard', 'view_data', 'export_reports', 'submit_data'].map((perm) => (
                          <span
                            key={perm}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                          >
                            {perm}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Permissions</CardTitle>
                <CardDescription>All system permissions that can be assigned to roles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {permissionsQuery.data?.data?.map((perm: any) => (
                    <div key={perm.id} className="flex items-center space-x-2 p-2 border rounded">
                      <Checkbox
                        id={perm.id}
                        checked={selectedPermissions.has(perm.id.toString())}
                        onCheckedChange={() => togglePermission(perm.id.toString())}
                      />
                      <label htmlFor={perm.id} className="flex-1 cursor-pointer">
                        <div className="font-medium">{perm.name}</div>
                        <div className="text-sm text-gray-600">{perm.description}</div>
                      </label>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">{perm.category}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Institutions Tab */}
          <TabsContent value="institutions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>MCC Institutions</CardTitle>
                <CardDescription>All 12 institutions in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'Metropolitan Community College - Kansas City',
                    'Business & Technology Center',
                    'Health Sciences Division',
                    'Liberal Arts Division',
                    'Engineering & Applied Sciences',
                    'Continuing Education Center',
                  ].map((inst, idx) => (
                    <Card key={idx} className="p-4">
                      <h3 className="font-semibold mb-2">{inst}</h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Status: <span className="text-green-600">Active</span></p>
                        <p>Users: <span className="font-medium">3</span></p>
                        <p>Last Updated: <span>2 days ago</span></p>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
