
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Warehouse = {
  warehouseId: string;
  warehouseName: string;
  location: string;
  totalUnits: number;
  reservedUnits: number;
  availableUnits: number;
};

type Product = {
  id: string;
  name: string;
  warehouses: Warehouse[];
};

export default function HomePage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creatingId, setCreatingId] =
    useState<string | null>(null);

  const [quantities, setQuantities] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products");

      if (!res.ok) {
        throw new Error(
          "Failed to fetch products"
        );
      }

      const data = await res.json();

      setProducts(data);
    } catch (error) {
      console.error(error);

      setError(
        "Failed to load inventory"
      );
    } finally {
      setLoading(false);
    }
  }

  function increaseQuantity(
    warehouseId: string,
    availableUnits: number
  ) {
    setQuantities((prev) => {
      const current =
        prev[warehouseId] || 1;

      return {
        ...prev,
        [warehouseId]: Math.min(
          current + 1,
          availableUnits
        ),
      };
    });
  }

  function decreaseQuantity(
    warehouseId: string
  ) {
    setQuantities((prev) => {
      const current =
        prev[warehouseId] || 1;

      return {
        ...prev,
        [warehouseId]: Math.max(
          current - 1,
          1
        ),
      };
    });
  }

  async function reserveInventory(
    productId: string,
    warehouseId: string
  ) {
    try {
      setError("");
      setCreatingId(warehouseId);

      const quantity =
        quantities[warehouseId] || 1;

      const res = await fetch(
        "/api/reservations",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            productId,
            warehouseId,
            quantity,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.error ||
            "Reservation failed"
        );

        return;
      }

      if (!data?.id) {
        setError(
          "Reservation ID missing"
        );

        return;
      }

      router.push(
        `/reservations/${data.id}`
      );
    } catch (error) {
      console.error(error);

      setError("Something went wrong");
    } finally {
      setCreatingId(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-3xl font-bold">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-5xl md:text-7xl font-black">
              Allo Inventory
            </h1>

            <p className="mt-3 text-zinc-400 text-lg">
              Multi-warehouse inventory
              reservation system
            </p>
          </div>

          <div className="hidden md:flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3">
            <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse" />

            <span className="text-sm text-zinc-300">
              Live Inventory
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-8 rounded-2xl border border-red-500/30 bg-red-500/20 p-4 text-red-300">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
          {products.map((product) => (
            <div
              key={product.id}
              className="min-h-[760px] rounded-[32px] border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8"
            >
              <div className="mb-8 flex items-start justify-between">
                <div>
                  <h2 className="text-4xl font-bold">
                    {product.name}
                  </h2>

                  <p className="mt-2 text-zinc-500">
                    Live warehouse inventory
                  </p>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-fuchsia-600 text-2xl">
                  📦
                </div>
              </div>

              <div className="space-y-6">
                {product.warehouses.map(
                  (warehouse) => {
                    const quantity =
                      quantities[
                        warehouse.warehouseId
                      ] || 1;

                    return (
                      <div
                        key={
                          warehouse.warehouseId
                        }
                        className="rounded-3xl border border-white/10 bg-black/30 p-6"
                      >
                        <div className="mb-6 flex items-start justify-between">
                          <div>
                            <h3 className="text-2xl font-bold">
                              {
                                warehouse.warehouseName
                              }
                            </h3>

                            <p className="mt-1 text-zinc-500">
                              {
                                warehouse.location
                              }
                            </p>
                          </div>

                          <div className="rounded-full bg-blue-500/20 px-4 py-2 text-sm font-semibold text-blue-300">
                            Warehouse
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="rounded-3xl bg-black/40 p-5 border border-white/5">
                            <p className="text-zinc-500 text-sm mb-3">
                              Total
                            </p>

                            <h4 className="text-4xl font-black">
                              {warehouse.totalUnits}
                            </h4>
                          </div>

                          <div className="rounded-3xl bg-black/40 p-5 border border-white/5">
                            <p className="text-zinc-500 text-sm mb-3">
                              Reserved
                            </p>

                            <h4 className="text-4xl font-black">
                              {
                                warehouse.reservedUnits
                              }
                            </h4>
                          </div>

                          <div className="rounded-3xl bg-black/40 p-5 border border-white/5">
                            <p className="text-zinc-500 text-sm mb-3">
                              Available
                            </p>

                            <h4 className="text-4xl font-black text-emerald-400">
                              {
                                warehouse.availableUnits
                              }
                            </h4>
                          </div>
                        </div>

                        <div className="mb-5 flex items-center justify-center gap-4">
                          <button
                            onClick={() =>
                              decreaseQuantity(
                                warehouse.warehouseId
                              )
                            }
                            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl font-bold hover:bg-white/10 transition"
                          >
                            -
                          </button>

                          <div className="flex h-12 min-w-[90px] items-center justify-center rounded-2xl border border-white/10 bg-black/40 px-6 text-xl font-bold">
                            {quantity}
                          </div>

                          <button
                            onClick={() =>
                              increaseQuantity(
                                warehouse.warehouseId,
                                warehouse.availableUnits
                              )
                            }
                            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl font-bold hover:bg-white/10 transition"
                          >
                            +
                          </button>
                        </div>

                        <button
                          disabled={
                            warehouse.availableUnits ===
                              0 ||
                            creatingId ===
                              warehouse.warehouseId
                          }
                          onClick={() =>
                            reserveInventory(
                              product.id,
                              warehouse.warehouseId
                            )
                          }
                          className={`w-full rounded-3xl py-5 text-xl font-bold tracking-tight transition-all duration-300 ${
                            warehouse.availableUnits ===
                              0 ||
                            creatingId ===
                              warehouse.warehouseId
                              ? "cursor-not-allowed bg-zinc-800 text-zinc-500"
                              : "bg-gradient-to-r from-blue-500 via-indigo-500 to-fuchsia-600 hover:scale-[1.02] hover:shadow-2xl hover:shadow-fuchsia-500/25"
                          }`}
                        >
                          {creatingId ===
                          warehouse.warehouseId
                            ? "Creating Reservation..."
                            : warehouse.availableUnits ===
                              0
                            ? "Out of Stock"
                            : `Reserve ${quantity} Item${
                                quantity > 1
                                  ? "s"
                                  : ""
                              }`}
                        </button>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

