const bcrypt = require('bcryptjs');
const { pathToFileURL } = require('url');
const path = require('path');
const db = require('./backend/src/config/db');

const DD_VERSION = '16.12.1';

const specialChampionIds = {
  'Aurelion Sol': 'AurelionSol',
  "Bel'Veth": 'Belveth',
  "Cho'Gath": 'Chogath',
  'Dr. Mundo': 'DrMundo',
  'Jarvan IV': 'JarvanIV',
  "K'Sante": 'KSante',
  "Kai'Sa": 'Kaisa',
  "Kha'Zix": 'Khazix',
  "Kog'Maw": 'KogMaw',
  LeBlanc: 'Leblanc',
  'Lee Sin': 'LeeSin',
  'Master Yi': 'MasterYi',
  'Miss Fortune': 'MissFortune',
  'Nunu & Willump': 'Nunu',
  "Rek'Sai": 'RekSai',
  'Renata Glasc': 'Renata',
  'Tahm Kench': 'TahmKench',
  'Twisted Fate': 'TwistedFate',
  "Vel'Koz": 'Velkoz',
  Wukong: 'MonkeyKing',
  'Xin Zhao': 'XinZhao',
};

const championImageUrl = (name) => {
  const id = specialChampionIds[name] || name.replace(/['\s.]/g, '');
  return `https://ddragon.leagueoflegends.com/cdn/${DD_VERSION}/img/champion/${id}.png`;
};

const itemImageUrl = (id) => `https://ddragon.leagueoflegends.com/cdn/${DD_VERSION}/img/item/${id}.png`;
const spellImageUrl = (id) => `https://ddragon.leagueoflegends.com/cdn/${DD_VERSION}/img/spell/${id}.png`;
const runeImageUrl = (pathName) => `https://ddragon.leagueoflegends.com/cdn/img/${pathName}`;

const importModule = async (relativePath) => {
  const fileUrl = pathToFileURL(path.join(__dirname, relativePath)).href;
  return import(fileUrl);
};

const getOrCreateGuide = async ({ title, content, gameId, userId }) => {
  const existing = await db.guide.findFirst({
    where: { title, gameId, userId, isDeleted: false },
  });

  if (existing) {
    return db.guide.update({
      where: { id: existing.id },
      data: { content },
    });
  }

  return db.guide.create({
    data: { title, content, gameId, userId },
  });
};

const createCommentIfMissing = async ({ guideId, userId, content }) => {
  const existing = await db.comment.findFirst({
    where: { guideId, userId, content },
  });

  if (!existing) {
    await db.comment.create({ data: { guideId, userId, content } });
  }
};

async function main() {
  const [{ default: champions }, { default: itemsFullData }] = await Promise.all([
    importModule('frontend/src/data/champions.js'),
    importModule('frontend/src/data/itemsFullData.js'),
  ]);

  const game = await db.game.upsert({
    where: { title: 'League of Legends' },
    update: {
      genre: 'MOBA',
      description: 'League of Legends champion, item, rune, spell болон guide мэдээлэлтэй gaming guide database.',
      image: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_0.jpg',
    },
    create: {
      title: 'League of Legends',
      genre: 'MOBA',
      description: 'League of Legends champion, item, rune, spell болон guide мэдээлэлтэй gaming guide database.',
      image: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_0.jpg',
    },
  });

  const userPassword = await bcrypt.hash('password123', 10);
  const demoUser = await db.user.upsert({
    where: { email: 'summoner@gaming.com' },
    update: {
      username: 'summoner',
      password: userPassword,
      role: 'USER',
      isDeleted: false,
    },
    create: {
      username: 'summoner',
      email: 'summoner@gaming.com',
      password: userPassword,
      role: 'USER',
    },
  });

  const editor = await db.user.upsert({
    where: { email: 'editor@gaming.com' },
    update: {
      username: 'editor',
      password: userPassword,
      role: 'EDITOR',
      isDeleted: false,
    },
    create: {
      username: 'editor',
      email: 'editor@gaming.com',
      password: userPassword,
      role: 'EDITOR',
    },
  });

  const championRows = [];
  for (const champion of champions) {
    const row = await db.champion.upsert({
      where: {
        name_gameId: {
          name: champion.name,
          gameId: game.id,
        },
      },
      update: {
        role: champion.roles?.[0] || 'Mid',
        difficulty: champion.difficulty === 'Severe' ? 'Hard' : champion.difficulty,
        description: champion.title || `${champion.name} champion guide.`,
        imageUrl: championImageUrl(champion.name),
        guideData: {
          tags: champion.tags || [],
          roles: champion.roles || [],
          patch: DD_VERSION,
        },
      },
      create: {
        name: champion.name,
        role: champion.roles?.[0] || 'Mid',
        difficulty: champion.difficulty === 'Severe' ? 'Hard' : champion.difficulty,
        description: champion.title || `${champion.name} champion guide.`,
        imageUrl: championImageUrl(champion.name),
        guideData: {
          tags: champion.tags || [],
          roles: champion.roles || [],
          patch: DD_VERSION,
        },
        gameId: game.id,
      },
    });
    championRows.push(row);
  }

  const skillTemplates = {
    Ahri: [
      ['Essence Theft', 'Ahri heals after killing minions or monsters.', null, null, null, 'Passive'],
      ['Orb of Deception', 'Throws and recalls an orb, dealing magic and true damage.', '40/65/90/115/140', '7', '55/65/75/85/95', 'Q'],
      ['Fox-Fire', 'Releases fox-fires that seek nearby enemies.', '50/75/100/125/150', '9/8/7/6/5', '30', 'W'],
      ['Charm', 'Charms and damages the first enemy hit.', '80/110/140/170/200', '12', '60', 'E'],
      ['Spirit Rush', 'Dashes and fires essence bolts.', '60/90/120', '140/115/90', '100', 'R'],
    ],
    Yasuo: [
      ['Way of the Wanderer', 'Yasuo gains a flow shield and doubled critical strike chance.', null, null, null, 'Passive'],
      ['Steel Tempest', 'Thrusts forward, stacking toward a tornado.', '20/45/70/95/120', '4/3.5/3/2.5/2', '0', 'Q'],
      ['Wind Wall', 'Creates a moving wall that blocks projectiles.', null, '25/23/21/19/17', '0', 'W'],
      ['Sweeping Blade', 'Dashes through a target enemy.', '60/70/80/90/100', '0.5', '0', 'E'],
      ['Last Breath', 'Blinks to airborne enemies and deals heavy damage.', '200/350/500', '70/50/30', '0', 'R'],
    ],
    Jinx: [
      ['Get Excited!', 'Jinx gains movement and attack speed after takedowns.', null, null, null, 'Passive'],
      ['Switcheroo!', 'Swaps between Pow-Pow and Fishbones.', null, '0.9', '20', 'Q'],
      ['Zap!', 'Fires a shock blast that slows and reveals enemies.', '10/60/110/160/210', '8/7/6/5/4', '50/60/70/80/90', 'W'],
      ['Flame Chompers!', 'Throws traps that root enemies.', '70/120/170/220/270', '24/20.5/17/13.5/10', '90', 'E'],
      ['Super Mega Death Rocket!', 'Global rocket dealing execute damage.', '300/450/600', '75/65/55', '100', 'R'],
    ],
    'Lee Sin': [
      ['Flurry', 'After casting a spell, Lee Sin gains attack speed.', null, null, null, 'Passive'],
      ['Sonic Wave / Resonating Strike', 'Skillshot reveal and dash execute.', '55/80/105/130/155', '10/9/8/7/6', '50', 'Q'],
      ['Safeguard / Iron Will', 'Dashes to an ally and gains defensive stats.', null, '12', '50', 'W'],
      ['Tempest / Cripple', 'Reveals and slows nearby enemies.', '35/65/95/125/155', '9', '50', 'E'],
      ["Dragon's Rage", 'Kicks an enemy champion back.', '175/400/625', '110/85/60', '0', 'R'],
    ],
  };

  for (const [championName, skills] of Object.entries(skillTemplates)) {
    const champion = championRows.find((row) => row.name === championName);
    if (!champion) continue;

    for (const [name, description, damage, cooldown, manaCost, skillType] of skills) {
      await db.skill.upsert({
        where: {
          name_championId: {
            name,
            championId: champion.id,
          },
        },
        update: { description, damage, cooldown, manaCost, skillType },
        create: { name, description, damage, cooldown, manaCost, skillType, championId: champion.id },
      });
    }
  }

  for (const item of itemsFullData) {
    await db.item.upsert({
      where: {
        name_gameId: {
          name: item.name,
          gameId: game.id,
        },
      },
      update: {
        type: item.category,
        price: item.price,
        description: item.description,
        stats: item.stats.join(', '),
        imageUrl: itemImageUrl(item.id),
      },
      create: {
        name: item.name,
        type: item.category,
        price: item.price,
        description: item.description,
        stats: item.stats.join(', '),
        imageUrl: itemImageUrl(item.id),
        gameId: game.id,
      },
    });
  }

  const runes = [
    ['Conqueror', 'Keystone', 'Sustained combat rune for fighters and bruisers.', 'Top', 'perk-images/Styles/Precision/Conqueror/Conqueror.png'],
    ['Electrocute', 'Keystone', 'Burst damage rune for assassins and mages.', 'Mid', 'perk-images/Styles/Domination/Electrocute/Electrocute.png'],
    ['Summon Aery', 'Keystone', 'Poke and shielding rune for mages and supports.', 'Support', 'perk-images/Styles/Sorcery/SummonAery/SummonAery.png'],
    ['Grasp of the Undying', 'Keystone', 'Tank rune for trading and max health scaling.', 'Top', 'perk-images/Styles/Resolve/GraspOfTheUndying/GraspOfTheUndying.png'],
    ['First Strike', 'Keystone', 'Gold and burst setup rune for ranged poke champions.', 'Mid', 'perk-images/Styles/Inspiration/FirstStrike/FirstStrike.png'],
    ['Lethal Tempo', 'Keystone', 'Attack speed rune for marksmen and duelists.', 'Bot', 'perk-images/Styles/Precision/LethalTempo/LethalTempoTemp.png'],
  ];

  for (const [name, type, description, role, iconPath] of runes) {
    await db.rune.upsert({
      where: {
        name_gameId: { name, gameId: game.id },
      },
      update: {
        type,
        description: `${description} Recommended role: ${role}.`,
        imageUrl: runeImageUrl(iconPath),
      },
      create: {
        name,
        type,
        description: `${description} Recommended role: ${role}.`,
        imageUrl: runeImageUrl(iconPath),
        gameId: game.id,
      },
    });
  }

  const spells = [
    ['Flash', 'Blink a short distance toward the cursor.', 300, 'SummonerFlash'],
    ['Ignite', 'Deals true damage over time and applies healing reduction.', 180, 'SummonerDot'],
    ['Heal', 'Restores health and grants movement speed.', 240, 'SummonerHeal'],
    ['Teleport', 'Channels to an allied structure or ward.', 360, 'SummonerTeleport'],
    ['Smite', 'Deals true damage to monsters or minions.', 15, 'SummonerSmite'],
    ['Ghost', 'Gain movement speed and ignore unit collision.', 210, 'SummonerHaste'],
  ];

  for (const [name, description, cooldown, iconId] of spells) {
    await db.spell.upsert({
      where: {
        name_gameId: { name, gameId: game.id },
      },
      update: { description, cooldown, imageUrl: spellImageUrl(iconId) },
      create: { name, description, cooldown, imageUrl: spellImageUrl(iconId), gameId: game.id },
    });
  }

  const guides = [
    {
      title: 'Ahri Mid Lane Beginner Guide',
      content: 'Use Orb of Deception to control waves, hold Charm for key picks, and roam after level 6 with Spirit Rush.',
      userId: editor.id,
      comments: ['Ahri guide нь beginner-д ойлгомжтой байна.', 'Charm cooldown tracking их хэрэгтэй зөвлөгөө байна.'],
    },
    {
      title: 'Yasuo Trading and Wave Control',
      content: 'Stack Steel Tempest before trading, use minions for Sweeping Blade mobility, and save Wind Wall for important projectiles.',
      userId: demoUser.id,
      comments: ['Wind Wall timing дээр илүү их practice хэрэгтэй юм байна.', 'Yasuo-д wave freeze сайн тайлбарлажээ.'],
    },
    {
      title: 'Jinx ADC Teamfight Plan',
      content: 'Farm safely until two items, play around front line, and use resets from Get Excited to clean up fights.',
      userId: editor.id,
      comments: ['ADC тоглогчдод хэрэгтэй guide байна.', 'Positioning хэсгийг дахиад дэлгэрүүлж болно.'],
    },
    {
      title: 'Lee Sin Jungle Pathing Basics',
      content: 'Track lanes before ganking, use Sonic Wave carefully, and keep ward hop ready for escape or engage.',
      userId: demoUser.id,
      comments: ['Jungle pathing beginner-д яг хэрэгтэй.', 'Ward hop combo-г сайн сануулсан байна.'],
    },
  ];

  for (const guideSeed of guides) {
    const guide = await getOrCreateGuide({
      title: guideSeed.title,
      content: guideSeed.content,
      gameId: game.id,
      userId: guideSeed.userId,
    });

    for (const content of guideSeed.comments) {
      await createCommentIfMissing({ guideId: guide.id, userId: demoUser.id, content });
    }
  }

  const counts = {
    games: await db.game.count(),
    champions: await db.champion.count(),
    skills: await db.skill.count(),
    items: await db.item.count(),
    runes: await db.rune.count(),
    spells: await db.spell.count(),
    guides: await db.guide.count({ where: { isDeleted: false } }),
    comments: await db.comment.count(),
  };

  console.log('MySQL seed completed:', counts);
  console.log('Fixed champion image URLs:', ['Ambessa', 'Yunara', 'Zaahen'].map((name) => `${name}: ${championImageUrl(name)}`));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
