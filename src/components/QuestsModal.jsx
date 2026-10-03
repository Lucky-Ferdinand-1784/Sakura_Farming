import React from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

export default function QuestsModal({
  isOpen,
  onClose,
  quests,
  setQuests,
  coins,
  setCoins,
  petals,
  setPetals
}) {
  if (!isOpen) return null;

  const claimReward = (quest) => {
    if (quest.completed || quest.current < quest.target) return;

    sound.playFishCaught();
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#f3c66a', '#e8758c', '#ffffff']
      });
    } catch (e) {}

    setCoins(prev => prev + quest.rewardCoins);
    setPetals(prev => prev + quest.rewardPetals);

    setQuests(prev =>
      prev.map(q => (q.id === quest.id ? { ...q, completed: true } : q))
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-retro-dark/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-retro-card border-4 border-sakura-600 p-6 max-w-lg w-full pixel-border space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b-2 border-retro-border pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📜</span>
            <h3 className="font-pixel text-sm text-retro-gold">MISI & PENCAPAIAN ZEN</h3>
          </div>
          <button
            onClick={onClose}
            className="text-sakura-400 hover:text-white font-pixel text-xs px-2 py-1 border border-retro-border"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-sakura-200 font-sans">
          Selesaikan tugas-tugas sakral ini untuk menghidupkan kembali keagungan Kuil Sakura dan dapatkan imbalan berlimpah.
        </p>

        <div className="space-y-3">
          {quests.map(quest => {
            const isReadyToClaim = !quest.completed && quest.current >= quest.target;
            return (
              <div
                key={quest.id}
                className={`p-3 border-2 transition-all ${
                  quest.completed
                    ? 'bg-retro-dark/50 border-green-900/60 opacity-70'
                    : isReadyToClaim
                    ? 'bg-sakura-950/80 border-retro-gold pixel-border-gold'
                    : 'bg-retro-dark border-retro-border'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-pixel text-xs text-white flex items-center gap-2">
                      {quest.title}
                      {quest.completed && (
                        <span className="text-emerald-400 text-xs">✓ SELESAI</span>
                      )}
                    </h4>
                    <p className="text-[11px] text-sakura-300/80 font-sans mt-1">
                      {quest.desc}
                    </p>
                  </div>
                  <div className="text-right font-pixel text-[9px] text-retro-gold whitespace-nowrap">
                    <div>+{quest.rewardCoins} 🪙</div>
                    <div className="text-sakura-300">+{quest.rewardPetals} 🌸</div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex-1 bg-retro-card h-2 border border-retro-border overflow-hidden">
                    <div
                      className="bg-sakura-500 h-full transition-all"
                      style={{
                        width: `${Math.min(100, (quest.current / quest.target) * 100)}%`
                      }}
                    ></div>
                  </div>
                  <span className="font-pixel text-[8px] text-sakura-400">
                    {Math.min(quest.target, quest.current)}/{quest.target}
                  </span>

                  {isReadyToClaim && (
                    <button
                      onClick={() => claimReward(quest)}
                      className="px-3 py-1 font-pixel text-[9px] bg-retro-gold hover:bg-yellow-400 text-retro-dark border border-yellow-200 pixel-btn"
                    >
                      KLAIM HADIAH!
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="w-full font-pixel text-xs bg-sakura-500 hover:bg-sakura-600 text-white py-2.5 border-2 border-sakura-200 pixel-btn"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
