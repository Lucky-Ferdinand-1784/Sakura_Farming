export const CROPS = {
  rice: {
    id: 'rice',
    name: 'Padi Kuil Emas',
    kanji: '稲',
    seedPrice: 12,
    sellPrice: 28,
    growthTime: 12, // seconds
    petalsAward: 1,
    icon: '🌾',
    seedIcon: '🌱',
    desc: 'Beras suci persembahan kuil, tumbuh cepat dan berkilau keemasan.',
    growthStages: ['🌰', '🌱', '🌿', '🌾'],
    color: '#f3c66a'
  },
  matcha: {
    id: 'matcha',
    name: 'Teh Hijau Matcha',
    kanji: '茶',
    seedPrice: 22,
    sellPrice: 55,
    growthTime: 20,
    petalsAward: 2,
    icon: '🍵',
    seedIcon: '🌱',
    desc: 'Daun teh hijau aromatik dari lereng bukit kuil sakura.',
    growthStages: ['🌰', '🌱', '🪴', '🍵'],
    color: '#86efac'
  },
  satsumaimo: {
    id: 'satsumaimo',
    name: 'Ubi Jepang Satsumaimo',
    kanji: '芋',
    seedPrice: 38,
    sellPrice: 95,
    growthTime: 32,
    petalsAward: 3,
    icon: '🍠',
    seedIcon: '🥔',
    desc: 'Ubi manis beraroma madu yang sangat disukai para biarawan kuil.',
    growthStages: ['🥔', '🌱', '🌿', '🍠'],
    color: '#d8b4fe'
  },
  shiitake: {
    id: 'shiitake',
    name: 'Jamur Shiitake Torii',
    kanji: '茸',
    seedPrice: 30,
    sellPrice: 75,
    growthTime: 24,
    petalsAward: 2,
    icon: '🍄',
    seedIcon: '🟤',
    desc: 'Tumbuh subur di kayu kuil tua dengan cita rasa umami lezat.',
    growthStages: ['🟤', '🌱', '🍄', '🍄'],
    color: '#fed7aa'
  },
  edamame: {
    id: 'edamame',
    name: 'Kedelai Edamame',
    kanji: '豆',
    seedPrice: 50,
    sellPrice: 135,
    growthTime: 42,
    petalsAward: 4,
    icon: '🫘',
    seedIcon: '🟢',
    desc: 'Kacang polong renyah kaya nutrisi dari tanah suci.',
    growthStages: ['🟢', '🌱', '🌿', '🫘'],
    color: '#4ade80'
  },
  sakura_bloom: {
    id: 'sakura_bloom',
    name: 'Bunga Sakura Abadi',
    kanji: '桜',
    seedPrice: 75,
    sellPrice: 220,
    growthTime: 55,
    petalsAward: 8,
    icon: '🌸',
    seedIcon: '✨',
    desc: 'Bunga sakura sakral yang memancarkan aroma kedamaian abadi.',
    growthStages: ['✨', '🌱', '🌸', '🌸'],
    color: '#f472b6'
  },
  shiroi_strawberry: {
    id: 'shiroi_strawberry',
    name: 'Stroberi Putih Mutiara',
    kanji: '苺',
    seedPrice: 110,
    sellPrice: 340,
    growthTime: 70,
    petalsAward: 12,
    icon: '🍓',
    seedIcon: '⭐',
    desc: 'Permata putih musim semi (Shiroi Houseki), manis tiada tara.',
    growthStages: ['⭐', '🌱', '🪴', '🍓'],
    color: '#fdf2f4'
  }
};

