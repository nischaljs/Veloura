
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getVendorProfile, updateVendorProfile } from "@/services/vendor";
import { Vendor } from "@/types";

const VendorProfilePage = () => {
  const [profile, setProfile] = useState<Vendor | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await getVendorProfile();
      setProfile(response.data.vendor);
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profile) {
      await updateVendorProfile(profile);
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Vendor Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
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
