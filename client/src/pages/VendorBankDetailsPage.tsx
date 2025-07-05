import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { getBankDetails, addBankDetail, updateBankDetail, deleteBankDetail } from '../services/vendor';
import { BankDetail } from '../types';
import { toast } from 'sonner';

const emptyForm = {
  bankName: '',
  accountNumber: '',
  accountHolderName: '',
  ifscCode: '',
  branchName: ''
};

const VendorBankDetailsPage: React.FC = () => {
  const [bankDetails, setBankDetails] = useState<BankDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchBankDetails = () => {
    setLoading(true);
    getBankDetails()
      .then(res => setBankDetails(res.data.data.bankDetails || []))
      .catch(() => toast.error('Failed to load bank details'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBankDetails();
  }, []);

  const openAddModal = () => {
    setForm({ ...emptyForm });
    setEditMode(false);
    setEditingId(null);
    setModalOpen(true);
  };

  const openEditModal = (detail: BankDetail) => {
    setForm({
      bankName: detail.bankName || '',
      accountNumber: detail.accountNumber || '',
      accountHolderName: detail.accountHolderName || '',
      ifscCode: detail.ifscCode || '',
      branchName: detail.branchName || ''
    });
    setEditMode(true);
    setEditingId(detail.id);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this bank detail?')) return;
    try {
      await deleteBankDetail(id);
      toast.success('Bank detail deleted');
      fetchBankDetails();
    } catch {
      toast.error('Failed to delete bank detail');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editMode && editingId) {
        await updateBankDetail(editingId, form);
        toast.success('Bank detail updated');
      } else {
        await addBankDetail(form);
        toast.success('Bank detail added');
      }
      setModalOpen(false);
      fetchBankDetails();
    } catch {
      toast.error('Failed to save bank detail');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout userRole="VENDOR">
      <div className="max-w-2xl mx-auto py-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Bank Details</CardTitle>
            <Button onClick={openAddModal}>Add Bank Detail</Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center">Loading...</div>
            ) : bankDetails.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">No bank details found.</div>
            ) : (
              <div className="space-y-4">
                {bankDetails.map(detail => (
                  <div key={detail.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-gray-50">
                    <div>
                      <div className="font-semibold text-lg">{detail.bankName}</div>
                      <div className="text-sm text-gray-600">A/C: {detail.accountNumber}</div>
                      <div className="text-sm text-gray-600">Holder: {detail.accountHolderName}</div>
                      {detail.ifscCode && <div className="text-xs text-gray-400">IFSC: {detail.ifscCode}</div>}
                      {detail.branchName && <div className="text-xs text-gray-400">Branch: {detail.branchName}</div>}
                    </div>
                    <div className="flex gap-2 mt-2 md:mt-0">
                      <Button size="sm" variant="outline" onClick={() => openEditModal(detail)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(detail.id)}>Delete</Button>
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
            <DialogTitle>{editMode ? 'Edit Bank Detail' : 'Add Bank Detail'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input id="bankName" name="bankName" value={form.bankName} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input id="accountNumber" name="accountNumber" value={form.accountNumber} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountHolderName">Account Holder Name</Label>
              <Input id="accountHolderName" name="accountHolderName" value={form.accountHolderName} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ifscCode">IFSC Code</Label>
              <Input id="ifscCode" name="ifscCode" value={form.ifscCode} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="branchName">Branch Name</Label>
              <Input id="branchName" name="branchName" value={form.branchName} onChange={handleInputChange} />
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

export default VendorBankDetailsPage; 