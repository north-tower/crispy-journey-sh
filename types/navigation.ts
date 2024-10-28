import {
  BarChart2,
  LayoutGrid,
  Package,
  Settings,
  ShoppingCart,
} from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon: any;
  children?: { name: string; href: string }[];
}

export const navigation: NavItem[] = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutGrid,
  },
  {
    name: "Products",
    href: "/products",
    icon: Package,
    children: [
      { name: "All Products", href: "/products" },
      { name: "Inventory", href: "/products/inventory" },
      { name: "Pricing", href: "/products/pricing" },
    ],
  },
  {
    name: "Orders",
    href: "/orders",
    icon: ShoppingCart,
    children: [
      { name: "Active Orders", href: "/orders/active" },
      { name: "Completed", href: "/orders/completed" },
      { name: "Returns", href: "/orders/returns" },
    ],
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart2,
    children: [
      { name: "Sales Overview", href: "/reports/sales" },
      { name: "Performance", href: "/reports/performance" },
    ],
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    children: [
      { name: "Account", href: "/settings/account" },
      { name: "Store", href: "/settings/store" },
    ],
  },
];

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}
