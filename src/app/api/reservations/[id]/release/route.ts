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

    await prisma.$transaction([
      prisma.inventory.update({
        where: {
          productId_warehouseId: {
            productId: reservation.productId,
            warehouseId: reservation.warehouseId,
          },
        },
        data: {
          reservedUnits: {
            decrement: reservation.quantity,
          },
        },
      }),

      prisma.reservation.update({
        where: {
          id,
        },
        data: {
          status: "CANCELLED",
        },
      }),
    ]);

    return NextResponse.json({
      message: "Reservation released",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to release reservation" },
      { status: 500 }
    );
  }
}