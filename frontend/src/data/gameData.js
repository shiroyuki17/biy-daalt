// Data Dragon mappings for icons

export const DD_VERSION = "14.8.1"; // Update this to match the latest version if needed

export const spellsData = {
  "Flash": "SummonerFlash",
  "Ignite": "SummonerDot",
  "Teleport": "SummonerTeleport",
  "Smite": "SummonerSmite",
  "Heal": "SummonerHeal",
  "Ghost": "SummonerHaste",
  "Exhaust": "SummonerExhaust",
  "Cleanse": "SummonerBoost",
  "Barrier": "SummonerBarrier"
};

export const runesData = {
  // Trees
  "Precision": "perk-images/Styles/7201Precision.png",
  "Domination": "perk-images/Styles/7200Domination.png",
  "Sorcery": "perk-images/Styles/7202Sorcery.png",
  "Resolve": "perk-images/Styles/7204Resolve.png",
  "Inspiration": "perk-images/Styles/7203Inspiration.png",

  // Keystones
  "Conqueror": "perk-images/Styles/Precision/Conqueror/Conqueror.png",
  "Lethal Tempo": "perk-images/Styles/Precision/LethalTempo/LethalTempoTemp.png",
  "Press the Attack": "perk-images/Styles/Precision/PressTheAttack/PressTheAttack.png",
  "Fleet Footwork": "perk-images/Styles/Precision/FleetFootwork/FleetFootwork.png",
  "Electrocute": "perk-images/Styles/Domination/Electrocute/Electrocute.png",
  "Dark Harvest": "perk-images/Styles/Domination/DarkHarvest/DarkHarvest.png",
  "Hail of Blades": "perk-images/Styles/Domination/HailOfBlades/HailOfBlades.png",
  "Summon Aery": "perk-images/Styles/Sorcery/SummonAery/SummonAery.png",
  "Arcane Comet": "perk-images/Styles/Sorcery/ArcaneComet/ArcaneComet.png",
  "Phase Rush": "perk-images/Styles/Sorcery/PhaseRush/PhaseRush.png",
  "Grasp of the Undying": "perk-images/Styles/Resolve/GraspOfTheUndying/GraspOfTheUndying.png",
  "Aftershock": "perk-images/Styles/Resolve/VeteranAftershock/VeteranAftershock.png",
  "Guardian": "perk-images/Styles/Resolve/Guardian/Guardian.png",
  "First Strike": "perk-images/Styles/Inspiration/FirstStrike/FirstStrike.png",
  "Glacial Augment": "perk-images/Styles/Inspiration/GlacialAugment/GlacialAugment.png",

  // Minor Runes (A few common ones)
  "Triumph": "perk-images/Styles/Precision/Triumph.png",
  "Presence of Mind": "perk-images/Styles/Precision/PresenceOfMind/PresenceOfMind.png",
  "Legend: Alacrity": "perk-images/Styles/Precision/LegendAlacrity/LegendAlacrity.png",
  "Legend: Haste": "perk-images/Styles/Precision/LegendHaste/LegendHaste.png",
  "Legend: Bloodline": "perk-images/Styles/Precision/LegendBloodline/LegendBloodline.png",
  "Coup de Grace": "perk-images/Styles/Precision/CoupDeGrace/CoupDeGrace.png",
  "Last Stand": "perk-images/Styles/Precision/LastStand/LastStand.png",
  "Taste of Blood": "perk-images/Styles/Domination/TasteOfBlood/GreenTerror_TasteOfBlood.png",
  "Sudden Impact": "perk-images/Styles/Domination/SuddenImpact/SuddenImpact.png",
  "Eyeball Collection": "perk-images/Styles/Domination/EyeballCollection/EyeballCollection.png",
  "Treasure Hunter": "perk-images/Styles/Domination/TreasureHunter/TreasureHunter.png",
  "Ultimate Hunter": "perk-images/Styles/Domination/UltimateHunter/UltimateHunter.png",
  "Manaflow Band": "perk-images/Styles/Sorcery/ManaflowBand/ManaflowBand.png",
  "Transcendence": "perk-images/Styles/Sorcery/Transcendence/Transcendence.png",
  "Gathering Storm": "perk-images/Styles/Sorcery/GatheringStorm/GatheringStorm.png",
  "Demolish": "perk-images/Styles/Resolve/Demolish/Demolish.png",
  "Font of Life": "perk-images/Styles/Resolve/FontOfLife/FontOfLife.png",
  "Bone Plating": "perk-images/Styles/Resolve/BonePlating/BonePlating.png",
  "Second Wind": "perk-images/Styles/Resolve/SecondWind/SecondWind.png",
  "Overgrowth": "perk-images/Styles/Resolve/Overgrowth/Overgrowth.png",
  "Revitalize": "perk-images/Styles/Resolve/Revitalize/Revitalize.png",
  "Magical Footwear": "perk-images/Styles/Inspiration/MagicalFootwear/MagicalFootwear.png",
  "Cosmic Insight": "perk-images/Styles/Inspiration/CosmicInsight/CosmicInsight.png",
  "Biscuit Delivery": "perk-images/Styles/Inspiration/BiscuitDelivery/BiscuitDelivery.png"
};

