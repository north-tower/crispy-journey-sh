// types/stock.ts
export type StockAction = "increase" | "decrease" | "restock" | "adjustment";

export interface StockTransaction {
  id: string;
  productId: string;
  productName: string;
  action: StockAction;
  quantity: number;
  previousStock: number;
  currentStock: number;
  timestamp: string;
  userId: string;
  userName: string;
  note?: string;
}

export interface StockHistoryFilters {
  action?: StockAction;
  dateRange?: [Date, Date];
  productId?: string;
  userId?: string;
}
