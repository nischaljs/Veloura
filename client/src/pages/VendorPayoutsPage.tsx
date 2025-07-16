
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getPayoutRequests, createPayoutRequest } from "@/services/vendor";
import { PayoutRequest } from "@/types";

const VendorPayoutsPage = () => {
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  const handleRequestPayout = async () => {
    try {
      const response = await createPayoutRequest(parseFloat(amount));
      setPayouts([response.data.payout, ...payouts]);
      setSuccess("Payout request submitted successfully.");
      setAmount("");
    } catch (error) {
      setError("Failed to submit payout request.");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Payouts</h1>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Request a Payout</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="max-w-xs"
            />
            <Button onClick={handleRequestPayout}>Request</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell>{payout.amount}</TableCell>
                  <TableCell>{payout.status}</TableCell>
                  <TableCell>{new Date(payout.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorPayoutsPage;
