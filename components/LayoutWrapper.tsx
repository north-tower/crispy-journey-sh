"use client";

import { AuthProvider } from "@/lib/context/AuthContext";
import { usePathname } from "next/navigation";


export default function LayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <AuthProvider>
      
       
        {children}
     
    </AuthProvider>
  );
}
