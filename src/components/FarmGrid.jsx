import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CROPS, TOOLS } from '../utils/gameData';
import { sound } from '../utils/audio';

export default function FarmGrid({
  plots,
  setPlots,
  selectedTool,
  setSelectedTool,
  selectedSeed,
  setSelectedSeed,
  seedsInventory,
  setSeedsInventory,
  cropsInventory,
  setCropsInventory,
  coins,
  setCoins,
  petals,
  setPetals,
  onActivity
}) {
  const [popups, setPopups] = useState([]);
  const [actionMessage, setActionMessage] = useState('Pilih alat lalu klik petak tanah di kebun suci.');
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
  const [isSwinging, setIsSwinging] = useState(false);

  // Trigger floating popup on action
  const triggerPopup = (plotIndex, text, color = '#f3c66a') => {
    const id = Date.now() + Math.random();
    setPopups(prev => [...prev, { id, plotIndex, text, color }]);
    setTimeout(() => {
      setPopups(prev => prev.filter(p => p.id !== id));
    }, 1100);
  };

  // Perform action on tile
  const handleTileClick = (plot, index) => {
    const col = index % 4;
    const row = Math.floor(index / 4);
    setPlayerPos({ x: col, y: row });
    setIsSwinging(true);
    setTimeout(() => setIsSwinging(false), 220);

    // 1. HOE: Till untilled grass
    if (selectedTool === 'hoe') {
      if (plot.state === 'grass') {
        sound.playDig();
        const updated = [...plots];
        updated[index] = {
          ...plot,
          state: 'tilled',
          watered: false,
          cropId: null,
          progress: 0
        };
        setPlots(updated);
        triggerPopup(index, '⛏️ Digemburkan', '#fed7aa');
        setActionMessage('Tanah berhasil digemburkan! Sekarang sirami atau tanam bibit.');
        onActivity('till', 1);
      } else {
        setActionMessage('Petak ini sudah digemburkan.');
      }
      return;
    }

    // 2. WATER: Water tilled/growing crop
    if (selectedTool === 'water') {
      if (plot.state === 'tilled' || plot.state === 'growing') {
        if (!plot.watered) {
          sound.playWater();
          const updated = [...plots];
          updated[index] = {
            ...plot,
            watered: true
          };
          setPlots(updated);
          triggerPopup(index, '💧 Disiram!', '#60a5fa');
          setActionMessage('Tanah disiram air suci! Tanaman akan tumbuh subur.');
          onActivity('water', 1);
        } else {
          setActionMessage('Tanah ini masih basah dan segar.');
        }
      } else {
        setActionMessage('Gemburkan tanah terlebih dahulu sebelum menyiram.');
      }
      return;
    }

    // 3. PLANT: Plant selected seed
    if (selectedTool === 'plant') {
      if (!selectedSeed) {
        setActionMessage('Pilih jenis bibit yang ingin ditanam di bilah bawah!');
        return;
      }
      const availableSeedCount = seedsInventory[selectedSeed] || 0;
      if (availableSeedCount <= 0) {
        setActionMessage(`Bibit ${CROPS[selectedSeed]?.name} Anda habis! Beli di Pasar.`);
        return;
      }

      if (plot.state === 'tilled') {
        sound.playPlant();
        // Deduct seed
        setSeedsInventory(prev => ({
          ...prev,
          [selectedSeed]: prev[selectedSeed] - 1
        }));

        const updated = [...plots];
        updated[index] = {
          ...plot,
          state: 'growing',
          cropId: selectedSeed,
          progress: 0,
          plantedAt: Date.now()
        };
        setPlots(updated);
        triggerPopup(index, `🌱 Ditanam: ${CROPS[selectedSeed].name}`, '#86efac');
        setActionMessage(`Berhasil menanam ${CROPS[selectedSeed].name}. Jaga kelembaban tanahnya!`);
        onActivity('plant', 1);
      } else if (plot.state === 'growing' || plot.state === 'ready') {
        setActionMessage('Petak ini sudah ada tanamannya.');
      } else {
        setActionMessage('Gemburkan tanah dengan Cangkul sebelum menanam bibit.');
      }
      return;
    }

    // 4. HARVEST: Collect ripe crop
    if (selectedTool === 'harvest' || plot.state === 'ready') {
      if (plot.state === 'ready') {
        sound.playHarvest();
        const crop = CROPS[plot.cropId];

        // Trigger confetti for celebration
        try {
          confetti({
            particleCount: 28,
            spread: 45,
            origin: { y: 0.65 },
            colors: ['#e8758c', '#f3c66a', '#fdf2f4']
          });
        } catch (e) {}

        // Add to crop inventory
        setCropsInventory(prev => ({
          ...prev,
          [plot.cropId]: (prev[plot.cropId] || 0) + 1
        }));

        // Bonus petals
        const petalBonus = crop.petalsAward || 1;
        setPetals(prev => prev + petalBonus);

        triggerPopup(index, `✨ +1 ${crop.icon} (+${petalBonus} 🌸)`, crop.color);
        setActionMessage(`Panen berkah! Anda mendapatkan 1 ${crop.name} & ${petalBonus} Kelopak Sakura.`);

        // Reset tile to tilled (ready for next planting)
        const updated = [...plots];
        updated[index] = {
          ...plot,
          state: 'tilled',
          watered: false,
          cropId: null,
          progress: 0
        };
        setPlots(updated);
        onActivity('harvest', { cropId: crop.id, count: 1 });
      } else if (plot.state === 'growing') {
        const crop = CROPS[plot.cropId];
        setActionMessage(`${crop.name} masih bertumbuh (${Math.floor(plot.progress)}%). Sabarlah.`);
      } else {
        setActionMessage('Belum ada tanaman yang siap dipanen di petak ini.');
      }
      return;
    }

    // 5. FERTILIZER: Instant boost
    if (selectedTool === 'fertilizer') {
      if (plot.state === 'growing') {
        if (petals < 3) {
          setActionMessage('Butuh 3 Kelopak Sakura 🌸 untuk membuat pupuk berkah!');
          return;
        }
        setPetals(prev => prev - 3);
        sound.playBlessing();
        const updated = [...plots];
        updated[index] = {
          ...plot,
          progress: Math.min(100, plot.progress + 45),
          fertilized: true
        };
        if (updated[index].progress >= 100) {
          updated[index].state = 'ready';
        }
        setPlots(updated);
        triggerPopup(index, '✨ Berkat Sakura! +45%', '#f472b6');
        setActionMessage('Pupuk Kelopak Sakura mempercepat pertumbuhan tanaman!');
      } else {
        setActionMessage('Hanya bisa digunakan pada tanaman yang sedang tumbuh.');
      }
      return;
    }
  };

  // Water All Plots helper
  const handleWaterAll = () => {
    sound.playWater();
    let wateredCount = 0;
    const updated = plots.map(p => {
      if ((p.state === 'tilled' || p.state === 'growing') && !p.watered) {
        wateredCount++;
        return { ...p, watered: true };
      }
      return p;
    });
    setPlots(updated);
    if (wateredCount > 0) {
      setActionMessage(`Menyirami ${wateredCount} petak tanah sekaligus dengan air suci!`);
      onActivity('water', wateredCount);
    } else {
      setActionMessage('Semua petak sudah disiram atau belum digemburkan.');
    }
  };

  // Harvest All Ready Crops helper
  const handleHarvestAll = () => {
    let harvestCount = 0;
    let totalPetals = 0;
    const newInventory = { ...cropsInventory };

    const updated = plots.map((p, idx) => {
      if (p.state === 'ready') {
        harvestCount++;
        const crop = CROPS[p.cropId];
        newInventory[p.cropId] = (newInventory[p.cropId] || 0) + 1;
        totalPetals += crop.petalsAward || 1;
        triggerPopup(idx, `✨ +1 ${crop.icon}`, crop.color);
        return {
          ...p,
          state: 'tilled',
          watered: false,
          cropId: null,
          progress: 0
        };
      }
      return p;
    });

    if (harvestCount > 0) {
      sound.playHarvest();
      try {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
      setPlots(updated);
      setCropsInventory(newInventory);
      setPetals(prev => prev + totalPetals);
      setActionMessage(`Panen massal berhasil! Memanen ${harvestCount} tanaman & +${totalPetals} 🌸.`);
      onActivity('harvest_all', harvestCount);
    } else {
      setActionMessage('Belum ada tanaman yang siap panen.');
    }
  };

  // Render crop graphic inside plot
  const renderCropVisual = (plot) => {
    if (plot.state === 'grass') {
      return (
        <div className="flex flex-col items-center justify-center text-xs opacity-60">
          <span className="text-emerald-400">🌿</span>
          <span className="text-[8px] font-pixel text-sakura-400/60 mt-1">RUMPUT</span>
        </div>
      );
    }

    if (plot.state === 'tilled') {
      return (
        <div className="flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-none border border-amber-900/60 flex items-center justify-center bg-amber-950/40">
            {plot.watered ? (
              <span className="text-blue-300 text-xs animate-bounce">💧</span>
            ) : (
              <span className="text-amber-600/70 text-xs">⛏️</span>
            )}
          </div>
          <span className="text-[8px] font-pixel text-amber-300/80 mt-1">
            {plot.watered ? 'LEMBAB' : 'SIAP TANAM'}
          </span>
        </div>
      );
    }

    const crop = CROPS[plot.cropId];
    if (!crop) return null;

    if (plot.state === 'ready') {
      return (
        <div className="flex flex-col items-center justify-center animate-harvest-pulse">
          <div className="relative">
            <span className="text-3xl filter drop-shadow">{crop.icon}</span>
            <span className="absolute -top-1 -right-2 text-[10px] animate-spin">✨</span>
          </div>
          <span className="text-[8px] font-pixel bg-sakura-500 text-white px-1 mt-1 border border-sakura-200">
            PANEN!
          </span>
        </div>
      );
    }

    // Growing phase
    const stageIdx = Math.min(
      crop.growthStages.length - 2,
      Math.floor((plot.progress / 100) * (crop.growthStages.length - 1))
    );
    const stageVisual = crop.growthStages[stageIdx] || '🌱';

    return (
      <div className="flex flex-col items-center justify-center w-full px-1">
        <div className="relative">
          <span className="text-xl">{stageVisual}</span>
          {plot.fertilized && (
            <span className="absolute -top-1 -right-1 text-[8px] text-pink-300">🌸</span>
          )}
        </div>
        <div className="w-full bg-retro-dark h-1.5 border border-retro-border mt-1.5 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              plot.watered ? 'bg-sakura-400' : 'bg-amber-600'
            }`}
            style={{ width: `${Math.min(100, Math.floor(plot.progress))}%` }}
          ></div>
        </div>
        <div className="flex justify-between w-full text-[7px] font-pixel text-sakura-300/70 mt-0.5">
          <span>{Math.floor(plot.progress)}%</span>
          <span>{plot.watered ? '💧' : '☀️ KERING'}</span>
        </div>
      </div>
    );
  };

  const readyCount = plots.filter(p => p.state === 'ready').length;

  return (
    <div className="space-y-6">
      {/* Sanctuary Garden Header & Scene */}
      <div className="relative bg-retro-card border-4 border-sakura-800 p-4 sm:p-6 pixel-border">
        {/* Background garden decorative elements */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-retro-border pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-sakura-900/80 border-2 border-sakura-500 flex items-center justify-center text-xl text-sakura-200 pixel-border-sm">
              ⛩️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-pixel text-retro-gold">PELATARAN KUIL SAKURA</span>
                <span className="w-2 h-2 bg-emerald-400 rounded-none animate-ping"></span>
              </div>
              <h2 className="text-sm sm:text-base font-pixel text-white mt-1">Kebun Berkah Musim Semi</h2>
            </div>
          </div>

          {/* Quick Action Helpers */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleWaterAll}
              className="px-3 py-1.5 font-pixel text-[9px] bg-blue-900/60 hover:bg-blue-800 text-blue-200 border-2 border-blue-400 pixel-btn flex items-center gap-1.5"
            >
              <i className="fa-solid fa-water"></i> Siram Semua
            </button>
            <button
              onClick={handleHarvestAll}
              disabled={readyCount === 0}
              className={`px-3 py-1.5 font-pixel text-[9px] border-2 pixel-btn flex items-center gap-1.5 ${
                readyCount > 0
                  ? 'bg-sakura-500 hover:bg-sakura-600 text-white border-sakura-200 pixel-border-sm'
                  : 'bg-retro-dark text-sakura-300/40 border-retro-border cursor-not-allowed'
              }`}
            >
              <i className="fa-solid fa-hand-sparkles"></i>
              Panen Siap ({readyCount})
            </button>
          </div>
        </div>

        {/* Message Banner */}
        <div className="bg-retro-dark p-2.5 border-2 border-retro-border font-pixel text-[9px] sm:text-[10px] text-sakura-200 flex items-center gap-2 mb-6">
          <span className="text-retro-gold animate-bounce">&gt;</span>
          <span className="truncate">{actionMessage}</span>
        </div>

        {/* The 4x4 Grid of Soil Plots */}
        <div className="max-w-2xl mx-auto">
          {/* Top Temple Wall & Torii Gate Banner */}
          <div className="text-center pb-2 text-[10px] font-pixel text-sakura-400/80 flex items-center justify-center gap-3">
            <span>🏮</span>
            <span>GERBANG TAMAN SUCI</span>
            <span>🏮</span>
          </div>

          <div className="grid grid-cols-4 gap-2.5 sm:gap-4 p-3 sm:p-5 bg-[#14151b] border-4 border-sakura-900 pixel-border relative">
            {plots.map((plot, idx) => {
              const isTilled = plot.state === 'tilled';
              const isGrowing = plot.state === 'growing';
              const isReady = plot.state === 'ready';

              let tileBg = 'bg-[#1e2318] hover:bg-[#252c1e] border-emerald-950'; // grass
              if (isTilled || isGrowing || isReady) {
                tileBg = plot.watered
                  ? 'bg-[#2e1d17] hover:bg-[#38231c] border-amber-900' // wet soil
                  : 'bg-[#3d2a20] hover:bg-[#4a3327] border-amber-800'; // dry soil
              }

              return (
                <div
                  key={plot.id || idx}
                  onClick={() => handleTileClick(plot, idx)}
                  className={`aspect-square relative cursor-pointer border-2 transition-all p-1.5 flex flex-col items-center justify-center select-none group ${tileBg}`}
                >
                  {/* Subtle tile index tag */}
                  <span className="absolute top-1 left-1 text-[7px] font-pixel text-sakura-400/30">
                    #{idx + 1}
                  </span>

                  {/* Render Visual based on state */}
                  {renderCropVisual(plot)}

                  {/* Floating Action Text Popups */}
                  {popups
                    .filter(p => p.plotIndex === idx)
                    .map(p => (
                      <div
                        key={p.id}
                        className="absolute -top-3 left-1/2 float-popup font-pixel text-[9px] px-2 py-0.5 bg-retro-dark/95 border border-white whitespace-nowrap z-30 pointer-events-none"
                        style={{ color: p.color }}
                      >
                        {p.text}
                      </div>
                    ))}
                </div>
              );
            })}
          </div>

          {/* Character Avatar & Little Kitsune Companion */}
          <div className="mt-4 flex items-center justify-between px-3 text-[10px] font-pixel text-sakura-300">
            <div className="flex items-center gap-2">
              <span className={`text-base ${isSwinging ? 'rotate-12 scale-125' : ''} transition-transform`}>
                🧙‍♀️
              </span>
              <span>Penjaga Kebun (Miko Sakura)</span>
            </div>
            <div className="flex items-center gap-1.5 text-retro-gold">
              <span className="text-sm animate-pulse">🦊</span>
              <span>Roh Kitsune Menemani</span>
            </div>
          </div>
        </div>
      </div>

      {/* Farm Tool Selector Toolbar */}
      <div className="bg-retro-card border-4 border-sakura-800 p-4 pixel-border">
        <div className="flex items-center justify-between border-b border-retro-border pb-3 mb-3">
          <span className="font-pixel text-[10px] text-retro-gold flex items-center gap-2">
            <i className="fa-solid fa-toolbox"></i> BILAH PERALATAN (TOOLS)
          </span>
          <span className="text-[9px] font-pixel text-sakura-400/80">
            Pilih alat lalu klik petak
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 font-pixel text-[9px]">
          {TOOLS.map((tool, idx) => {
            const isSelected = selectedTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => {
                  setSelectedTool(tool.id);
                  sound.playTone(400 + idx * 50, 'sine', 0.08);
                  setActionMessage(`Alat aktif: ${tool.name}. ${tool.desc}`);
                }}
                className={`p-2.5 border-2 text-left flex flex-col justify-between h-20 transition-all ${
                  isSelected
                    ? 'bg-sakura-500 text-white border-sakura-200 pixel-border-sm scale-102'
                    : 'bg-retro-dark text-sakura-300 border-sakura-800 hover:border-sakura-400'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs">
                    <i className={tool.icon}></i>
                  </span>
                  <span className="text-[8px] opacity-70">#{idx + 1}</span>
                </div>
                <div className="font-pixel leading-tight">
                  {tool.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Seed Selector Tray (Active when Planting) */}
      <div className="bg-retro-card border-4 border-sakura-800 p-4 pixel-border">
        <div className="flex items-center justify-between border-b border-retro-border pb-3 mb-3">
          <span className="font-pixel text-[10px] text-sakura-300 flex items-center gap-2">
            <i className="fa-solid fa-seedling text-emerald-400"></i> KANTUNG BIBIT KUIL
          </span>
          <span className="text-[9px] font-pixel text-sakura-400/70">
            Bibit aktif untuk ditanam
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {Object.values(CROPS).map(crop => {
            const count = seedsInventory[crop.id] || 0;
            const isSelected = selectedSeed === crop.id;

            return (
              <button
                key={crop.id}
                onClick={() => {
                  setSelectedSeed(crop.id);
                  setSelectedTool('plant');
                  sound.playTone(520, 'sine', 0.08);
                  setActionMessage(`Bibit aktif: ${crop.name} (Tersisa: ${count}). Klik petak tanah gembur.`);
                }}
                className={`p-2 border-2 text-center transition-all flex flex-col items-center justify-between gap-1 select-none ${
                  isSelected
                    ? 'bg-sakura-700/80 text-white border-retro-gold pixel-border-gold'
                    : 'bg-retro-dark text-sakura-300 border-retro-border hover:border-sakura-500'
                }`}
              >
                <span className="text-xl">{crop.icon}</span>
                <span className="font-pixel text-[8px] truncate w-full">{crop.name}</span>
                <span
                  className={`font-pixel text-[8px] px-1.5 py-0.5 border ${
                    count > 0
                      ? 'bg-sakura-950 text-retro-gold border-retro-gold/40'
                      : 'bg-red-950/60 text-red-400 border-red-800'
                  }`}
                >
                  {count > 0 ? `x${count}` : 'HABIS'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
