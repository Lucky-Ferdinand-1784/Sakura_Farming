import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import PetalCanvas from './components/PetalCanvas';
import FarmGrid from './components/FarmGrid';
import FishingPond from './components/FishingPond';
import ShrineAltar from './components/ShrineAltar';
import MarketShop from './components/MarketShop';
import QuestsModal from './components/QuestsModal';
import GalleryModal from './components/GalleryModal';
import SystemStatus from './components/SystemStatus';
import { CROPS, INITIAL_QUESTS } from './utils/gameData';
import { sound } from './utils/audio';

const STORAGE_KEY = 'sakura_pixel_farm_save_v1';

// Initial 16 plots (4x4)
const createInitialPlots = () => {
  return Array.from({ length: 16 }, (_, i) => {
    // Give player 2 tilled plots and 2 growing rice plots to start immediately
    if (i === 0) {
      return {
        id: `plot-${i}`,
        state: 'growing',
        cropId: 'rice',
        watered: true,
        progress: 60,
        fertilized: false,
        plantedAt: Date.now()
      };
    }
    if (i === 1) {
      return {
        id: `plot-${i}`,
        state: 'growing',
        cropId: 'matcha',
        watered: true,
        progress: 30,
        fertilized: false,
        plantedAt: Date.now()
      };
    }
    if (i === 2 || i === 3) {
      return {
        id: `plot-${i}`,
        state: 'tilled',
        cropId: null,
        watered: true,
        progress: 0,
        fertilized: false
      };
    }
    return {
      id: `plot-${i}`,
      state: 'grass',
      cropId: null,
      watered: false,
      progress: 0,
      fertilized: false
    };
  });
};

