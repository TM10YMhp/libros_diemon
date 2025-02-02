"use client";

import { UserProvider } from "./context";
import { CartProvider } from "./features/cart/context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <UserProvider>{children}</UserProvider>
    </CartProvider>
  );
}
