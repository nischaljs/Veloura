import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getVendorProfile, updateVendorProfile, uploadLogo, uploadBanner } from "@/services/vendor";
import type { Vendor } from "@/types";

const VendorProfilePage = () => {
  const [profile, setProfile] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [logoUploading, setLogoUploading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [logoError, setLogoError] = useState("");
  const [bannerError, setBannerError] = useState("");
  const [logoSuccess, setLogoSuccess] = useState("");
  const [bannerSuccess, setBannerSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getVendorProfile();
        setProfile(response.data.vendor);
      } catch (err) {
        setError("Failed to load profile. Please login as a vendor.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profile) {
      await updateVendorProfile(profile);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    setLogoError("");
    setLogoSuccess("");
    try {
      await uploadLogo(file);
      setLogoSuccess("Logo uploaded!");
      setTimeout(() => setLogoSuccess(""), 1500);
      // Refresh profile
      const response = await getVendorProfile();
      setProfile(response.data.vendor);
    } catch (err) {
      setLogoError("Failed to upload logo");
    } finally {
      setLogoUploading(false);
    }
  };
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerUploading(true);
    setBannerError("");
    setBannerSuccess("");
    try {
      await uploadBanner(file);
      setBannerSuccess("Banner uploaded!");
      setTimeout(() => setBannerSuccess(""), 1500);
      // Refresh profile
      const response = await getVendorProfile();
      setProfile(response.data.vendor);
    } catch (err) {
      setBannerError("Failed to upload banner");
    } finally {
      setBannerUploading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!profile) return <div className="p-8 text-center text-red-500">Profile not found.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Vendor Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Vendor Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Logo Upload */}
          <div className="mb-4">
            <div className="flex items-center gap-4">
              {profile?.logo ? (
                <img src={profile.logo} alt="Logo" className="w-20 h-20 rounded-full object-cover border" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-2xl text-gray-400">Logo</div>
              )}
              <div>
                <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={logoUploading} />
                {logoUploading && <div className="text-xs text-gray-500">Uploading...</div>}
                {logoError && <div className="text-xs text-red-500">{logoError}</div>}
                {logoSuccess && <div className="text-xs text-green-600">{logoSuccess}</div>}
              </div>
            </div>
          </div>
          {/* Banner Upload */}
          <div className="mb-4">
            <div className="flex items-center gap-4">
              {profile?.banner ? (
                <img src={profile.banner} alt="Banner" className="w-40 h-20 rounded object-cover border" />
              ) : (
                <div className="w-40 h-20 rounded bg-gray-100 flex items-center justify-center text-2xl text-gray-400">Banner</div>
              )}
              <div>
                <input type="file" accept="image/*" onChange={handleBannerUpload} disabled={bannerUploading} />
                {bannerUploading && <div className="text-xs text-gray-500">Uploading...</div>}
                {bannerError && <div className="text-xs text-red-500">{bannerError}</div>}
                {bannerSuccess && <div className="text-xs text-green-600">{bannerSuccess}</div>}
              </div>
            </div>
          </div>
          <form onSubmit={handleUpdate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={profile.businessName}
                  onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="businessEmail">Business Email</Label>
                <Input
                  id="businessEmail"
                  type="email"
                  value={profile.businessEmail}
                  onChange={(e) => setProfile({ ...profile, businessEmail: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="businessPhone">Business Phone</Label>
                <Input
                  id="businessPhone"
                  value={profile.businessPhone}
                  onChange={(e) => setProfile({ ...profile, businessPhone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={profile.website || ''}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                />
              </div>
            </div>
            <Button type="submit" className="mt-6">Update Profile</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorProfilePage;

