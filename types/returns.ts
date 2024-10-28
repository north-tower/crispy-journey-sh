export type ReturnStatus = "pending" | "approved" | "rejected";

export interface ReturnOrder {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
  };
  returnReason: string;
  status: ReturnStatus;
  amount: number;
  date: string;
  items: ReturnItem[];
  notes?: string;
}

export interface ReturnItem {
  id: string;
  productName: string;
  quantity: number;
  reason: string;
  condition: "new" | "used" | "damaged";
  refundAmount: number;
}
