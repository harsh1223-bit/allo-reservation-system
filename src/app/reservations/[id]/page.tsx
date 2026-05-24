"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ReservationPage() {
  const params = useParams();
  const router = useRouter();

  const [reservation, setReservation] =
    useState<any>(null);

  const [timeLeft, setTimeLeft] =
    useState("Loading...");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [loadingAction, setLoadingAction] =
    useState(false);

  useEffect(() => {
    async function fetchReservation() {
      try {
        const res = await fetch(
          `/api/reservations/${params.id}`
        );

        if (!res.ok) {
          setError(
            "Failed to fetch reservation"
          );

          return;
        }

        const data = await res.json();

        setReservation(data);
      } catch (error) {
        console.error(error);

        setError(
          "Something went wrong"
        );
      }
    }

    fetchReservation();
  }, [params.id]);

  useEffect(() => {
    if (!reservation?.expiresAt) return;

    const interval = setInterval(() => {
      const expiryTime = new Date(
        reservation.expiresAt
      ).getTime();

      const now = Date.now();

      const difference = expiryTime - now;

      if (difference <= 0) {
        setTimeLeft("Expired");

        setReservation((prev: any) => ({
          ...prev,
          status: "RELEASED",
        }));

        clearInterval(interval);

        return;
      }

      const minutes = Math.floor(
        difference / 1000 / 60
      );

      const seconds = Math.floor(
        (difference / 1000) % 60
      );

      setTimeLeft(
        `${minutes}:${seconds
          .toString()
          .padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [reservation]);

  async function confirmReservation() {
    try {
      setError("");
      setMessage("");
      setLoadingAction(true);

      const res = await fetch(
        `/api/reservations/${reservation.id}/confirm`,
        {
          method: "POST",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.error ||
            "Failed to complete payment"
        );

        return;
      }

      setReservation(data);

      setMessage(
        "Payment completed successfully!"
      );
    } catch (error) {
      console.error(error);

      setError("Something went wrong");
    } finally {
      setLoadingAction(false);
    }
  }

  async function cancelReservation() {
    try {
      setError("");
      setMessage("");
      setLoadingAction(true);

      const res = await fetch(
        `/api/reservations/${reservation.id}/release`,
        {
          method: "POST",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.error ||
            "Failed to cancel checkout"
        );

        return;
      }

      setMessage(
        "Reservation cancelled successfully!"
      );

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error) {
      console.error(error);

      setError("Something went wrong");
    } finally {
      setLoadingAction(false);
    }
  }

  if (!reservation) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-3xl font-bold">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => router.push("/")}
          className="mb-6 text-gray-400 hover:text-white text-lg"
        >
          ← Back
        </button>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/20 p-4 text-red-300">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 rounded-2xl border border-green-500/30 bg-green-500/20 p-4 text-green-300">
            {message}
          </div>
        )}

        <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold">
                Reservation
              </h1>

              <p className="mt-3 text-zinc-400 text-sm md:text-base">
                This demo simulates a
                successful payment
                confirmation flow.
              </p>
            </div>

            <div className="bg-red-500/20 text-red-400 px-5 py-3 rounded-2xl text-lg md:text-2xl font-bold min-w-[110px] text-center">
              {timeLeft}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-6 mt-10 text-base md:text-xl">
            <span className="text-gray-400">
              Reservation ID
            </span>

            <span className="text-right font-semibold break-all">
              {reservation.id}
            </span>

            <span className="text-gray-400">
              Product
            </span>

            <span className="text-right font-semibold">
              {reservation.product?.name ||
                "Unknown Product"}
            </span>

            <span className="text-gray-400">
              Warehouse
            </span>

            <span className="text-right font-semibold">
              {reservation.warehouse
                ?.name ||
                reservation.warehouse
                  ?.warehouseName ||
                "Unknown Warehouse"}
            </span>

            <span className="text-gray-400">
              Quantity
            </span>

            <span className="text-right font-semibold">
              {reservation.quantity}
            </span>

            <span className="text-gray-400">
              Status
            </span>

            <span
              className={`text-right font-bold ${
                reservation.status ===
                "CONFIRMED"
                  ? "text-green-400"
                  : reservation.status ===
                    "RELEASED"
                  ? "text-red-400"
                  : "text-yellow-400"
              }`}
            >
              {reservation.status}
            </span>
          </div>

          {reservation.status !==
            "RELEASED" && (
            <div className="mt-10 flex flex-col md:flex-row gap-4">
              <button
                onClick={
                  confirmReservation
                }
                disabled={
                  reservation.status ===
                    "CONFIRMED" ||
                  loadingAction
                }
                className="flex-1 rounded-2xl bg-green-500 py-4 text-lg md:text-xl font-bold hover:bg-green-400 transition disabled:opacity-50"
              >
                {loadingAction
                  ? "Processing..."
                  : reservation.status ===
                    "CONFIRMED"
                  ? "Payment Completed"
                  : "Complete Payment"}
              </button>

              <button
                onClick={
                  cancelReservation
                }
                disabled={
                  reservation.status ===
                    "CONFIRMED" ||
                  loadingAction
                }
                className="flex-1 rounded-2xl bg-pink-600 py-4 text-lg md:text-xl font-bold hover:bg-pink-500 transition disabled:opacity-50"
              >
                Cancel Checkout
              </button>
            </div>
          )}

          {reservation.status ===
            "RELEASED" && (
            <div className="mt-10 rounded-2xl border border-red-500/30 bg-red-500/20 p-6 text-center text-xl md:text-2xl font-bold text-red-400">
              Reservation Expired
            </div>
          )}
        </div>
      </div>
    </main>
  );
}