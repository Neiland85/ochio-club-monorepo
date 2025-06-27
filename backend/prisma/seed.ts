import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Crear estadios
  const stadium = await prisma.stadium.create({
    data: {
      name: "KOP Stadium",
      latitude: 40.4168,
      longitude: -3.7038,
      city: "Madrid",
      country: "España",
      capacity: 50000,
    },
  });

  // Crear usuario demo
  const user = await prisma.user.create({
    data: {
      email: "fan@ochio.club",
      username: "superfan",
      fullName: "Demo Fan",
    },
  });

  // Crear evento
  await prisma.event.create({
    data: {
      title: "Final Copa",
      stadiumId: stadium.id,
      eventDate: new Date("2025-07-01T20:00:00Z"),
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