export const TOOLS = [
  { id: 'hoe', name: 'Cangkul Kuil', icon: 'fa-solid fa-hammer', desc: 'Gemburkan tanah rumput jadi petak siap tanam' },
  { id: 'water', name: 'Penyiram Bambu', icon: 'fa-solid fa-faucet-drip', desc: 'Siram petak tanah agar tanaman tumbuh segar' },
  { id: 'plant', name: 'Kantung Bibit', icon: 'fa-solid fa-seedling', desc: 'Tanam benih yang aktif dipilih' },
  { id: 'harvest', name: 'Sabit Sakura', icon: 'fa-solid fa-hand-sparkles', desc: 'Panen tanaman yang telah mekar sempurna' },
  { id: 'fertilizer', name: 'Kelopak Berkat', icon: 'fa-solid fa-wand-magic-sparkles', desc: 'Percepat pertumbuhan instan tanaman' },
];

export const FISH_TYPES = [
  { id: 'kohaku', name: 'Koi Kohaku (Merah-Putih)', rarity: 'Umum', price: 45, icon: '🐟', color: '#f87171' },
  { id: 'sanke', name: 'Koi Taisho Sanke (Tiga Warna)', rarity: 'Langka', price: 95, icon: '🐠', color: '#fb923c' },
  { id: 'ogon', name: 'Koi Emas Yamabuki (Emas Kuil)', rarity: 'Epik', price: 210, icon: '🐡', color: '#facc15' },
  { id: 'ryu', name: 'Koi Naga Bayangan Sakura', rarity: 'Legendaris', price: 500, icon: '🐉', color: '#ec4899', petals: 20 },
];

export const GALLERY_ARTWORKS = [
  {
    id: 'temple',
    title: 'Kuil Pagoda Musim Semi',
    category: 'KUIL',
    img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
    desc: 'Arsitektur kayu bertingkat klasik Jepang di bawah naungan rimbunnya kelopak sakura merah muda.'
  },
  {
    id: 'bridge',
    title: 'Jembatan Kayu Merah',
    category: 'JEMBATAN',
    img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
    desc: 'Jembatan melengkung ikonik di atas kolam koi jernih dengan pantulan bunga sakura dan lentera batu.'
  },
  {
    id: 'nature',
    title: 'Kanopi Kelopak Sakura',
    category: 'ALAM',
    img: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=600&q=80',
    desc: 'Hembusan angin musim semi yang menerbangkan jutaan kelopak bunga berwarna merah muda di jalan setapak.'
  },
  {
    id: 'shrine',
    title: 'Gerbang Torii Suci',
    category: 'TORII',
    img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=600&q=80',
    desc: 'Pintu gerbang pembatas antara dunia fana dengan suaka kebun zen yang damai dan tenteram.'
  }
];

export const INITIAL_QUESTS = [
  {
    id: 'first_harvest',
    title: 'Panen Pertama Kuil',
    desc: 'Panen 1 tanaman apapun di kebun suci.',
    target: 1,
    current: 0,
    rewardCoins: 50,
    rewardPetals: 10,
    completed: false
  },
  {
    id: 'water_master',
    title: 'Ahli Pengairan Kuil',
    desc: 'Siram petak tanaman sebanyak 8 kali.',
    target: 8,
    current: 0,
    rewardCoins: 80,
    rewardPetals: 15,
    completed: false
  },
  {
    id: 'sakura_grower',
    title: 'Mekarkan Sakura Abadi',
    desc: 'Tanam dan panen 1 Bunga Sakura Abadi.',
    target: 1,
    current: 0,
    rewardCoins: 150,
    rewardPetals: 30,
    completed: false
  },
  {
    id: 'pond_fisher',
    title: 'Pemancing Jembatan Merah',
    desc: 'Tangkap 2 ekor ikan Koi di telaga jembatan merah.',
    target: 2,
    current: 0,
    rewardCoins: 120,
    rewardPetals: 20,
    completed: false
  },
  {
    id: 'shrine_offering',
    title: 'Persembahan Roh Kuil',
    desc: 'Bawakan hasil panen ke Altar Kuil Sakura.',
    target: 1,
    current: 0,
    rewardCoins: 200,
    rewardPetals: 40,
    completed: false
  }
];
