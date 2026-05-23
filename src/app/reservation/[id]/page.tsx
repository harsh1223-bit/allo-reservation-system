"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ReservationPage() {
  const params = useParams();
  const router = useRouter();

  const reservationId = params.id as string;

  const [reservation, setReservation] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function fetchReservation() {
    try {
      const res = await fetch(`/api/reservations/${reservationId}`);
      const data = await res.json();

      setReservation(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReservation();
  }, []);

  useEffect(() => {
    if (!reservation) return;

    const interval = setInterval(() => {
      const expiry = new Date(reservation.expiresAt).getTime();
      const now = new Date().getTime();

      const distance = expiry - now;

      if (distance <= 0) {
        setTimeLeft("Expired");
        clearInterval(interval);
        return;
      }

      const minutes = Math.floor(distance / 1000 / 60);
      const seconds = Math.floor((distance / 1000) % 60);

      setTimeLeft(
        `${minutes}:${seconds.toString().padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [reservation]);

  async function confirmReservation() {
    const res = await fetch(
      `/api/reservations/${reservationId}/confirm`,
      {
        method: "POST",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error);
      return;
    }

    setReservation(data);
    setMessage("Reservation confirmed!");
  }

  async function cancelReservation() {
    const res = await fetch(
      `/api/reservations/${reservationId}/release`,
      {
        method: "POST",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error);
      return;
    }

    setReservation(data);
    setMessage("Reservation cancelled!");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center text-3xl">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-3xl mx-auto">

        <button
          onClick={() => router.push("/")}
          className="mb-8 text-zinc-400 hover:text-white"
        >
          ← Back
        </button>

        <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-blue-950 p-10 shadow-2xl">

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-5xl font-bold">
              Reservation
            </h1>

            <div className="bg-red-500/20 text-red-400 px-5 py-3 rounded-2xl font-semibold">
              {timeLeft}
            </div>
          </div>

          <div className="space-y-6 text-xl">

            <div className="flex justify-between">
              <span className="text-zinc-400">Reservation ID</span>
              <span>{reservation.id}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-400">Product</span>
              <span>{reservation.productId}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-400">Warehouse</span>
              <span>{reservation.warehouseId}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-400">Quantity</span>
              <span>{reservation.quantity}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-400">Status</span>

              <span
                className={`font-bold ${
                  reservation.status === "CONFIRMED"
                    ? "text-green-400"
                    : reservation.status === "RELEASED"
                    ? "text-red-400"
                    : "text-yellow-400"
                }`}
              >
                {reservation.status}
              </span>
            </div>
          </div>

          {message && (
            <div className="mt-8 rounded-2xl bg-zinc-800 p-4 text-center">
              {message}
            </div>
          )}

          <div className="grid grid-cols-2 gap-6 mt-10">

            <button
              onClick={confirmReservation}
              className="h-16 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-xl font-bold hover:scale-[1.02] transition"
            >
              Confirm Purchase
            </button>

            <button
              onClick={cancelReservation}
              className="h-16 rounded-2xl bg-gradient-to-r from-red-500 to-pink-600 text-xl font-bold hover:scale-[1.02] transition"
            >
              Cancel Reservation
            </button>

          </div>

        </div>
      </div>
    </main>
  );
}