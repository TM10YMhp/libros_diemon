"use client";

import { useCartState, useCartUpdater } from "@/features/cart/context";

/* eslint-disable @next/next/no-img-element */

const parseCurrency = (value: number): string => {
  return value.toLocaleString("es-PE", {
    style: "currency",
    currency: "PEN",
  });
};

function DrawerContent() {
  const { cart, quantity, total } = useCartState();
  const { addItem, removeItem } = useCartUpdater();

  if (!cart.length) {
    return <p>No hay elementos</p>;
  }

  return (
    <>
      <div className="space-y-4">
        {cart.map((product) => (
          <div key={product.id} className="flex flex-row gap-2 h-24">
            <img src={product.image} alt="" />
            <div className="flex-1">
              <p className="font-bold">{product.title}</p>
              <p className="line-clamp-3 text-neutral-content">
                {product.description}
              </p>
            </div>
            <div className="flex flex-col gap-2 items-center justify-center">
              <p className="text-neutral-content">
                {parseCurrency(product.price)} cada
              </p>
              <div className="join">
                <button
                  className="join-item btn btn-primary w-8 h-8"
                  onClick={() => removeItem(product)}
                >
                  -
                </button>
                <button className="join-item btn !text-white !border-primary btn-disabled w-8 h-8">
                  {product.quantity}
                </button>
                <button
                  className="join-item btn btn-primary w-8 h-8"
                  onClick={() => addItem(product)}
                >
                  +
                </button>
              </div>
              <p>{parseCurrency(product.price * product.quantity)}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="btn btn-primary text-white">
        <img
          loading="lazy"
          src={"https://icongr.am/material/whatsapp.svg?color=ffffff"}
          style={{ width: "28px" }}
          alt=""
        />
        <span className="flex flex-row gap-1 items-center">
          {quantity} {quantity === 1 ? "producto" : "productos"} (total:
          <img
            className="inline"
            src="https://cryptologos.cc/logos/dogebonk-dobo-logo.svg?v=040"
            alt="memecoin"
            width={22}
          />
          {total})
        </span>
      </button>
    </>
  );
}

// https://www.mcmaster.com/
export function Drawer() {
  const { quantity, total } = useCartState();

  return (
    <div className="drawer drawer-end sticky bottom-0">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      {quantity > 0 && (
        <div className="drawer-content pb-4 mx-auto">
          <label
            htmlFor="my-drawer"
            className={[
              "drawer-button",
              "btn btn-primary text-white",
              "shadow-lg shadow-zinc-900",
            ].join(" ")}
          >
            <img
              loading="lazy"
              src="https://icongr.am/material/whatsapp.svg?color=ffffff"
              width="28"
              alt="whatsapp icon"
            />
            <span className="flex flex-row gap-1 items-center">
              {quantity} {quantity === 1 ? "producto" : "productos"} (total:
              <img
                className="inline"
                src="https://cryptologos.cc/logos/dogebonk-dobo-logo.svg?v=040"
                alt="memecoin"
                width={22}
              />
              {total})
            </span>
          </label>
        </div>
      )}

      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        />
        <div
          className={[
            "menu bg-base-200 min-h-full p-4 w-96",
            "grid grid-rows-[auto_1fr_auto] grid-cols-1",
            "gap-8 z-50",
            "max-sm:w-[90%]",
          ].join(" ")}
        >
          <p className="text-xl font-bold">Libros Canjeados</p>
          <DrawerContent />
        </div>
      </div>
    </div>
  );
}
