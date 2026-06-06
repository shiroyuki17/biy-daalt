import { useState, useEffect } from 'react';

const DD_VERSION = "14.8.1";

let cachedItems = null;
let cachedRunes = null;
let cachedSpells = null;

export function useGameData() {
  const [items, setItems] = useState(cachedItems || {});
  const [runes, setRunes] = useState(cachedRunes || {});
  const [spells, setSpells] = useState(cachedSpells || {});
  const [loading, setLoading] = useState(!cachedItems || !cachedRunes || !cachedSpells);

  useEffect(() => {
    if (cachedItems && cachedRunes && cachedSpells) {
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch versions to get the latest
        const versionRes = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
        const versions = await versionRes.json();
        const v = versions[0] || DD_VERSION;

        // Fetch Items
        const itemsRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/${v}/data/en_US/item.json`);
        const itemsData = await itemsRes.json();
        const newItems = {};
        for (const [id, item] of Object.entries(itemsData.data)) {
          const url = `https://ddragon.leagueoflegends.com/cdn/${v}/img/item/${id}.png`;
          newItems[item.name] = url;
          newItems[item.name.toLowerCase().replace(/[^a-z0-9]/g, '')] = url;
        }
        
        // Add some fallbacks for specific names that might be slightly different
        newItems["Plated Steelcaps"] = `https://ddragon.leagueoflegends.com/cdn/${v}/img/item/3047.png`;
        newItems["platedsteelcaps"] = `https://ddragon.leagueoflegends.com/cdn/${v}/img/item/3047.png`;
        newItems["Sundered Sky"] = `https://ddragon.leagueoflegends.com/cdn/${v}/img/item/6610.png`;
        newItems["sunderedsky"] = `https://ddragon.leagueoflegends.com/cdn/${v}/img/item/6610.png`;

        // Fetch Runes
        const runesRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/${v}/data/en_US/runesReforged.json`);
        const runesData = await runesRes.json();
        const newRunes = {};
        for (const tree of runesData) {
          const treeUrl = `https://ddragon.leagueoflegends.com/cdn/img/${tree.icon}`;
          newRunes[tree.name] = treeUrl;
          newRunes[tree.name.toLowerCase().replace(/[^a-z0-9]/g, '')] = treeUrl;
          for (const slot of tree.slots) {
            for (const rune of slot.runes) {
              const runeUrl = `https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`;
              newRunes[rune.name] = runeUrl;
              newRunes[rune.name.toLowerCase().replace(/[^a-z0-9]/g, '')] = runeUrl;
            }
          }
        }

        // Fetch Spells
        const spellsRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/${v}/data/en_US/summoner.json`);
        const spellsData = await spellsRes.json();
        const newSpells = {};
        for (const [id, spell] of Object.entries(spellsData.data)) {
          const spellUrl = `https://ddragon.leagueoflegends.com/cdn/${v}/img/spell/${id}.png`;
          newSpells[spell.name] = spellUrl;
          newSpells[spell.name.toLowerCase().replace(/[^a-z0-9]/g, '')] = spellUrl;
        }

        cachedItems = newItems;
        cachedRunes = newRunes;
        cachedSpells = newSpells;

        setItems(newItems);
        setRunes(newRunes);
        setSpells(newSpells);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch Data Dragon assets:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { items, runes, spells, loading };
}
