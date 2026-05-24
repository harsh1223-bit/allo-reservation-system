import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      productId,
      warehouseId,
      quantity,
    } = body;

    if (
      !productId ||
      !warehouseId ||
      !quantity
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields",
        },
        {
          status: 400,
        }
      );
    }

    const result =
      await prisma.$transaction(
        async (tx) => {
          const inventory =
            await tx.inventory.findUnique({
              where: {
                productId_warehouseId:
                  {
                    productId,
                    warehouseId,
                  },
              },
            });

          if (!inventory) {
            return {
              error:
                "Inventory not found",
              status: 404,
            };
          }

          const availableUnits =
            inventory.totalUnits -
            inventory.reservedUnits;

          if (
            availableUnits < quantity
          ) {
            return {
              error:
                "Not enough stock available",
              status: 409,
            };
          }

          await tx.inventory.update({
            where: {
              id: inventory.id,
            },
            data: {
              reservedUnits: {
                increment: quantity,
              },
            },
          });

          const reservation =
            await tx.reservation.create({
              data: {
                productId,
                warehouseId,
                quantity,
                status: "PENDING",
                expiresAt: new Date(
                  Date.now() +
                    10 * 60 * 1000
                ),
              },
            });

          return reservation;
        }
      );

    if ("error" in result) {
      return NextResponse.json(
        {
          error: result.error,
        },
        {
          status: result.status,
        }
      );
    }

    return NextResponse.json(
      result,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to create reservation",
      },
      {
        status: 500,
      }
    );
  }
}