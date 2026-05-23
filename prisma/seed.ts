import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const warehouse1 = await prisma.warehouse.create({
    data: {
      name: "Mumbai Warehouse",
      location: "Mumbai",
    },
  });

  const warehouse2 = await prisma.warehouse.create({
    data: {
      name: "Delhi Warehouse",
      location: "Delhi",
    },
  });

  const product1 = await prisma.product.create({
    data: {
      name: "iPhone 15",
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: "Samsung Galaxy S24",
    },
  });

  await prisma.inventory.createMany({
    data: [
      {
        productId: product1.id,
        warehouseId: warehouse1.id,
        totalUnits: 5,
      },
      {
        productId: product1.id,
        warehouseId: warehouse2.id,
        totalUnits: 3,
      },
      {
        productId: product2.id,
        warehouseId: warehouse1.id,
        totalUnits: 4,
      },
    ],
  });

  console.log("Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });