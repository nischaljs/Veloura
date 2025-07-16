
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getVendors, approveVendor } from "@/services/admin";
import { Vendor } from "@/types";

const AdminVendorsPage = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);

  useEffect(() => {
    const fetchVendors = async () => {
      const response = await getVendors();
      setVendors(response.data.vendors);
    };
    fetchVendors();
  }, []);

  const handleApprove = async (id: number) => {
    await approveVendor(id);
    setVendors(vendors.map(v => v.id === id ? { ...v, isApproved: true } : v));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Vendors</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Business Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Approved</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors.map((vendor) => (
            <TableRow key={vendor.id}>
              <TableCell>{vendor.id}</TableCell>
              <TableCell>{vendor.businessName}</TableCell>
              <TableCell>{vendor.businessEmail}</TableCell>
              <TableCell>{vendor.isApproved ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                {!vendor.isApproved && (
                  <Button onClick={() => handleApprove(vendor.id)} size="sm">
                    Approve
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminVendorsPage;