export default function App() {
  // Load saved state or default
  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved).coins ?? 65; } catch (e) {}
    }
    return 65;
  });

  const [petals, setPetals] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved).petals ?? 18; } catch (e) {}
    }
    return 18;
  });

  const [day, setDay] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved).day ?? 1; } catch (e) {}
    }
    return 1;
  });

  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [weather, setWeather] = useState('clear');
  const [currentTab, setCurrentTab] = useState('farm');

  const [plots, setPlots] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved).plots ?? createInitialPlots(); } catch (e) {}
    }
    return createInitialPlots();
  });

  const [selectedTool, setSelectedTool] = useState('hoe');
  const [selectedSeed, setSelectedSeed] = useState('rice');

  const [seedsInventory, setSeedsInventory] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved).seedsInventory ?? { rice: 3, matcha: 2, satsumaimo: 1, shiitake: 1 }; } catch (e) {}
    }
    return { rice: 3, matcha: 2, satsumaimo: 1, shiitake: 1 };
  });

  const [cropsInventory, setCropsInventory] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved).cropsInventory ?? { rice: 0, matcha: 0, satsumaimo: 0, shiitake: 0, edamame: 0, sakura_bloom: 0, shiroi_strawberry: 0 }; } catch (e) {}
    }
    return { rice: 0, matcha: 0, satsumaimo: 0, shiitake: 0, edamame: 0, sakura_bloom: 0, shiroi_strawberry: 0 };
  });

  const [fishInventory, setFishInventory] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved).fishInventory ?? { kohaku: 0, sanke: 0, ogon: 0, ryu: 0 }; } catch (e) {}
    }
    return { kohaku: 0, sanke: 0, ogon: 0, ryu: 0 };
  });

  const [blessings, setBlessings] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved).blessings ?? { fasterGrowth: false, prosperityBuff: false }; } catch (e) {}
    }
    return { fasterGrowth: false, prosperityBuff: false };
  });

  const [quests, setQuests] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved).quests ?? INITIAL_QUESTS; } catch (e) {}
    }
    return INITIAL_QUESTS;
  });

  const [isQuestsOpen, setIsQuestsOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Show temporary toast message
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Activity tracker for quests
  const handleActivity = (type, data) => {
    setQuests(prev =>
      prev.map(q => {
        if (q.completed) return q;

        let nextCurrent = q.current;
        if (type === 'harvest' && q.id === 'first_harvest') {
          nextCurrent += 1;
        } else if (type === 'harvest' && q.id === 'sakura_grower' && data?.cropId === 'sakura_bloom') {
          nextCurrent += 1;
        } else if (type === 'water' && q.id === 'water_master') {
          nextCurrent += typeof data === 'number' ? data : 1;
        } else if (type === 'catch_fish' && q.id === 'pond_fisher') {
          nextCurrent += 1;
        } else if (type === 'shrine_offering' && q.id === 'shrine_offering') {
          nextCurrent += 1;
        }

        return { ...q, current: nextCurrent };
      })
    );
  };

  // Crop Growth & Game Loop Timer (Every 1 second)
  useEffect(() => {
    const interval = setInterval(() => {
      setPlots(prevPlots => {
        let changed = false;
        const speedBonus = blessings.fasterGrowth ? 1.25 : 1.0;

        const next = prevPlots.map(plot => {
          if (plot.state === 'growing' && plot.cropId) {
            const crop = CROPS[plot.cropId];
            if (!crop) return plot;

            // Only grow if watered!
            if (plot.watered) {
              changed = true;
              // rate = 100% / growthTime (seconds)
              const rate = (100 / crop.growthTime) * speedBonus;
              const nextProgress = Math.min(100, plot.progress + rate);
              const isReady = nextProgress >= 100;

              return {
                ...plot,
                progress: nextProgress,
                state: isReady ? 'ready' : 'growing'
              };
            }
          }
          return plot;
        });

        return changed ? next : prevPlots;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [blessings.fasterGrowth]);

  // Day & Time Cycle Timer (every 40 seconds rotates morning -> noon -> dusk -> night)
  useEffect(() => {
    const cycleInterval = setInterval(() => {
      setTimeOfDay(prev => {
        if (prev === 'morning') return 'noon';
        if (prev === 'noon') return 'dusk';
        if (prev === 'dusk') return 'night';
        // Night -> Morning of next day!
        setDay(d => d + 1);
        setPetals(p => p + 3); // Morning bloom bonus
        showToast('🌅 Fajar menyingsing! Hari baru telah tiba & +3 🌸 gugur di kuil.');
        return 'morning';
      });
    }, 38000);

    return () => clearInterval(cycleInterval);
  }, []);

  // Auto-Save Game State to LocalStorage
  useEffect(() => {
    const saveState = {
      coins,
      petals,
      day,
      plots,
      seedsInventory,
      cropsInventory,
      fishInventory,
      blessings,
      quests
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saveState));
    } catch (e) {}
  }, [coins, petals, day, plots, seedsInventory, cropsInventory, fishInventory, blessings, quests]);

  // Reset Game Confirmation
  const resetGame = () => {
    if (window.confirm('Apakah Anda yakin ingin mengatur ulang data kebun suci ke awal?')) {
      localStorage.removeItem(STORAGE_KEY);
      setCoins(65);
      setPetals(18);
      setDay(1);
      setPlots(createInitialPlots());
      setSeedsInventory({ rice: 3, matcha: 2, satsumaimo: 1, shiitake: 1 });
      setCropsInventory({ rice: 0, matcha: 0, satsumaimo: 0, shiitake: 0, edamame: 0, sakura_bloom: 0, shiroi_strawberry: 0 });
      setFishInventory({ kohaku: 0, sanke: 0, ogon: 0, ryu: 0 });
      setBlessings({ fasterGrowth: false, prosperityBuff: false });
      setQuests(INITIAL_QUESTS);
      showToast('Suaka kebun telah diatur ulang ke kondisi awal.');
    }
  };

  const activeQuestsCount = quests.filter(q => !q.completed && q.current >= q.target).length;

  return (
    <div className={`min-h-screen flex flex-col relative ambience-${timeOfDay}`}>
      {/* Falling Sakura Petals Overlay Canvas */}
      <PetalCanvas weather={weather} intensity={40} />

      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        coins={coins}
        petals={petals}
        day={day}
        timeOfDay={timeOfDay}
        isAudioOn={isAudioOn}
        setIsAudioOn={setIsAudioOn}
        openQuestsModal={() => setIsQuestsOpen(true)}
        openGalleryModal={() => setIsGalleryOpen(true)}
        activeQuestsCount={activeQuestsCount}
      />

      {/* Main Game Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-8 z-10">
        {/* Hero Banner (Preserving original aesthetic and title) */}
        <header className="relative bg-gradient-to-r from-sakura-950/60 via-retro-card to-retro-card p-6 lg:p-8 border-4 border-sakura-800 pixel-border">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-sakura-900/60 border border-sakura-600 font-pixel text-[9px] text-sakura-300">
                <span className="w-2 h-2 bg-sakura-400 animate-ping"></span> ESTETIKA PIXEL FARM JEPANG
              </div>
              <h1 className="font-pixel text-xl sm:text-3xl lg:text-4xl text-white leading-relaxed">
                Kuil Sakura & <span className="text-sakura-400">Jembatan Merah</span>
              </h1>
              <p className="text-sakura-200 text-xs sm:text-sm font-sans max-w-xl leading-relaxed">
                Tanam bibit sakral di pelataran kuil, pancing ikan Koi di jembatan merah, dan persembahkan hasil panen untuk menghidupkan kembali suaka sakura musim semi.
              </p>
            </div>

            {/* Quick Hero Status Card */}
            <div className="bg-retro-dark p-4 border-2 border-retro-border pixel-border-gold text-center min-w-[240px]">
              <div className="text-[10px] font-pixel text-retro-gold mb-1">SUAKA ZEN STATUS</div>
              <div className="text-2xl text-sakura-300 my-1 font-pixel">🌸 {petals}</div>
              <div className="text-[9px] font-pixel text-sakura-400/80">Kelopak Sakura Terkumpul</div>
              <div className="mt-3 pt-2 border-t border-retro-border flex justify-between font-pixel text-[8px] text-sakura-300">
                <span>🪙 {coins} KOIN</span>
                <span>HARI KE-{day}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Zone Tabs */}
        {currentTab === 'farm' && (
          <FarmGrid
            plots={plots}
            setPlots={setPlots}
            selectedTool={selectedTool}
            setSelectedTool={setSelectedTool}
            selectedSeed={selectedSeed}
            setSelectedSeed={setSelectedSeed}
            seedsInventory={seedsInventory}
            setSeedsInventory={setSeedsInventory}
            cropsInventory={cropsInventory}
            setCropsInventory={setCropsInventory}
            coins={coins}
            setCoins={setCoins}
            petals={petals}
            setPetals={setPetals}
            onActivity={handleActivity}
          />
        )}

        {currentTab === 'pond' && (
          <FishingPond
            fishInventory={fishInventory}
            setFishInventory={setFishInventory}
            coins={coins}
            setCoins={setCoins}
            petals={petals}
            setPetals={setPetals}
            onActivity={handleActivity}
          />
        )}

        {currentTab === 'altar' && (
          <ShrineAltar
            cropsInventory={cropsInventory}
            setCropsInventory={setCropsInventory}
            fishInventory={fishInventory}
            setFishInventory={setFishInventory}
            plots={plots}
            setPlots={setPlots}
            coins={coins}
            setCoins={setCoins}
            petals={petals}
            setPetals={setPetals}
            blessings={blessings}
            setBlessings={setBlessings}
            onActivity={handleActivity}
          />
        )}

        {currentTab === 'market' && (
          <MarketShop
            coins={coins}
            setCoins={setCoins}
            petals={petals}
            setPetals={setPetals}
            seedsInventory={seedsInventory}
            setSeedsInventory={setSeedsInventory}
            cropsInventory={cropsInventory}
            setCropsInventory={setCropsInventory}
            fishInventory={fishInventory}
            setFishInventory={setFishInventory}
            blessings={blessings}
            onActivity={handleActivity}
          />
        )}

        {/* Sanctuary Stats Ribbon (matching original design 4 stats boxes) */}
        <section className="border-4 border-sakura-800 bg-retro-card p-4 pixel-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-pixel">
            <div className="p-3 border-2 border-retro-border bg-retro-dark">
              <div className="text-xl sm:text-2xl text-sakura-400 mb-1">16</div>
              <div className="text-[9px] text-sakura-200">Petak Tanah Suci</div>
            </div>
            <div className="p-3 border-2 border-retro-border bg-retro-dark">
              <div className="text-xl sm:text-2xl text-sakura-400 mb-1">7+</div>
              <div className="text-[9px] text-sakura-200">Kultivar Tanaman</div>
            </div>
            <div className="p-3 border-2 border-retro-border bg-retro-dark">
              <div className="text-xl sm:text-2xl text-sakura-400 mb-1">4</div>
              <div className="text-[9px] text-sakura-200">Spesies Ikan Koi</div>
            </div>
            <div className="p-3 border-2 border-retro-border bg-retro-dark">
              <div className="text-xl sm:text-2xl text-sakura-400 mb-1">100%</div>
              <div className="text-[9px] text-sakura-200">Retro Zen Vibe</div>
            </div>
          </div>
        </section>

        {/* System Status & Zen Audio Synthesizer */}
        <SystemStatus
          plots={plots}
          coins={coins}
          petals={petals}
          day={day}
          timeOfDay={timeOfDay}
          weather={weather}
          isAudioOn={isAudioOn}
          setIsAudioOn={setIsAudioOn}
        />
      </main>

      {/* Footer */}
      <footer className="bg-retro-dark border-t-4 border-sakura-800 py-10 px-4 text-center font-pixel text-xs text-sakura-300 space-y-4 mt-12 z-10">
        <div className="flex justify-center items-center gap-6 text-base">
          <button
            onClick={() => setIsGalleryOpen(true)}
            className="hover:text-sakura-400 transition-colors text-xs font-pixel flex items-center gap-1.5"
          >
            <i className="fa-solid fa-images"></i> Galeri Seni
          </button>
          <button
            onClick={() => setIsQuestsOpen(true)}
            className="hover:text-sakura-400 transition-colors text-xs font-pixel flex items-center gap-1.5"
          >
            <i className="fa-solid fa-scroll"></i> Misi Zen
          </button>
          <button
            onClick={resetGame}
            className="hover:text-red-400 transition-colors text-xs font-pixel flex items-center gap-1.5 text-sakura-400/60"
          >
            <i className="fa-solid fa-rotate-left"></i> Reset Suaka
          </button>
        </div>
        <p className="text-[9px] text-sakura-400/80">
          © 2026 SAKURA PIXEL FARM SANCTUARY • KUIL & JEMBATAN MERAH • REACT EDITION
        </p>
      </footer>

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-retro-card border-2 border-retro-gold pixel-border-gold p-3 font-pixel text-[10px] text-retro-gold max-w-sm animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Quests Modal */}
      <QuestsModal
        isOpen={isQuestsOpen}
        onClose={() => setIsQuestsOpen(false)}
        quests={quests}
        setQuests={setQuests}
        coins={coins}
        setCoins={setCoins}
        petals={petals}
        setPetals={setPetals}
      />

      {/* Gallery Modal */}
      <GalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />
    </div>
  );
}
