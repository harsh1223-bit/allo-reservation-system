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

  useEffect(() => {
    async function fetchReservation() {
      try {
        const res = await fetch(
          `/api/reservations/${params.id}`
        );

        if (!res.ok) {
          console.error(
            "Failed to fetch reservation"
          );
          return;
        }

        const data = await res.json();

        setReservation(data);
      } catch (error) {
        console.error(error);
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
      const res = await fetch(
        `/api/reservations/${reservation.id}/confirm`,
        {
          method: "POST",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(
          data.error ||
            "Failed to confirm reservation"
        );

        return;
      }

      setReservation(data);

      alert("Reservation confirmed!");
    } catch (error) {
      console.error(error);
    }
  }

  async function cancelReservation() {
    try {
      const res = await fetch(
        `/api/reservations/${reservation.id}/release`,
        {
          method: "POST",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(
          data.error ||
            "Failed to cancel reservation"
        );

        return;
      }

      alert("Reservation cancelled!");

      router.push("/");
    } catch (error) {
      console.error(error);
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
    <main className="min-h-screen bg-black text-white p-6">
      <button
        onClick={() => router.push("/")}
        className="mb-6 text-gray-400 hover:text-white text-lg"
      >
        ← Back
      </button>

      <div className="max-w-6xl mx-auto rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-8 md:p-10">
        <div className="flex items-start justify-between">
          <h1 className="text-6xl md:text-7xl font-bold">
            Reservation
          </h1>

          <div className="bg-red-500/20 text-red-400 px-6 py-3 rounded-2xl text-xl font-bold">
            {timeLeft}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-8 mt-12 text-xl md:text-2xl">
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
            {reservation.warehouse?.name ||
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
          <div className="mt-10 flex flex-col md:flex-row gap-5">
            <button
              onClick={
                confirmReservation
              }
              disabled={
                reservation.status ===
                "CONFIRMED"
              }
              className="flex-1 rounded-2xl bg-green-500 py-4 text-lg md:text-2xl font-bold hover:bg-green-400 transition disabled:opacity-50"
            >
              {reservation.status ===
              "CONFIRMED"
                ? "Reservation Confirmed"
                : "Confirm Purchase"}
            </button>

            <button
              onClick={
                cancelReservation
              }
              disabled={
                reservation.status ===
                "CONFIRMED"
              }
              className="flex-1 rounded-2xl bg-pink-600 py-4 text-lg md:text-2xl font-bold hover:bg-pink-500 transition disabled:opacity-50"
            >
              Cancel Reservation
            </button>
          </div>
        )}

        {reservation.status ===
          "RELEASED" && (
          <div className="mt-10 rounded-2xl border border-red-500/30 bg-red-500/20 p-6 text-center text-2xl font-bold text-red-400">
            Reservation Expired
          </div>
        )}
      </div>
    </main>
  );
}