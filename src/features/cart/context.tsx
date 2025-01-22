import { Provider, atom, useAtomValue, useSetAtom } from "jotai";
import type { CartItem, Product } from "./types";

import { useCallback, useMemo } from "react";

const cartAtom = atom<CartItem[]>([]);

export function CartProvider({ children }: { children: React.ReactNode }) {
  return <Provider>{children}</Provider>;
}

export function useCartState() {
  const cart = useAtomValue(cartAtom);

  const { total, quantity } = useMemo(
    () =>
      cart.reduce(
        (acc, item) => {
          acc.total += item.price * item.quantity;
          acc.quantity += item.quantity;

          return acc;
        },
        { total: 0, quantity: 0 },
      ),
    [cart],
  );

  return { cart, total, quantity };
}

export function useCartUpdater() {
  const setCart = useSetAtom(cartAtom);

  const editCart = (
    cart: CartItem[],
    product: Product,
    action: "increment" | "decrement",
  ): CartItem[] => {
    const mapCart = new Map(cart.map((item) => [item.id, item]));

    const item = mapCart.get(product.id);

    if (item === undefined) {
      return cart.concat({ ...product, quantity: 1 });
    }

    switch (action) {
      case "increment":
        mapCart.set(item.id, { ...item, quantity: item.quantity + 1 });
        break;
      case "decrement":
        if (item.quantity === 1) {
          mapCart.delete(item.id);
        } else {
          mapCart.set(item.id, { ...item, quantity: item.quantity - 1 });
        }
        break;
    }

    return Array.from(mapCart.values());
  };

  const addItem = useCallback((value: Product) => {
    setCart((cart) => editCart(cart, value, "increment"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeItem = useCallback((value: Product) => {
    setCart((cart) => editCart(cart, value, "decrement"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { addItem, removeItem };
}
