const db = require('./backend/src/config/db');

async function main() {
  const updates = [
    {
      name: "Luden's Companion",
      imageUrl: '/assets/lol/items/6655-ludens-companion.png',
    },
    {
      name: "Liandry's Torment",
      imageUrl: '/assets/lol/items/6653-liandrys-torment.png',
    },
  ];

  for (const item of updates) {
    await db.item.updateMany({
      where: { name: item.name },
      data: { imageUrl: item.imageUrl },
    });
  }

  const rows = await db.item.findMany({
    where: { name: { in: updates.map((item) => item.name) } },
    select: { name: true, imageUrl: true },
  });

  console.log(JSON.stringify(rows, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
