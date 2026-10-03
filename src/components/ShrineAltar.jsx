import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CROPS, FISH_TYPES } from '../utils/gameData';
import { sound } from '../utils/audio';

export default function ShrineAltar({
  cropsInventory,
  setCropsInventory,
  fishInventory,
  setFishInventory,
  plots,
  setPlots,
  coins,
  setCoins,
  petals,
  setPetals,
  blessings,
  setBlessings,
  onActivity
}) {
  const [altarMessage, setAltarMessage] = useState('Persembahkan hasil panen atau ikan Koi kepada Roh Kuil Sakura.');
  const [isRinging, setIsRinging] = useState(false);

  // Ring the sacred shrine bell
  const ringShrineBell = () => {
    setIsRinging(true);
    sound.playBlessing();
    setTimeout(() => setIsRinging(false), 500);

    // Random small blessing
    const bonusPetal = Math.floor(Math.random() * 3) + 1;
    setPetals(prev => prev + bonusPetal);
    setAltarMessage(`Lonceng kuil (Suzu) bergema damai... Roh kuil menghembuskan +${bonusPetal} Kelopak Sakura!`);
  };

  // Offer a crop
  const handleOfferCrop = (cropId) => {
    const count = cropsInventory[cropId] || 0;
    if (count <= 0) {
      setAltarMessage(`Anda tidak memiliki ${CROPS[cropId]?.name} untuk dipersembahkan.`);
      return;
    }

    sound.playBlessing();
    const crop = CROPS[cropId];

    // Deduct crop
    setCropsInventory(prev => ({
      ...prev,
      [cropId]: prev[cropId] - 1
    }));

    // Grant blessing points & petals
    const petalGain = (crop.petalsAward || 1) * 3;
    setPetals(prev => prev + petalGain);

    // Accelerate all growing plots by 25%
    const updatedPlots = plots.map(p => {
      if (p.state === 'growing') {
        const nextProgress = Math.min(100, p.progress + 25);
        return {
          ...p,
          progress: nextProgress,
          state: nextProgress >= 100 ? 'ready' : 'growing'
        };
      }
      return p;
    });
    setPlots(updatedPlots);

    try {
      confetti({
        particleCount: 30,
        spread: 60,
        colors: ['#f472b6', '#fdf2f4', '#f3c66a']
      });
    } catch (e) {}

    setAltarMessage(`Persembahan ${crop.name} diterima! Semua tanaman di kebun mendapatkan +25% pertumbuhan & Anda memperoleh +${petalGain} 🌸!`);
    onActivity('shrine_offering', { item: crop.name });
  };

  // Offer a fish
  const handleOfferFish = (fishId) => {
    const count = fishInventory[fishId] || 0;
    if (count <= 0) {
      setAltarMessage('Anda tidak memiliki ikan ini untuk dipersembahkan.');
      return;
    }

    sound.playBlessing();
    const fish = FISH_TYPES.find(f => f.id === fishId);

    // Deduct fish
    setFishInventory(prev => ({
      ...prev,
      [fishId]: prev[fishId] - 1
    }));

    const rewardCoins = Math.floor(fish.price * 1.5);
    const rewardPetals = 15;
    setCoins(prev => prev + rewardCoins);
    setPetals(prev => prev + rewardPetals);

    try {
      confetti({
        particleCount: 40,
        spread: 70,
        colors: [fish.color, '#f3c66a']
      });
    } catch (e) {}

    setAltarMessage(`Roh Telaga memberkati persembahan ${fish.name}! Dianugerahi +${rewardCoins} 🪙 & +${rewardPetals} 🌸!`);
    onActivity('shrine_offering', { item: fish.name });
  };

  // Buy Permanent Shrine Talisman / Omamori
  const buyTalisman = (type) => {
    if (type === 'growth') {
      if (petals < 50 || coins < 200) {
        setAltarMessage('Butuh 200 🪙 dan 50 🌸 untuk membuka Jimat Pertumbuhan Sakura!');
        return;
      }
      setCoins(prev => prev - 200);
      setPetals(prev => prev - 50);
      setBlessings(prev => ({ ...prev, fasterGrowth: true }));
      sound.playFishCaught();
      setAltarMessage('Jimat Pertumbuhan Suci diaktifkan! Semua tanaman kini tumbuh 20% lebih cepat secara permanen!');
    } else if (type === 'prosperity') {
      if (petals < 80 || coins < 350) {
        setAltarMessage('Butuh 350 🪙 dan 80 🌸 untuk membuka Jimat Kemakmuran Pasar!');
        return;
      }
      setCoins(prev => prev - 350);
      setPetals(prev => prev - 80);
      setBlessings(prev => ({ ...prev, prosperityBuff: true }));
      sound.playFishCaught();
      setAltarMessage('Jimat Kemakmuran Suci aktif! Harga jual panen dan ikan meningkat +20% di pasar!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Shrine Sanctuary Stage */}
      <div className="bg-retro-card border-4 border-sakura-800 p-4 sm:p-6 pixel-border">
        <div className="flex items-center justify-between border-b-2 border-retro-border pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sakura-900 border-2 border-sakura-500 flex items-center justify-center text-lg text-sakura-200 pixel-border-sm">
              ⛩️
            </div>
            <div>
              <span className="font-pixel text-[10px] text-retro-gold">SUAKA SUCI</span>
              <h2 className="font-pixel text-sm sm:text-base text-white">Altar Kuil & Roh Musim Semi</h2>
            </div>
          </div>
          <button
            onClick={ringShrineBell}
            className={`px-3 py-1.5 font-pixel text-[9px] bg-retro-gold hover:bg-yellow-400 text-retro-dark border-2 border-yellow-200 pixel-btn flex items-center gap-1.5 ${
              isRinging ? 'scale-110' : ''
            }`}
          >
            🔔 Bunyikan Suzu (Lonceng)
          </button>
        </div>

        {/* Shrine Visual Display */}
        <div className="p-6 bg-gradient-to-b from-[#2a1320] via-retro-dark to-[#121319] border-4 border-retro-border pixel-border text-center space-y-4">
          <div className="text-4xl sm:text-5xl animate-bounce">
            🏮 ⛩️ 🏮
          </div>
          <div className="font-pixel text-xs text-sakura-200 max-w-lg mx-auto leading-relaxed">
            "Bawalah persembahan murni dari kebun dan telaga. Roh Kuil akan memberkati tanah dan melimpahkan kelopak sakura."
          </div>
          <div className="bg-retro-card/90 p-3 border border-sakura-700 font-pixel text-[10px] text-retro-gold">
            &gt; {altarMessage}
          </div>
        </div>

        {/* Offerings Grid - Crops */}
        <div className="mt-6 space-y-4">
          <div className="font-pixel text-xs text-sakura-300 border-b border-retro-border pb-2 flex items-center gap-2">
            <span>🌾 PERSEMBAHAN HASIL PANEN KEBUN</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {Object.values(CROPS).map(crop => {
              const count = cropsInventory[crop.id] || 0;
              return (
                <div
                  key={crop.id}
                  className="bg-retro-dark p-2.5 border-2 border-retro-border flex flex-col items-center justify-between text-center gap-2"
                >
                  <span className="text-2xl">{crop.icon}</span>
                  <div className="font-pixel text-[8px] text-sakura-100 truncate w-full">{crop.name}</div>
                  <div className="font-pixel text-[8px] text-retro-gold">Dimiliki: x{count}</div>
                  <button
                    onClick={() => handleOfferCrop(crop.id)}
                    disabled={count <= 0}
                    className={`w-full py-1 font-pixel text-[8px] border pixel-btn ${
                      count > 0
                        ? 'bg-sakura-600 hover:bg-sakura-500 text-white border-sakura-300'
                        : 'bg-retro-card text-sakura-400/40 border-retro-border cursor-not-allowed'
                    }`}
                  >
                    Persembahkan
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Offerings Grid - Fish */}
        <div className="mt-6 space-y-4">
          <div className="font-pixel text-xs text-sakura-300 border-b border-retro-border pb-2 flex items-center gap-2">
            <span>🎏 PERSEMBAHAN IKAN TELAGA JEMBATAN MERAH</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {FISH_TYPES.map(fish => {
              const count = fishInventory[fish.id] || 0;
              return (
                <div
                  key={fish.id}
                  className="bg-retro-dark p-3 border-2 border-retro-border flex flex-col items-center justify-between text-center gap-2"
                >
                  <span className="text-3xl">{fish.icon}</span>
                  <div className="font-pixel text-[9px] text-white">{fish.name}</div>
                  <div className="font-pixel text-[8px] text-retro-gold">Dimiliki: x{count}</div>
                  <button
                    onClick={() => handleOfferFish(fish.id)}
                    disabled={count <= 0}
                    className={`w-full py-1.5 font-pixel text-[8px] border pixel-btn ${
                      count > 0
                        ? 'bg-amber-600 hover:bg-amber-500 text-white border-amber-300'
                        : 'bg-retro-card text-sakura-400/40 border-retro-border cursor-not-allowed'
                    }`}
                  >
                    Persembahkan
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sacred Talismans (Omamori) Permanent Upgrades */}
      <div className="bg-retro-card border-4 border-sakura-800 p-4 pixel-border">
        <div className="flex items-center justify-between border-b border-retro-border pb-3 mb-4">
          <span className="font-pixel text-xs text-retro-gold flex items-center gap-2">
            <i className="fa-solid fa-gem"></i> JIMAT SUCI KUIL (OMAMORI)
          </span>
          <span className="font-pixel text-[9px] text-sakura-400/80">
            Peningkatan Pasif Permanen
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Talisman 1 */}
          <div className="bg-retro-dark p-4 border-2 border-retro-border flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-pixel text-xs text-pink-300">🌸 Jimat Pertumbuhan Sakura</span>
                {blessings.fasterGrowth ? (
                  <span className="font-pixel text-[8px] bg-green-950 text-green-300 border border-green-700 px-2 py-0.5">
                    AKTIF
                  </span>
                ) : (
                  <span className="font-pixel text-[8px] text-sakura-400">200 🪙 + 50 🌸</span>
                )}
              </div>
              <p className="text-xs text-sakura-200/80 font-sans">
                Mempercepat waktu pertumbuhan semua bibit di kebun suci sebesar 20% secara permanen.
              </p>
            </div>
            <div className="pt-3">
              <button
                onClick={() => buyTalisman('growth')}
                disabled={blessings.fasterGrowth}
                className={`w-full py-2 font-pixel text-[9px] border pixel-btn ${
                  blessings.fasterGrowth
                    ? 'bg-retro-card text-green-400 border-green-900 cursor-default'
                    : 'bg-sakura-600 hover:bg-sakura-500 text-white border-sakura-300'
                }`}
              >
                {blessings.fasterGrowth ? 'Telah Diperoleh' : 'Buka Jimat Pertumbuhan'}
              </button>
            </div>
          </div>

          {/* Talisman 2 */}
          <div className="bg-retro-dark p-4 border-2 border-retro-border flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-pixel text-xs text-yellow-300">🪙 Jimat Kemakmuran Kuil</span>
                {blessings.prosperityBuff ? (
                  <span className="font-pixel text-[8px] bg-green-950 text-green-300 border border-green-700 px-2 py-0.5">
                    AKTIF
                  </span>
                ) : (
                  <span className="font-pixel text-[8px] text-sakura-400">350 🪙 + 80 🌸</span>
                )}
              </div>
              <p className="text-xs text-sakura-200/80 font-sans">
                Meningkatkan semua harga jual hasil panen dan ikan di Pasar Desa sebesar +20% selamanya.
              </p>
            </div>
            <div className="pt-3">
              <button
                onClick={() => buyTalisman('prosperity')}
                disabled={blessings.prosperityBuff}
                className={`w-full py-2 font-pixel text-[9px] border pixel-btn ${
                  blessings.prosperityBuff
                    ? 'bg-retro-card text-green-400 border-green-900 cursor-default'
                    : 'bg-amber-600 hover:bg-amber-500 text-white border-amber-300'
                }`}
              >
                {blessings.prosperityBuff ? 'Telah Diperoleh' : 'Buka Jimat Kemakmuran'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
