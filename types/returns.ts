import { OrderItem } from "./orders";

export type ReturnStatus = "PENDING" | "APPROVED" | "REJECTED" | 'PROCESSING' | 'ready' | 'SHIPPED';

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
  date: string | number | Date;
  items: OrderItem[];
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
