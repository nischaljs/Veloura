import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { getSettings, updateSettings } from '../services/admin';
import { toast } from 'sonner';

interface Settings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  // Add other settings as needed
}

const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({ 
    siteName: '', 
    siteDescription: '', 
    contactEmail: '', 
    contactPhone: '', 
    address: '' 
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getSettings();
        setSettings(res.data.data.settings);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch settings');
        toast.error(err.response?.data?.message || 'Failed to fetch settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(settings);
      toast.success('Settings updated successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout userRole="ADMIN">
        <div className="w-full px-8 py-8">
          <h1 className="text-3xl font-bold mb-6">System Settings</h1>
          <Card>
            <CardHeader><CardTitle>Loading Settings...</CardTitle></CardHeader>
            <CardContent>Loading...</CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout userRole="ADMIN">
        <div className="w-full px-8 py-8">
          <h1 className="text-3xl font-bold mb-6">System Settings</h1>
          <Card>
            <CardHeader><CardTitle>Error</CardTitle></CardHeader>
            <CardContent className="text-red-500">{error}</CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="ADMIN">
      <div className="w-full px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">System Settings</h1>
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input id="siteName" name="siteName" value={settings.siteName} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea id="siteDescription" name="siteDescription" value={settings.siteDescription} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input id="contactEmail" name="contactEmail" type="email" value={settings.contactEmail} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input id="contactPhone" name="contactPhone" value={settings.contactPhone} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" name="address" value={settings.address} onChange={handleInputChange} />
              </div>
              <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettingsPage;