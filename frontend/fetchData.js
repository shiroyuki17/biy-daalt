import fs from 'fs';

async function fetchData() {
  const versionRes = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
  const versions = await versionRes.json();
  const v = versions[0];

  const itemsRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/${v}/data/en_US/item.json`);
  const itemsData = await itemsRes.json();

  const runesRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/${v}/data/en_US/runesReforged.json`);
  const runesData = await runesRes.json();

  const spellsRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/${v}/data/en_US/summoner.json`);
  const spellsData = await spellsRes.json();

  const data = {
    version: v,
    items: {},
    runes: {},
    spells: {}
  };

  // Map Items (Name -> ID)
  for (const [id, item] of Object.entries(itemsData.data)) {
    data.items[item.name] = id;
  }
  // Hardcode some missing exact matches if names differ slightly
  data.items["Plated Steelcaps"] = "3047";
  data.items["Sundered Sky"] = "3153"; // wait, let's just let it map dynamically.

  // Map Runes (Name -> icon path)
  for (const tree of runesData) {
    data.runes[tree.name] = tree.icon;
    for (const slot of tree.slots) {
      for (const rune of slot.runes) {
        data.runes[rune.name] = rune.icon;
      }
    }
  }

  // Map Spells (Name -> ID)
  for (const [id, spell] of Object.entries(spellsData.data)) {
    data.spells[spell.name] = id;
  }

  fs.writeFileSync('src/data/gameData.js', `export const gameData = ${JSON.stringify(data, null, 2)};\n`);
  console.log('Data fetched and saved to src/data/gameData.js');
}

fetchData();
