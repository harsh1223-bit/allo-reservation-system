import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const expiredReservations = await prisma.reservation.findMany({
      where: {
        status: "PENDING",
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    await prisma.$transaction(
      expiredReservations.map((reservation) =>
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
        })
      )
    );

    await prisma.reservation.updateMany({
      where: {
        id: {
          in: expiredReservations.map((r) => r.id),
        },
      },
      data: {
        status: "EXPIRED" as any,
      },
    });

    return NextResponse.json({
      releasedReservations: expiredReservations.length,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to release reservations" },
      { status: 500 }
    );
  }
}