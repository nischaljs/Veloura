import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { getPolicies, addPolicy, updatePolicy, deletePolicy } from '../services/vendor';
import { VendorPolicy } from '../types';
import { toast } from 'sonner';

const emptyForm = {
  type: 'RETURN',
  title: '',
  description: ''
};

const policyTypes = [
  { value: 'RETURN', label: 'Return' },
  { value: 'SHIPPING', label: 'Shipping' },
  { value: 'WARRANTY', label: 'Warranty' },
  { value: 'CUSTOM', label: 'Custom' }
];

const VendorPoliciesPage: React.FC = () => {
  const [policies, setPolicies] = useState<VendorPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchPolicies = () => {
    setLoading(true);
    getPolicies()
      .then(res => setPolicies(res.data.data.policies || []))
      .catch(() => toast.error('Failed to load policies'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const openAddModal = () => {
    setForm({ ...emptyForm });
    setEditMode(false);
    setEditingId(null);
    setModalOpen(true);
  };

  const openEditModal = (policy: VendorPolicy) => {
    setForm({
      type: policy.type,
      title: policy.title,
      description: policy.description
    });
    setEditMode(true);
    setEditingId(policy.id);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this policy?')) return;
    try {
      await deletePolicy(id);
      toast.success('Policy deleted');
      fetchPolicies();
    } catch {
      toast.error('Failed to delete policy');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editMode && editingId) {
        await updatePolicy(editingId, form);
        toast.success('Policy updated');
      } else {
        await addPolicy(form);
        toast.success('Policy added');
      }
      setModalOpen(false);
      fetchPolicies();
    } catch {
      toast.error('Failed to save policy');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout userRole="VENDOR">
      <div className="max-w-2xl mx-auto py-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Business Policies</CardTitle>
            <Button onClick={openAddModal}>Add Policy</Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center">Loading...</div>
            ) : policies.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">No policies found.</div>
            ) : (
              <div className="space-y-4">
                {policies.map(policy => (
                  <div key={policy.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-gray-50">
                    <div>
                      <div className="font-semibold text-lg">{policy.title}</div>
                      <div className="text-xs text-gray-400 mb-1">{policyTypes.find(t => t.value === policy.type)?.label || policy.type}</div>
                      <div className="text-sm text-gray-600 whitespace-pre-line">{policy.description}</div>
                    </div>
                    <div className="flex gap-2 mt-2 md:mt-0">
                      <Button size="sm" variant="outline" onClick={() => openEditModal(policy)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(policy.id)}>Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Modal for Add/Edit */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{editMode ? 'Edit Policy' : 'Add Policy'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <select id="type" name="type" value={form.type} onChange={handleInputChange} className="w-full border rounded px-3 py-2">
                {policyTypes.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={form.title} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={form.description} onChange={handleInputChange} rows={4} required />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Saving...' : (editMode ? 'Save Changes' : 'Add')}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default VendorPoliciesPage; 