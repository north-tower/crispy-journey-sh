// types/orders.ts
export type OrderStatus = "PENDING" | "PROCESSING" | "ready" | "SHIPPED";
export type PaymentStatus = "paid" | "unpaid" | "refunded";
export type OrderPriority = "high" | "medium" | "low";

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  priority: OrderPriority;
  items: OrderItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
  shippingAddress: string;
  notes?: string;
  expectedDelivery?: string;
}

export interface ActiveOrdersListProps {
  orders: Order[];
  loading: boolean;
  error: Error | null;
  onRefresh: () => void;
}
