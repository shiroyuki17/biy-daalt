const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const db = require('./backend/src/config/db');

const publicRoot = path.join(__dirname, 'frontend', 'public');
const assetRoot = path.join(publicRoot, 'assets', 'lol');

const ensureDir = (dir) => {
  fs.mkdirSync(dir, { recursive: true });
};

const sanitize = (value) =>
  String(value)
    .trim()
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

const extensionFromUrl = (url) => {
  const clean = url.split('?')[0].toLowerCase();
  if (clean.endsWith('.jpg') || clean.endsWith('.jpeg')) return '.jpg';
  if (clean.endsWith('.webp')) return '.webp';
  return '.png';
};

const download = (url, destination) =>
  new Promise((resolve, reject) => {
    const client = url.startsWith('http://') ? http : https;
    const request = client.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        response.resume();
        download(response.headers.location, destination).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        response.resume();
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }

      const file = fs.createWriteStream(destination);
      response.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', reject);
    });

    request.setTimeout(20000, () => {
      request.destroy(new Error('download timeout'));
    });

    request.on('error', reject);
  });

const cacheImage = async ({ type, id, name, imageUrl }) => {
  if (!imageUrl || imageUrl.startsWith('/assets/')) {
    return imageUrl || null;
  }

  const dir = path.join(assetRoot, type);
  ensureDir(dir);

  const ext = extensionFromUrl(imageUrl);
  const filename = `${id}-${sanitize(name)}${ext}`;
  const absolutePath = path.join(dir, filename);
  const publicPath = `/assets/lol/${type}/${filename}`;

  if (!fs.existsSync(absolutePath)) {
    await download(imageUrl, absolutePath);
  }

  return publicPath;
};

const updateCollection = async ({ type, rows, update }) => {
  let saved = 0;
  const failed = [];

  for (const row of rows) {
    try {
      const localPath = await cacheImage({
        type,
        id: row.id,
        name: row.name || row.title,
        imageUrl: row.imageUrl || row.image,
      });

      if (localPath) {
        await update(row.id, localPath);
        saved += 1;
      }
    } catch (error) {
      failed.push(`${row.name || row.title}: ${error.message}`);
    }
  }

  return { saved, failed };
};

async function main() {
  ensureDir(assetRoot);

  const [games, champions, items, runes, spells] = await Promise.all([
    db.game.findMany(),
    db.champion.findMany(),
    db.item.findMany(),
    db.rune.findMany(),
    db.spell.findMany(),
  ]);

  const results = {
    games: await updateCollection({
      type: 'games',
      rows: games,
      update: (id, image) => db.game.update({ where: { id }, data: { image } }),
    }),
    champions: await updateCollection({
      type: 'champions',
      rows: champions,
      update: (id, imageUrl) => db.champion.update({ where: { id }, data: { imageUrl } }),
    }),
    items: await updateCollection({
      type: 'items',
      rows: items,
      update: (id, imageUrl) => db.item.update({ where: { id }, data: { imageUrl } }),
    }),
    runes: await updateCollection({
      type: 'runes',
      rows: runes,
      update: (id, imageUrl) => db.rune.update({ where: { id }, data: { imageUrl } }),
    }),
    spells: await updateCollection({
      type: 'spells',
      rows: spells,
      update: (id, imageUrl) => db.spell.update({ where: { id }, data: { imageUrl } }),
    }),
  };

  console.log(JSON.stringify(results, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
