
export interface PayoutRequest {
  id: number;
  vendorId: number;
  amount: number;
  status: string; // e.g., 'PENDING', 'PAID', 'REJECTED'
  createdAt: string;
  updatedAt: string;
}
