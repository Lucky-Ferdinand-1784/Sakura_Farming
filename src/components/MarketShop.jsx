import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CROPS, FISH_TYPES } from '../utils/gameData';
import { sound } from '../utils/audio';

export default function MarketShop({
  coins,
  setCoins,
  petals,
  setPetals,
  seedsInventory,
  setSeedsInventory,
  cropsInventory,
  setCropsInventory,
  fishInventory,
  setFishInventory,
  blessings,
  onActivity
}) {
  const [shopTab, setShopTab] = useState('seeds'); // 'seeds' | 'sell'
  const [shopMessage, setShopMessage] = useState('Selamat datang di Pasar Desa Kuil Sakura! Silakan bertransaksi.');

  const priceMultiplier = blessings?.prosperityBuff ? 1.2 : 1.0;

  // Buy seed
  const handleBuySeed = (cropId, quantity = 1) => {
    const crop = CROPS[cropId];
    const totalCost = crop.seedPrice * quantity;

    if (coins < totalCost) {
      sound.playTone(200, 'sawtooth', 0.2);
      setShopMessage(`Koin Zen Anda tidak cukup! Butuh ${totalCost} 🪙.`);
      return;
    }

    sound.playCoins();
    setCoins(prev => prev - totalCost);
    setSeedsInventory(prev => ({
      ...prev,
      [cropId]: (prev[cropId] || 0) + quantity
    }));

    setShopMessage(`Berhasil membeli x${quantity} Bibit ${crop.name} seharga ${totalCost} 🪙.`);
    onActivity('buy_seed', { cropId, quantity });
  };

  // Sell single crop item
  const handleSellCrop = (cropId) => {
    const count = cropsInventory[cropId] || 0;
    if (count <= 0) return;

    const crop = CROPS[cropId];
    const earned = Math.floor(crop.sellPrice * priceMultiplier);

    sound.playCoins();
    setCoins(prev => prev + earned);
    setCropsInventory(prev => ({
      ...prev,
      [cropId]: prev[cropId] - 1
    }));

    setShopMessage(`Menjual 1 ${crop.name} mendapatkan +${earned} 🪙!`);
    onActivity('sell_crop', { cropId, earned });
  };

  // Sell ALL crops
  const handleSellAllCrops = () => {
    let totalEarned = 0;
    let soldCount = 0;
    const newInventory = { ...cropsInventory };

    Object.keys(cropsInventory).forEach(cropId => {
      const count = cropsInventory[cropId] || 0;
      if (count > 0) {
        const crop = CROPS[cropId];
        const unitPrice = Math.floor(crop.sellPrice * priceMultiplier);
        totalEarned += unitPrice * count;
        soldCount += count;
        newInventory[cropId] = 0;
      }
    });

    if (soldCount === 0) {
      setShopMessage('Anda tidak memiliki hasil panen untuk dijual.');
      return;
    }

    sound.playCoins();
    try {
      confetti({ particleCount: 35, spread: 60 });
    } catch (e) {}

    setCoins(prev => prev + totalEarned);
    setCropsInventory(newInventory);
    setShopMessage(`Menjual semua hasil panen (${soldCount} item) mendapatkan +${totalEarned} 🪙!`);
  };

  // Sell single fish
  const handleSellFish = (fishId) => {
    const count = fishInventory[fishId] || 0;
    if (count <= 0) return;

    const fish = FISH_TYPES.find(f => f.id === fishId);
    const earned = Math.floor(fish.price * priceMultiplier);

    sound.playCoins();
    setCoins(prev => prev + earned);
    setFishInventory(prev => ({
      ...prev,
      [fishId]: prev[fishId] - 1
    }));

    setShopMessage(`Menjual 1 ${fish.name} mendapatkan +${earned} 🪙!`);
    onActivity('sell_fish', { fishId, earned });
  };

  // Sell ALL fish
  const handleSellAllFish = () => {
    let totalEarned = 0;
    let soldCount = 0;
    const newInventory = { ...fishInventory };

    Object.keys(fishInventory).forEach(fishId => {
      const count = fishInventory[fishId] || 0;
      if (count > 0) {
        const fish = FISH_TYPES.find(f => f.id === fishId);
        const unitPrice = Math.floor(fish.price * priceMultiplier);
        totalEarned += unitPrice * count;
        soldCount += count;
        newInventory[fishId] = 0;
      }
    });

    if (soldCount === 0) {
      setShopMessage('Anda tidak memiliki ikan untuk dijual.');
      return;
    }

    sound.playCoins();
    try {
      confetti({ particleCount: 35, spread: 60 });
    } catch (e) {}

    setCoins(prev => prev + totalEarned);
    setFishInventory(newInventory);
    setShopMessage(`Menjual semua ikan Koi (${soldCount} ekor) mendapatkan +${totalEarned} 🪙!`);
  };

  const totalCropsCount = Object.values(cropsInventory).reduce((a, b) => a + b, 0);
  const totalFishCount = Object.values(fishInventory).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Market Header */}
      <div className="bg-retro-card border-4 border-sakura-800 p-4 sm:p-6 pixel-border">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-retro-border pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sakura-900 border-2 border-sakura-500 flex items-center justify-center text-lg text-sakura-200 pixel-border-sm">
              🏬
            </div>
            <div>
              <span className="font-pixel text-[10px] text-retro-gold">PASAR TRADISIONAL</span>
              <h2 className="font-pixel text-sm sm:text-base text-white">Pasar Desa & Toko Kuil</h2>
            </div>
          </div>

          {/* Tab Switcher: Buy Seeds vs Sell Harvest */}
          <div className="flex items-center gap-2 font-pixel text-[10px]">
            <button
              onClick={() => { setShopTab('seeds'); sound.playTone(523, 'sine', 0.08); }}
              className={`px-3 py-2 border-2 pixel-btn ${
                shopTab === 'seeds'
                  ? 'bg-sakura-500 text-white border-sakura-200 pixel-border-sm'
                  : 'bg-retro-dark text-sakura-300 border-retro-border hover:border-sakura-400'
              }`}
            >
              🌱 Beli Bibit
            </button>
            <button
              onClick={() => { setShopTab('sell'); sound.playTone(587, 'sine', 0.08); }}
              className={`px-3 py-2 border-2 pixel-btn ${
                shopTab === 'sell'
                  ? 'bg-sakura-500 text-white border-sakura-200 pixel-border-sm'
                  : 'bg-retro-dark text-sakura-300 border-retro-border hover:border-sakura-400'
              }`}
            >
              🪙 Jual Panen & Ikan
            </button>
          </div>
        </div>

        {/* Message Banner */}
        <div className="bg-retro-dark p-3 border-2 border-retro-border font-pixel text-[9px] sm:text-[10px] text-sakura-200 flex items-center gap-2 mb-6">
          <span className="text-retro-gold">&gt;</span>
          <span className="truncate">{shopMessage}</span>
          {blessings?.prosperityBuff && (
            <span className="ml-auto text-[8px] bg-green-950 text-green-300 border border-green-700 px-1.5 py-0.5 whitespace-nowrap">
              BUFF +20% HARGA AKTIF
            </span>
          )}
        </div>

        {/* TAB 1: BUY SEEDS */}
        {shopTab === 'seeds' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(CROPS).map(crop => {
              const ownedSeeds = seedsInventory[crop.id] || 0;
              return (
                <div
                  key={crop.id}
                  className="bg-retro-dark p-4 border-2 border-retro-border flex flex-col justify-between gap-3 relative group hover:border-sakura-500 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-retro-card border-2 border-retro-border flex items-center justify-center text-2xl">
                      {crop.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-pixel text-xs text-white truncate">{crop.name}</h4>
                        <span className="font-pixel text-[10px] text-sakura-400">{crop.kanji}</span>
                      </div>
                      <p className="text-[11px] text-sakura-300/80 font-sans mt-0.5 line-clamp-2">
                        {crop.desc}
                      </p>
                      <div className="flex items-center gap-3 font-pixel text-[8px] text-sakura-400 mt-2">
                        <span>⏳ {crop.growthTime}s</span>
                        <span>🌸 +{crop.petalsAward} Kelopak</span>
                        <span className="text-retro-gold">Milik: x{ownedSeeds}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-retro-border">
                    <button
                      onClick={() => handleBuySeed(crop.id, 1)}
                      disabled={coins < crop.seedPrice}
                      className={`flex-1 py-2 font-pixel text-[9px] border pixel-btn ${
                        coins >= crop.seedPrice
                          ? 'bg-sakura-600 hover:bg-sakura-500 text-white border-sakura-300'
                          : 'bg-retro-card text-sakura-400/40 border-retro-border cursor-not-allowed'
                      }`}
                    >
                      Beli 1 ({crop.seedPrice} 🪙)
                    </button>
                    <button
                      onClick={() => handleBuySeed(crop.id, 5)}
                      disabled={coins < crop.seedPrice * 5}
                      className={`px-3 py-2 font-pixel text-[9px] border pixel-btn ${
                        coins >= crop.seedPrice * 5
                          ? 'bg-amber-600 hover:bg-amber-500 text-white border-amber-300'
                          : 'bg-retro-card text-sakura-400/40 border-retro-border cursor-not-allowed'
                      }`}
                    >
                      Beli 5 ({crop.seedPrice * 5} 🪙)
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: SELL HARVEST & FISH */}
        {shopTab === 'sell' && (
          <div className="space-y-6">
            {/* Crops Selling Section */}
            <div>
              <div className="flex items-center justify-between border-b border-retro-border pb-2 mb-3">
                <span className="font-pixel text-xs text-sakura-200">
                  🌾 HASIL PANEN KEBUN ({totalCropsCount} item)
                </span>
                <button
                  onClick={handleSellAllCrops}
                  disabled={totalCropsCount === 0}
                  className={`px-3 py-1 font-pixel text-[9px] border pixel-btn ${
                    totalCropsCount > 0
                      ? 'bg-amber-600 hover:bg-amber-500 text-white border-amber-300'
                      : 'bg-retro-dark text-sakura-400/40 border-retro-border cursor-not-allowed'
                  }`}
                >
                  Jual Semua Panen
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.values(CROPS).map(crop => {
                  const count = cropsInventory[crop.id] || 0;
                  const unitPrice = Math.floor(crop.sellPrice * priceMultiplier);
                  return (
                    <div
                      key={crop.id}
                      className="bg-retro-dark p-3 border-2 border-retro-border flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{crop.icon}</span>
                        <div>
                          <div className="font-pixel text-[9px] text-white truncate max-w-[130px]">
                            {crop.name}
                          </div>
                          <div className="font-pixel text-[8px] text-retro-gold mt-0.5">
                            Harga: {unitPrice} 🪙 (Milik: x{count})
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSellCrop(crop.id)}
                        disabled={count <= 0}
                        className={`px-3 py-1.5 font-pixel text-[8px] border pixel-btn ${
                          count > 0
                            ? 'bg-sakura-600 hover:bg-sakura-500 text-white border-sakura-300'
                            : 'bg-retro-card text-sakura-400/40 border-retro-border cursor-not-allowed'
                        }`}
                      >
                        Jual 1
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Fish Selling Section */}
            <div>
              <div className="flex items-center justify-between border-b border-retro-border pb-2 mb-3">
                <span className="font-pixel text-xs text-sakura-200">
                  🎏 HASIL TANGKAPAN IKAN TELAGA ({totalFishCount} ekor)
                </span>
                <button
                  onClick={handleSellAllFish}
                  disabled={totalFishCount === 0}
                  className={`px-3 py-1 font-pixel text-[9px] border pixel-btn ${
                    totalFishCount > 0
                      ? 'bg-amber-600 hover:bg-amber-500 text-white border-amber-300'
                      : 'bg-retro-dark text-sakura-400/40 border-retro-border cursor-not-allowed'
                  }`}
                >
                  Jual Semua Ikan
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {FISH_TYPES.map(fish => {
                  const count = fishInventory[fish.id] || 0;
                  const unitPrice = Math.floor(fish.price * priceMultiplier);
                  return (
                    <div
                      key={fish.id}
                      className="bg-retro-dark p-3 border-2 border-retro-border flex flex-col justify-between gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{fish.icon}</span>
                        <div>
                          <div className="font-pixel text-[9px] text-white truncate max-w-[130px]">
                            {fish.name.split('(')[0]}
                          </div>
                          <div className="font-pixel text-[8px] text-retro-gold">
                            {unitPrice} 🪙 • Milik: x{count}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSellFish(fish.id)}
                        disabled={count <= 0}
                        className={`w-full py-1 font-pixel text-[8px] border pixel-btn ${
                          count > 0
                            ? 'bg-sakura-600 hover:bg-sakura-500 text-white border-sakura-300'
                            : 'bg-retro-card text-sakura-400/40 border-retro-border cursor-not-allowed'
                        }`}
                      >
                        Jual 1 Ekor
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
