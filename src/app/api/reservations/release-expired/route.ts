import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function releaseExpiredReservations() {
  const expiredReservations =
    await prisma.reservation.findMany({
      where: {
        status: "PENDING",
        expiresAt: {
          lt: new Date(),
        },
      },
    });

  for (const reservation of expiredReservations) {
    await prisma.$transaction(
      async (tx) => {
        const inventory =
          await tx.inventory.findUnique({
            where: {
              productId_warehouseId: {
                productId:
                  reservation.productId,
                warehouseId:
                  reservation.warehouseId,
              },
            },
          });

        if (!inventory) return;

        await tx.inventory.update({
          where: {
            id: inventory.id,
          },
          data: {
            reservedUnits: Math.max(
              0,
              inventory.reservedUnits -
                reservation.quantity
            ),
          },
        });

        await tx.reservation.update({
          where: {
            id: reservation.id,
          },
          data: {
            status: "RELEASED",
          },
        });
      }
    );
  }

  return NextResponse.json({
    success: true,
    released:
      expiredReservations.length,
  });
}

export async function GET() {
  try {
    return await releaseExpiredReservations();
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to release expired reservations",
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    return await releaseExpiredReservations();
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to release expired reservations",
      },
      { status: 500 }
    );
  }
}