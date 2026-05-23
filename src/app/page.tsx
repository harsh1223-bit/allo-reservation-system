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

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();

      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left,#172554,#020617,#000)",
        color: "white",
        padding: "40px",
        overflow: "hidden",
      }}
    >
      {/* Background Glow */}
      <div
        style={{
          position: "fixed",
          width: "500px",
          height: "500px",
          background:
            "linear-gradient(135deg,#2563eb,#7c3aed)",
          filter: "blur(140px)",
          opacity: 0.25,
          top: "-150px",
          right: "-150px",
          borderRadius: "999px",
          zIndex: 0,
        }}
      />

      {/* Navbar */}
      <nav
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "60px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "54px",
              fontWeight: 800,
              margin: 0,
              letterSpacing: "-2px",
            }}
          >
            Allo
          </h1>

          <p
            style={{
              marginTop: "6px",
              color: "#94a3b8",
            }}
          >
            Reservation Intelligence Platform
          </p>
        </div>

        <div
          style={{
            background:
              "rgba(255,255,255,0.05)",
            border:
              "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(14px)",
            borderRadius: "18px",
            padding: "14px 20px",
          }}
        >
          <span
            style={{
              color: "#4ade80",
              fontWeight: 600,
            }}
          >
            ● System Online
          </span>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          position: "relative",
          zIndex: 10,
          marginBottom: "50px",
        }}
      >
        <h2
          style={{
            fontSize: "78px",
            lineHeight: 1,
            maxWidth: "900px",
            marginBottom: "24px",
            fontWeight: 900,
            letterSpacing: "-4px",
          }}
        >
          Real-Time Inventory Reservations
        </h2>

        <p
          style={{
            fontSize: "22px",
            color: "#94a3b8",
            maxWidth: "700px",
            lineHeight: 1.6,
          }}
        >
          Intelligent warehouse inventory allocation
          with reservation locking, expiration handling,
          and live availability tracking.
        </p>
      </section>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(240px,1fr))",
          gap: "24px",
          marginBottom: "60px",
          position: "relative",
          zIndex: 10,
        }}
      >
        {[
          {
            title: "Products",
            value: products.length,
          },
          {
            title: "Warehouses",
            value: products.reduce(
              (acc, p) =>
                acc + (p.warehouses?.length || 0),
              0
            ),
          },
          {
            title: "Reservations",
            value: "Live",
          },
        ].map((stat, index) => (
          <div
            key={index}
            style={{
              background:
                "rgba(255,255,255,0.04)",
              border:
                "1px solid rgba(255,255,255,0.08)",
              borderRadius: "28px",
              padding: "28px",
              backdropFilter: "blur(18px)",
            }}
          >
            <p
              style={{
                color: "#94a3b8",
                marginBottom: "10px",
              }}
            >
              {stat.title}
            </p>

            <h2
              style={{
                fontSize: "42px",
                margin: 0,
              }}
            >
              {stat.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Products */}
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(520px,1fr))",
            gap: "32px",
            position: "relative",
            zIndex: 10,
          }}
        >
          {products?.map((product) => (
            <div
              key={product.id}
              style={{
                background:
                  "rgba(255,255,255,0.05)",
                border:
                  "1px solid rgba(255,255,255,0.08)",
                borderRadius: "34px",
                padding: "32px",
                backdropFilter: "blur(20px)",
                boxShadow:
                  "0 20px 50px rgba(0,0,0,0.35)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  marginBottom: "30px",
                }}
              >
                <h2
                  style={{
                    fontSize: "48px",
                    margin: 0,
                    fontWeight: 800,
                  }}
                >
                  {product.name}
                </h2>

                <div
                  style={{
                    background:
                      "linear-gradient(135deg,#2563eb,#7c3aed)",
                    padding:
                      "10px 16px",
                    borderRadius: "999px",
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                  LIVE
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "22px",
                }}
              >
                {product.warehouses?.map(
                  (warehouse) => (
                    <div
                      key={
                        warehouse.warehouseId
                      }
                      style={{
                        background:
                          "rgba(255,255,255,0.03)",
                        border:
                          "1px solid rgba(255,255,255,0.05)",
                        borderRadius: "24px",
                        padding: "24px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "center",
                          marginBottom:
                            "20px",
                        }}
                      >
                        <div>
                          <h3
                            style={{
                              fontSize:
                                "28px",
                              margin: 0,
                            }}
                          >
                            {
                              warehouse.warehouseName
                            }
                          </h3>

                          <p
                            style={{
                              color:
                                "#94a3b8",
                            }}
                          >
                            {
                              warehouse.location
                            }
                          </p>
                        </div>

                        <div
                          style={{
                            width: "14px",
                            height: "14px",
                            borderRadius:
                              "999px",
                            background:
                              "#4ade80",
                            boxShadow:
                              "0 0 20px #4ade80",
                          }}
                        />
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(3,1fr)",
                          gap: "16px",
                        }}
                      >
                        {[
                          {
                            label: "Total",
                            value:
                              warehouse.totalUnits,
                          },
                          {
                            label:
                              "Reserved",
                            value:
                              warehouse.reservedUnits,
                          },
                          {
                            label:
                              "Available",
                            value:
                              warehouse.availableUnits,
                          },
                        ].map(
                          (
                            item,
                            index
                          ) => (
                            <div
                              key={index}
                              style={{
                                background:
                                  "#020617",
                                padding:
                                  "18px",
                                borderRadius:
                                  "18px",
                              }}
                            >
                              <p
                                style={{
                                  color:
                                    "#94a3b8",
                                  marginBottom:
                                    "8px",
                                }}
                              >
                                {
                                  item.label
                                }
                              </p>

                              <h2
                                style={{
                                  margin: 0,
                                  color:
                                    item.label ===
                                    "Available"
                                      ? "#4ade80"
                                      : "white",
                                }}
                              >
                                {
                                  item.value
                                }
                              </h2>
                            </div>
                          )
                        )}
                      </div>

                      <button
                        onClick={async () => {
                          const res =
                            await fetch(
                              "/api/reservations",
                              {
                                method:
                                  "POST",
                                headers:
                                  {
                                    "Content-Type":
                                      "application/json",
                                  },
                                body: JSON.stringify(
                                  {
                                    productId:
                                      product.id,
                                    warehouseId:
                                      warehouse.warehouseId,
                                    quantity: 1,
                                  }
                                ),
                              }
                            );

                          const data =
                            await res.json();

                          if (!res.ok) {
                            alert(
                              data.error
                            );
                            return;
                          }

                          router.push(
                            `/reservation/${data.id}`
                          );
                        }}
                        style={{
                          width: "100%",
                          marginTop: "24px",
                          border: "none",
                          borderRadius:
                            "18px",
                          padding:
                            "18px",
                          background:
                            "linear-gradient(135deg,#2563eb,#7c3aed)",
                          color: "white",
                          fontWeight: 700,
                          fontSize: "16px",
                          boxShadow:
                            "0 10px 30px rgba(99,102,241,0.35)",
                        }}
                      >
                        Reserve Inventory
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}