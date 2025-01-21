import type { CartItem, Product } from "./types";

import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

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

  if (action === "decrement") {
    if (item.quantity === 1) {
      mapCart.delete(item.id);
    } else {
      mapCart.set(item.id, { ...item, quantity: item.quantity - 1 });
    }
  } else if (action === "increment") {
    mapCart.set(item.id, { ...item, quantity: item.quantity + 1 });
  }

  return Array.from(mapCart.values());
};

type TCardContext = {
  cart?: CartItem[];
  setCart?: React.Dispatch<React.SetStateAction<CartItem[]>>;
};

const CartStateContext = createContext<TCardContext["cart"]>(undefined);
const CartUpdaterContext = createContext<TCardContext["setCart"]>(undefined);

function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  return (
    <CartStateContext.Provider value={cart}>
      <CartUpdaterContext.Provider value={setCart}>
        {children}
      </CartUpdaterContext.Provider>
    </CartStateContext.Provider>
  );
}

function useCartState() {
  const cart = useContext(CartStateContext);

  if (cart === undefined) {
    throw new Error("useCartState must be used within a CartProvider");
  }

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

function useCartUpdater() {
  const setCart = useContext(CartUpdaterContext);

  if (setCart === undefined) {
    throw new Error("useCartUpdater must be used within a CartProvider");
  }

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

export { CartProvider, useCartState, useCartUpdater };
