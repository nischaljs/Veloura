import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import DashboardTable from '../components/dashboard/DashboardTable';
import { getUsers, updateUser, deleteUser, activateUser, deactivateUser } from '../services/admin';
import { User } from '../types';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditUser, setCurrentEditUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});

  const fetchUsers = async (page = pagination.page) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUsers({ page, limit: pagination.limit });
      setUsers(res.data.data.users);
      setPagination(res.data.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      toast.error(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user: User) => {
    setCurrentEditUser(user);
    setEditForm({ firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, isActive: user.isActive });
    setIsModalOpen(true);
  };

  const handleSaveUser = async () => {
    if (!currentEditUser) return;
    try {
      await updateUser(currentEditUser.id, editForm);
      toast.success('User updated successfully');
      setIsModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(id);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleActivateDeactivate = async (id: number, isActive: boolean) => {
    try {
      if (isActive) {
        await deactivateUser(id);
        toast.success('User deactivated successfully');
      } else {
        await activateUser(id);
        toast.success('User activated successfully');
      }
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change user status');
    }
  };

  const userTableColumns = [
    { key: 'name', label: 'Name', render: (value: any, row: User) => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
          {row.firstName?.[0]}{row.lastName?.[0]}
        </div>
        <div>
          <div className="font-medium">{row.firstName} {row.lastName}</div>
          <div className="text-sm text-muted-foreground">{row.email}</div>
        </div>
      </div>
    )},
    { key: 'role', label: 'Role', render: (value: any) => (
      <Badge variant={value === 'ADMIN' ? 'destructive' : value === 'VENDOR' ? 'default' : 'secondary'}>
        {value}
      </Badge>
    )},
    { key: 'status', label: 'Status', render: (value: any, row: User) => (
      <Badge variant={row.isActive ? 'default' : 'secondary'}>
        {row.isActive ? 'Active' : 'Inactive'}
      </Badge>
    )},
    { key: 'createdAt', label: 'Joined', render: (value: any) => (
      <span className="text-sm text-muted-foreground">
        {new Date(value).toLocaleDateString()}
      </span>
    )},
    { key: 'actions', label: 'Actions', render: (value: any, row: User) => (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => handleEditClick(row)}>Edit</Button>
        <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(row.id)}>Delete</Button>
        <Button size="sm" variant="secondary" onClick={() => handleActivateDeactivate(row.id, row.isActive)}>
          {row.isActive ? 'Deactivate' : 'Activate'}
        </Button>
      </div>
    )},
  ];

  return (
    <DashboardLayout userRole="ADMIN">
      <div className="w-full px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">User Management</h1>
        <DashboardTable
          title="All Users"
          data={users}
          columns={userTableColumns}
          loading={loading}
          emptyMessage={error || 'No users found'}
        />
        {/* Pagination Controls */}
        <div className="flex justify-center mt-6 gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => fetchUsers(pagination.page - 1)}
          >
            Previous
          </Button>
          <span className="px-3 py-2 text-sm">Page {pagination.page} of {pagination.pages}</span>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page >= pagination.pages}
            onClick={() => fetchUsers(pagination.page + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Edit User Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">First Name</Label>
              <Input id="firstName" value={editForm.firstName || ''} onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">Last Name</Label>
              <Input id="lastName" value={editForm.lastName || ''} onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input id="email" value={editForm.email || ''} onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">Role</Label>
              <Select value={editForm.role} onValueChange={(value) => setEditForm(prev => ({ ...prev, role: value as User['role'] }))}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CUSTOMER">CUSTOMER</SelectItem>
                  <SelectItem value="VENDOR">VENDOR</SelectItem>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">Active</Label>
              <Select value={editForm.isActive ? 'true' : 'false'} onValueChange={(value) => setEditForm(prev => ({ ...prev, isActive: value === 'true' }))}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveUser}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminUsersPage;