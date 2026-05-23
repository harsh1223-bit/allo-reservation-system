import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const reservation = await prisma.reservation.findUnique({
      where: {
        id,
      },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    if (reservation.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Reservation expired" },
        { status: 410 }
      );
    }

    const updatedReservation =
      await prisma.reservation.update({
        where: {
          id,
        },
        data: {
          status: "CONFIRMED",
        },
      });

    return NextResponse.json(updatedReservation);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to confirm reservation" },
      { status: 500 }
    );
  }
}