export const itemsData = {
  // Starter
  "Doran's Blade": "1055",
  "Doran's Ring": "1056",
  "Doran's Shield": "1054",
  "Health Potion": "2003",
  "Tear of the Goddess": "3070",
  "Spellthief's Edge": "3850",
  "Relic Shield": "3858",
  "Steel Shoulderguards": "3854",
  "Spectral Sickle": "3862",
  "World Atlas": "3865", // New support item
  "Mosstomper Seedling": "1103", // Jungle pet
  "Gustwalker Hatchling": "1102", // Jungle pet
  "Scorchclaw Pup": "1101", // Jungle pet
  
  // Early / Boots
  "Boots": "1001",
  "Plated Steelcaps": "3047",
  "Mercury's Treads": "3111",
  "Sorcerer's Shoes": "3020",
  "Berserker's Greaves": "3006",
  "Ionian Boots of Lucidity": "3158",
  "Boots of Swiftness": "3009",
  "Mobility Boots": "3117",

  // Core Fighter
  "Eclipse": "6692",
  "Sundered Sky": "6610", // Approximate ID, using fallback if it fails
  "Trinity Force": "3078",
  "Black Cleaver": "3071",
  "Sterak's Gage": "3053",
  "Death's Dance": "3153",
  "Blade of the Ruined King": "3153",
  "Ravenous Hydra": "3074",
  "Titanic Hydra": "3053",
  "Stridebreaker": "6631",
  "Goredrinker": "6630",
  "Spear of Shojin": "3161",
  
  // Core Mage
  "Luden's Companion": "6655",
  "Malignance": "3118",
  "Liandry's Torment": "6653",
  "Shadowflame": "4645",
  "Zhonya's Hourglass": "3157",
  "Rabadon's Deathcap": "3089",
  "Void Staff": "3135",
  "Archangel's Staff": "3003",
  "Cosmic Drive": "4629",
  "Banshee's Veil": "3102",
  "Morellonomicon": "3165",
  
  // Core Marksman
  "Kraken Slayer": "6672",
  "Infinity Edge": "3031",
  "Lord Dominik's Regards": "3036",
  "Rapid Firecannon": "3094",
  "Phantom Dancer": "3046",
  "Runaan's Hurricane": "3085",
  "Statikk Shiv": "3087",
  "Bloodthirster": "3072",
  "Immortal Shieldbow": "6673",
  "Guinsoo's Rageblade": "3124",
  "Terminus": "3302",
  
  // Core Assassin
  "Youmuu's Ghostblade": "3142",
  "Duskblade of Draktharr": "3147",
  "Hubris": "6698",
  "Profane Hydra": "6697",
  "Opportunity": "3168",
  "Edge of Night": "3814",
  "Axiom Arc": "6690",
  "Serylda's Grudge": "6694",
  
  // Core Tank
  "Heartsteel": "3084",
  "Sunfire Aegis": "3068",
  "Thornmail": "3075",
  "Randuin's Omen": "3143",
  "Frozen Heart": "3110",
  "Spirit Visage": "3065",
  "Force of Nature": "4401",
  "Jak'Sho, The Protean": "6665",
  "Kaenic Rookern": "3118",
  "Hollow Radiance": "6660",
  
  // Support
  "Locket of the Iron Solari": "3190",
  "Redemption": "3107",
  "Ardent Censer": "3504",
  "Staff of Flowing Water": "6616",
  "Mikael's Blessing": "3222",
  "Knight's Vow": "3109",
  "Zeke's Convergence": "3050"
};

export const getSpellIconUrl = (spellName) => {
  const id = spellsData[spellName];
  return id ? `https://ddragon.leagueoflegends.com/cdn/${DD_VERSION}/img/spell/${id}.png` : '';
};

export const getRuneIconUrl = (runeName) => {
  const path = runesData[runeName];
  return path ? `https://ddragon.leagueoflegends.com/cdn/img/${path}` : '';
};

export const getItemIconUrl = (itemName) => {
  const id = itemsData[itemName];
  return id ? `https://ddragon.leagueoflegends.com/cdn/${DD_VERSION}/img/item/${id}.png` : '';
};
