import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getPayoutRequests, approvePayoutRequest, rejectPayoutRequest } from "@/services/admin";
import type { PayoutRequest } from "@/types";

const AdminPayoutsPage = () => {
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        const response = await getPayoutRequests();
        setPayouts(response.data.payouts);
      } catch (error) {
        setError("Failed to fetch payout requests.");
      }
    };
    fetchPayouts();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await approvePayoutRequest(id);
      setPayouts(payouts.map(p => p.id === id ? { ...p, status: 'PAID' } : p));
    } catch (error) {
      setError("Failed to approve payout request.");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await rejectPayoutRequest(id);
      setPayouts(payouts.map(p => p.id === id ? { ...p, status: 'REJECTED' } : p));
    } catch (error) {
      setError("Failed to reject payout request.");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Payout Requests</h1>
      {error && <p className="text-red-500">{error}</p>}
      <Card>
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell>{payout.vendorId}</TableCell>
                  <TableCell>{payout.amount}</TableCell>
                  <TableCell>{payout.status}</TableCell>
                  <TableCell>{new Date(payout.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {payout.status === 'PENDING' && (
                      <div className="flex space-x-2">
                        <Button onClick={() => handleApprove(payout.id)} size="sm">Approve</Button>
                        <Button onClick={() => handleReject(payout.id)} size="sm" variant="destructive">Reject</Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPayoutsPage;

