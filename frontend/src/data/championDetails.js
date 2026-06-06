import champions from './champions';

export function getChampionDetails(championName) {
  // Find champion metadata
  const champ = champions.find(c => c.name === championName) || { tags: ["Fighter"], roles: ["Top"] };
  const tags = champ.tags;
  const role = champ.roles[0]; // Primary role

  // Aatrox manual override to perfectly match screenshot
  if (championName === 'Aatrox') {
    return {
      winRate: '49.8%', pickRate: '6.6%', banRate: '8.0%', matches: '142 845', tier: 'S', lane: 'Top',
      recommendedBuilds: [
        { name: 'Most Popular', winRate: '50.8%', matches: '16 419' },
        { name: 'Highest WR', winRate: '53.6%', matches: '4 210' }
      ],
      runes: {
        primary: { path: 'Precision', keystone: 'Conqueror', perks: ['Triumph', 'Legend: Haste', 'Last Stand'] },
        secondary: { path: 'Resolve', perks: ['Bone Plating', 'Revitalize'] }
      },
      abilityOrder: ['Q', 'E', 'W'],
      spells: ['Flash', 'Teleport'],
      items: {
        starter: ["Doran's Blade", "Health Potion"],
        early: ["Boots", "Pickaxe"],
        core: ["Eclipse", "Plated Steelcaps", "Sundered Sky"],
        full: ["Eclipse", "Plated Steelcaps", "Sundered Sky", "Death's Dance", "Sterak's Gage", "Spirit Visage"]
      },
      situationalItems: ["Spear of Shojin", "Black Cleaver", "Thornmail"],
      matchups: {
        weakAgainst: [
          { name: 'Singed', winRate: '45.2%' }, { name: 'Kayle', winRate: '45.9%' }, { name: 'Malphite', winRate: '46.8%' }
        ],
        strongAgainst: [
          { name: 'Vladimir', winRate: '55.8%' }, { name: 'Tahm Kench', winRate: '55.2%' }, { name: 'Dr. Mundo', winRate: '54.3%' }
        ],
        synergy: [
          { name: 'Rammus', winRate: '56.3%' }, { name: 'Nasus', winRate: '55.5%' }, { name: 'Fiddlesticks', winRate: '53.6%' }
        ]
      }
    };
  }

  // Generate highly realistic mock data based on class and role
  const isMage = tags.includes('Mage');
  const isMarksman = tags.includes('Marksman');
  const isAssassin = tags.includes('Assassin');
  const isTank = tags.includes('Tank');
  const isSupportTag = tags.includes('Support');
  const isFighter = tags.includes('Fighter');

  const isJungle = role === 'Jungle';
  const isSupportRole = role === 'Support';
  const isBot = role === 'Bot';
  const isTop = role === 'Top';
  const isMid = role === 'Mid';

  let spells = ['Flash'];
  if (isJungle) spells.push('Smite');
  else if (isSupportRole) spells.push('Exhaust');
  else if (isBot) spells.push('Heal');
  else if (isTop) spells.push('Teleport');
  else spells.push('Ignite'); // Mid usually

  let starter = [];
  if (isJungle) starter = ["Mosstomper Seedling", "Health Potion"];
  else if (isSupportRole) starter = ["World Atlas", "Health Potion"];
  else if (isMage) starter = ["Doran's Ring", "Health Potion"];
  else if (isMarksman) starter = ["Doran's Blade", "Health Potion"];
  else if (isTank) starter = ["Doran's Shield", "Health Potion"];
  else starter = ["Doran's Blade", "Health Potion"];

  let boots = "Plated Steelcaps";
  if (isMage) boots = "Sorcerer's Shoes";
  else if (isMarksman) boots = "Berserker's Greaves";
  else if (isAssassin) boots = "Ionian Boots of Lucidity";
  else if (isSupportRole) boots = "Mobility Boots";
  else if (isTank) boots = "Mercury's Treads";

  let core = [];
  let full = [];
  let situ = [];
  let runes = {};

  if (isMarksman) {
    core = ["Kraken Slayer", boots, "Infinity Edge"];
    full = [...core, "Lord Dominik's Regards", "Bloodthirster", "Guardian Angel"];
    situ = ["Phantom Dancer", "Rapid Firecannon", "Immortal Shieldbow"];
    runes = {
      primary: { path: 'Precision', keystone: 'Lethal Tempo', perks: ['Presence of Mind', 'Legend: Bloodline', 'Coup de Grace'] },
      secondary: { path: 'Inspiration', perks: ['Magical Footwear', 'Biscuit Delivery'] }
    };
  } else if (isMage) {
    core = ["Luden's Companion", boots, "Shadowflame"];
    full = [...core, "Zhonya's Hourglass", "Rabadon's Deathcap", "Void Staff"];
    situ = ["Banshee's Veil", "Morellonomicon", "Cosmic Drive"];
    runes = {
      primary: { path: 'Sorcery', keystone: 'Arcane Comet', perks: ['Manaflow Band', 'Transcendence', 'Gathering Storm'] },
      secondary: { path: 'Inspiration', perks: ['Magical Footwear', 'Biscuit Delivery'] }
    };
  } else if (isAssassin) {
    core = ["Youmuu's Ghostblade", boots, "Opportunity"];
    full = [...core, "Edge of Night", "Serylda's Grudge", "Guardian Angel"];
    situ = ["Axiom Arc", "Hubris", "Black Cleaver"];
    runes = {
      primary: { path: 'Domination', keystone: 'Electrocute', perks: ['Sudden Impact', 'Eyeball Collection', 'Treasure Hunter'] },
      secondary: { path: 'Precision', perks: ['Triumph', 'Coup de Grace'] }
    };
  } else if (isTank) {
    core = ["Heartsteel", boots, "Sunfire Aegis"];
    full = [...core, "Thornmail", "Kaenic Rookern", "Jak'Sho, The Protean"];
    situ = ["Randuin's Omen", "Frozen Heart", "Force of Nature"];
    runes = {
      primary: { path: 'Resolve', keystone: 'Grasp of the Undying', perks: ['Demolish', 'Second Wind', 'Overgrowth'] },
      secondary: { path: 'Inspiration', perks: ['Magical Footwear', 'Cosmic Insight'] }
    };
  } else if (isSupportRole) {
    core = ["Locket of the Iron Solari", boots, "Redemption"];
    full = [...core, "Knight's Vow", "Mikael's Blessing", "Vigilant Wardstone"];
    situ = ["Ardent Censer", "Staff of Flowing Water", "Zeke's Convergence"];
    runes = {
      primary: { path: 'Resolve', keystone: 'Guardian', perks: ['Font of Life', 'Bone Plating', 'Revitalize'] },
      secondary: { path: 'Inspiration', perks: ['Biscuit Delivery', 'Cosmic Insight'] }
    };
  } else {
    // Fighter default
    core = ["Trinity Force", boots, "Black Cleaver"];
    full = [...core, "Sterak's Gage", "Death's Dance", "Guardian Angel"];
    situ = ["Spear of Shojin", "Ravenous Hydra", "Maw of Malmortius"];
    runes = {
      primary: { path: 'Precision', keystone: 'Conqueror', perks: ['Triumph', 'Legend: Alacrity', 'Last Stand'] },
      secondary: { path: 'Resolve', perks: ['Bone Plating', 'Overgrowth'] }
    };
  }

  // Get random matchups from same roles if possible
  const sameRoleChamps = champions.filter(c => c.roles.includes(role) && c.name !== championName);
  const others = sameRoleChamps.length > 6 ? sameRoleChamps : champions.filter(c => c.name !== championName);
  
  // Shuffle helper
  const shuffle = (arr) => arr.sort(() => 0.5 - Math.random());
  const randomChamps = shuffle([...others]).slice(0, 9);

  const weakAgainst = randomChamps.slice(0, 3).map(c => ({ name: c.name, winRate: (45 + Math.random() * 4).toFixed(1) + '%' }));
  const strongAgainst = randomChamps.slice(3, 6).map(c => ({ name: c.name, winRate: (52 + Math.random() * 4).toFixed(1) + '%' }));
  const synergy = randomChamps.slice(6, 9).map(c => ({ name: c.name, winRate: (51 + Math.random() * 6).toFixed(1) + '%' }));

  const wr = (48 + Math.random() * 4).toFixed(1);
  const pr = (1 + Math.random() * 10).toFixed(1);
  const br = (1 + Math.random() * 15).toFixed(1);

  return {
    winRate: `${wr}%`, pickRate: `${pr}%`, banRate: `${br}%`, matches: Math.floor(10000 + Math.random() * 90000).toString(),
    tier: ['S', 'A', 'B'][Math.floor(Math.random() * 3)],
    lane: role,
    recommendedBuilds: [
      { name: 'Most Popular', winRate: `${(parseFloat(wr) + 1.2).toFixed(1)}%`, matches: Math.floor(5000 + Math.random() * 5000).toString() },
      { name: 'Highest WR', winRate: `${(parseFloat(wr) + 2.5).toFixed(1)}%`, matches: Math.floor(1000 + Math.random() * 2000).toString() }
    ],
    runes: runes,
    abilityOrder: ['Q', 'W', 'E'],
    spells: spells,
    items: {
      starter: starter,
      early: [boots, "Long Sword"], // Simplified early
      core: core,
      full: full
    },
    situationalItems: situ,
    matchups: {
      weakAgainst, strongAgainst, synergy
    }
  };
}
