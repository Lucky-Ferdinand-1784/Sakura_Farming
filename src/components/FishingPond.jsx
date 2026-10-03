import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { FISH_TYPES } from '../utils/gameData';
import { sound } from '../utils/audio';

export default function FishingPond({
  fishInventory,
  setFishInventory,
  coins,
  setCoins,
  petals,
  setPetals,
  onActivity
}) {
  const [fishingState, setFishingState] = useState('idle'); // idle | casting | waiting | hooked | reeling | caught
  const [biteAlert, setBiteAlert] = useState(false);
  const [caughtFish, setCaughtFish] = useState(null);
  const [statusText, setStatusText] = useState('Duduk di tepi Jembatan Merah dan nikmati ketenangan aliran air.');
  const [reelProgress, setReelProgress] = useState(0);

  const biteTimerRef = useRef(null);
  const missTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      clearTimeout(biteTimerRef.current);
      clearTimeout(missTimerRef.current);
    };
  }, []);

  // 1. Cast fishing line
  const handleCast = () => {
    sound.playWater();
    setFishingState('waiting');
    setBiteAlert(false);
    setCaughtFish(null);
    setStatusText('Kail telah dilempar ke kolam jernih... Menunggu ikan Koi mendekat.');

    // Random bite time between 2.5 and 5.5 seconds
    const waitTime = Math.random() * 3000 + 2500;
    biteTimerRef.current = setTimeout(() => {
      setFishingState('hooked');
      setBiteAlert(true);
      sound.playFishBite();
      setStatusText('! GIGITAN ! KLIK TARIK PANCING SEKARANG!');

      // Player has 1.8 seconds to react
      missTimerRef.current = setTimeout(() => {
        setFishingState('idle');
        setBiteAlert(false);
        sound.playTone(200, 'sawtooth', 0.2);
        setStatusText('Aduh! Ikan keburu kabur memakan umpan. Coba lempar lagi.');
      }, 1900);
    }, waitTime);
  };

  // 2. Hook / Strike
  const handleStrike = () => {
    if (fishingState !== 'hooked') return;
    clearTimeout(missTimerRef.current);
    setBiteAlert(false);
    setFishingState('reeling');
    setReelProgress(30);
    sound.playTone(700, 'square', 0.1);
    setStatusText('Kail tersangkut! Tekan gulung pancing hingga penuh!');
  };

  // 3. Reeling clicker
  const handleReelClick = () => {
    if (fishingState !== 'reeling') return;
    sound.playTone(550 + reelProgress * 5, 'sine', 0.05);
    const newProgress = reelProgress + 18;

    if (newProgress >= 100) {
      // Caught the fish!
      finishCatch();
    } else {
      setReelProgress(newProgress);
    }
  };

  // 4. Resolve caught fish
  const finishCatch = () => {
    clearTimeout(missTimerRef.current);
    sound.playFishCaught();

    // Weighted random fish determination
    const roll = Math.random();
    let pickedFish;
    if (roll < 0.50) {
      pickedFish = FISH_TYPES[0]; // Kohaku (50%)
    } else if (roll < 0.80) {
      pickedFish = FISH_TYPES[1]; // Sanke (30%)
    } else if (roll < 0.95) {
      pickedFish = FISH_TYPES[2]; // Ogon (15%)
    } else {
      pickedFish = FISH_TYPES[3]; // Ryu Dragon Koi (5% Legendary!)
    }

    setCaughtFish(pickedFish);
    setFishingState('caught');

    try {
      confetti({
        particleCount: 35,
        spread: 55,
        colors: [pickedFish.color, '#f3c66a', '#ffffff']
      });
    } catch (e) {}

    // Add to inventory
    setFishInventory(prev => ({
      ...prev,
      [pickedFish.id]: (prev[pickedFish.id] || 0) + 1
    }));

    if (pickedFish.petals) {
      setPetals(prev => prev + pickedFish.petals);
    }

    setStatusText(`Luar biasa! Berhasil menangkap ${pickedFish.name} (${pickedFish.rarity})!`);
    onActivity('catch_fish', pickedFish);
  };

  // Cancel or reset
  const handleReset = () => {
    clearTimeout(biteTimerRef.current);
    clearTimeout(missTimerRef.current);
    setFishingState('idle');
    setBiteAlert(false);
    setCaughtFish(null);
    setStatusText('Siap melempar kail kembali.');
  };

  return (
    <div className="space-y-6">
      {/* Visual Scene of Red Bridge & Koi Pond */}
      <div className="bg-retro-card border-4 border-sakura-800 p-4 sm:p-6 pixel-border">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-retro-border pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sakura-900 border-2 border-sakura-500 flex items-center justify-center text-lg text-sakura-200 pixel-border-sm">
              🎏
            </div>
            <div>
              <span className="font-pixel text-[10px] text-retro-gold">IKONIK SUAKA</span>
              <h2 className="font-pixel text-sm sm:text-base text-white">Jembatan Kayu Merah & Telaga Koi</h2>
            </div>
          </div>
          <span className="font-pixel text-[9px] bg-sakura-950 text-sakura-300 border border-sakura-700 px-2 py-1">
            TELAGA AIR TENANG
          </span>
        </div>

        {/* Scenic Pixel Showcase of The Red Bridge */}
        <div className="relative overflow-hidden border-4 border-retro-border aspect-[21/9] sm:aspect-[24/9] bg-gradient-to-b from-[#1a233a] via-[#161a29] to-[#0c1322] flex flex-col justify-between p-4 pixel-border">
          {/* Distant moon & sakura branches */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌸</span>
              <span className="font-pixel text-[9px] text-sakura-300/80">Ketinggian Air: Tenang & Jernih</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-100/90 shadow-[0_0_20px_rgba(254,243,199,0.5)] flex items-center justify-center">
              <span className="text-xs">🏮</span>
            </div>
          </div>

          {/* Red Bridge Graphic representation */}
          <div className="relative w-full flex flex-col items-center my-auto">
            {/* The Arc of Red Bridge */}
            <div className="w-4/5 sm:w-3/5 h-6 bg-[#b91c1c] border-t-4 border-b-2 border-[#f87171] relative flex justify-between items-center px-4 pixel-border-sm">
              <div className="w-3 h-8 -top-3 absolute left-4 bg-[#7f1d1d] border border-amber-300"></div>
              <div className="w-3 h-8 -top-3 absolute right-4 bg-[#7f1d1d] border border-amber-300"></div>
              <span className="text-[10px] font-pixel text-amber-200 mx-auto">
                ⛩️ JEMBATAN MERAH ⛩️
              </span>
            </div>

            {/* Water Surface with Ripples and Swimming Koi */}
            <div className="w-full mt-3 flex justify-around items-center text-xs opacity-80">
              <span className="animate-pulse">🐟</span>
              <span className="text-blue-300 text-[9px]">~~~ 🌸 ~~~</span>
              <span className="animate-bounce text-orange-400">🐠</span>
              <span className="text-blue-300 text-[9px]">~~~ 💧 ~~~</span>
              <span className="text-yellow-300 animate-pulse">🐡</span>
            </div>
          </div>

          {/* Fishing Bobber Indicator in Water */}
          <div className="text-center">
            {fishingState === 'waiting' && (
              <div className="inline-flex items-center gap-2 bg-retro-dark/80 px-3 py-1 border border-blue-400 font-pixel text-[9px] text-blue-200">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                Umpan mengapung di air... Menunggu getaran...
              </div>
            )}
            {fishingState === 'hooked' && (
              <div className="inline-flex items-center gap-2 bg-red-950 px-4 py-2 border-2 border-red-500 font-pixel text-xs text-yellow-300 animate-bounce">
                <span className="text-base">🚨</span>
                GIGITAN TERDETEKSI! TEKAN TARIK SEKARANG!
              </div>
            )}
          </div>
        </div>

        {/* Fishing Control Console */}
        <div className="mt-4 bg-retro-dark p-4 border-2 border-retro-border">
          <div className="flex items-center justify-between text-xs font-pixel text-sakura-300 mb-3">
            <span className="flex items-center gap-1.5">
              <i className="fa-solid fa-compass text-retro-gold"></i> STATUS MEMANCING:
            </span>
            <span className="text-retro-gold capitalize">{fishingState}</span>
          </div>

          <p className="font-pixel text-[10px] text-sakura-200/90 mb-4 bg-retro-card p-2 border border-sakura-900">
            {statusText}
          </p>

          {/* Action buttons depending on state */}
          <div className="flex flex-wrap gap-3">
            {fishingState === 'idle' && (
              <button
                onClick={handleCast}
                className="w-full sm:w-auto px-6 py-3 font-pixel text-xs bg-sakura-500 hover:bg-sakura-600 text-white border-2 border-sakura-200 pixel-btn flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-water"></i> Lempar Kail Pancing
              </button>
            )}

            {fishingState === 'waiting' && (
              <button
                onClick={handleReset}
                className="px-4 py-2 font-pixel text-[10px] bg-retro-card text-sakura-400 border border-retro-border hover:bg-retro-border"
              >
                Tarik Kembali Kail
              </button>
            )}

            {fishingState === 'hooked' && (
              <button
                onClick={handleStrike}
                className="w-full py-4 font-pixel text-sm bg-red-600 hover:bg-red-500 text-white border-4 border-yellow-300 pixel-btn animate-pulse"
              >
                🎣 TARIK PANCING SEKARANG!
              </button>
            )}

            {fishingState === 'reeling' && (
              <div className="w-full space-y-3">
                <div className="flex justify-between font-pixel text-[10px] text-sakura-300">
                  <span>TEKAN BERULANG-ULANG:</span>
                  <span>{reelProgress}%</span>
                </div>
                <div className="w-full bg-retro-card h-4 border-2 border-retro-border overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500 to-green-500 transition-all duration-100"
                    style={{ width: `${reelProgress}%` }}
                  ></div>
                </div>
                <button
                  onClick={handleReelClick}
                  className="w-full py-3 font-pixel text-xs bg-yellow-600 hover:bg-yellow-500 text-white border-2 border-yellow-200 pixel-btn"
                >
                  🌀 GULUNG SENAR CEPAT! (+18%)
                </button>
              </div>
            )}

            {fishingState === 'caught' && (
              <div className="w-full p-4 bg-retro-card border-2 border-retro-gold pixel-border-gold flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{caughtFish?.icon}</span>
                  <div>
                    <div className="font-pixel text-xs text-white">{caughtFish?.name}</div>
                    <div className="font-pixel text-[9px] text-retro-gold mt-1">
                      Nilai Jual: {caughtFish?.price} 🪙 | Kelangkaan: {caughtFish?.rarity}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="px-6 py-2 font-pixel text-xs bg-sakura-500 hover:bg-sakura-600 text-white border-2 border-sakura-200 pixel-btn"
                >
                  Lanjut Memancing
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fish Caught Collection / Bestiary */}
      <div className="bg-retro-card border-4 border-sakura-800 p-4 pixel-border">
        <div className="flex items-center justify-between border-b border-retro-border pb-3 mb-3">
          <span className="font-pixel text-[10px] text-retro-gold flex items-center gap-2">
            <i className="fa-solid fa-fish"></i> KOLEKSI IKAN TELAGA JEMBATAN MERAH
          </span>
          <span className="font-pixel text-[9px] text-sakura-400/80">
            Dapat dijual di Pasar atau dipersembahkan di Altar
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {FISH_TYPES.map(fish => {
            const count = fishInventory[fish.id] || 0;
            return (
              <div
                key={fish.id}
                className="bg-retro-dark p-3 border-2 border-retro-border flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{fish.icon}</span>
                  <div>
                    <div className="font-pixel text-[9px] text-white truncate max-w-[130px]">
                      {fish.name.split('(')[0]}
                    </div>
                    <div className="font-pixel text-[8px] text-sakura-400 mt-0.5">
                      {fish.rarity} • {fish.price} 🪙
                    </div>
                  </div>
                </div>
                <span
                  className={`font-pixel text-[9px] px-2 py-1 border ${
                    count > 0
                      ? 'bg-sakura-950 text-retro-gold border-retro-gold/50'
                      : 'bg-retro-card text-sakura-400/40 border-retro-border'
                  }`}
                >
                  x{count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
