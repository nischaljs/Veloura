import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { getVendorProfile, updateVendorProfile, uploadLogo } from '../services/vendor';
import { Vendor } from '../types';
import { toast } from 'sonner';

const VendorProfilePage: React.FC = () => {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    businessName: '',
    businessEmail: '',
    businessPhone: '',
    description: '',
    website: '',
    facebook: '',
    instagram: '',
    twitter: ''
  });

  useEffect(() => {
    setLoading(true);
    getVendorProfile()
      .then(res => {
        const v = res.data.data.vendor;
        setVendor(v);
        setForm({
          businessName: v.businessName || '',
          businessEmail: v.businessEmail || '',
          businessPhone: v.businessPhone || '',
          description: v.description || '',
          website: v.website || '',
          facebook: v.facebook || '',
          instagram: v.instagram || '',
          twitter: v.twitter || ''
        });
        setLogoPreview(v.logo || null);
      })
      .catch(() => toast.error('Failed to load vendor profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleLogoUpload = async () => {
    if (!logoFile) return;
    try {
      const res = await uploadLogo(logoFile);
      setLogoPreview(res.data.data.vendor.logo);
      setLogoFile(null);
      toast.success('Logo updated!');
    } catch {
      toast.error('Failed to upload logo');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateVendorProfile(form);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <DashboardLayout userRole="VENDOR"><div className="flex items-center justify-center h-64">Loading...</div></DashboardLayout>;
  }

  return (
    <DashboardLayout userRole="VENDOR">
      <div className="max-w-2xl mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Business Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Logo Upload */}
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-lg bg-gray-100 border flex items-center justify-center overflow-hidden">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl text-gray-400">🏪</span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="logo">Business Logo</Label>
                  <Input id="logo" type="file" accept="image/*" onChange={handleLogoChange} />
                  {logoFile && (
                    <Button type="button" size="sm" onClick={handleLogoUpload}>
                      Upload Logo
                    </Button>
                  )}
                </div>
              </div>
              {/* Business Info Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input id="businessName" name="businessName" value={form.businessName} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessEmail">Business Email</Label>
                  <Input id="businessEmail" name="businessEmail" value={form.businessEmail} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessPhone">Business Phone</Label>
                  <Input id="businessPhone" name="businessPhone" value={form.businessPhone} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" name="website" value={form.website} onChange={handleInputChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={form.description} onChange={handleInputChange} rows={3} />
              </div>
              {/* Socials */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input id="facebook" name="facebook" value={form.facebook} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input id="instagram" name="instagram" value={form.instagram} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input id="twitter" name="twitter" value={form.twitter} onChange={handleInputChange} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default VendorProfilePage; 