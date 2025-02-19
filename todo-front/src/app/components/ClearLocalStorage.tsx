// app/components/ClearLocalStorage.tsx
'use client';

import { useEffect } from "react";

export default function ClearLocalStorage({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
  }, []);

  return <>{children}</>;
}
