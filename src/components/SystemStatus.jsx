import React, { useState } from 'react';
import { sound } from '../utils/audio';

export default function SystemStatus({
  plots,
  coins,
  petals,
  day,
  timeOfDay,
  weather,
  isAudioOn,
  setIsAudioOn
}) {
  const [zenMessage, setZenMessage] = useState(null);

  const fortunes = [
    '🌸 "Kelopak sakura yang gugur adalah permulaan dari keindahan baru."',
    '🎋 "Bambu yang lentur tidak akan patah oleh angin kencang."',
    '🍵 "Secangkir teh hijau membawa ketenangan pada seribu pikiran."',
    '🎏 "Ikan koi berenang melawan arus hingga menjadi naga suci."',
    '🏮 "Cahaya lentera kecil cukup menerangi jalan setapak di tengah malam gelap."'
  ];

  const drawFortune = () => {
    sound.playChime();
    const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    setZenMessage(randomFortune);
  };

  const readyCount = plots.filter(p => p.state === 'ready').length;
  const growingCount = plots.filter(p => p.state === 'growing').length;
  const wateredCount = plots.filter(p => p.watered).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* System Status HUD Terminal */}
      <div className="bg-retro-dark p-6 border-4 border-sakura-700 pixel-border-gold space-y-4">
        <div className="flex items-center justify-between border-b border-retro-border pb-3">
          <div className="flex items-center gap-2">
            <span className="font-pixel text-xs text-retro-gold">STATUS SISTEM SUAKA</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-pixel text-emerald-400">ONLINE</span>
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-none animate-pulse"></span>
          </div>
        </div>

        <div className="font-pixel text-[10px] sm:text-[11px] text-sakura-300 space-y-2">
          <p className="flex justify-between">
            <span>&gt; SIKLUS HARI:</span>
            <span className="text-white">HARI KE-{day} ({timeOfDay.toUpperCase()})</span>
          </p>
          <p className="flex justify-between">
            <span>&gt; CUACA SUAKA:</span>
            <span className="text-sakura-200">SEJUK MUSIM SEMI (22°C)</span>
          </p>
          <p className="flex justify-between">
            <span>&gt; PETAK TANAH LEMBAB:</span>
            <span className="text-blue-300">{wateredCount} / {plots.length} PETAK</span>
          </p>
          <p className="flex justify-between">
            <span>&gt; TANAMAN TUMBUH / SIAP:</span>
            <span className="text-retro-gold">{growingCount} TUMBUH | {readyCount} SIAP PANEN</span>
          </p>
          <p className="flex justify-between">
            <span>&gt; KONDISI KELOPAK:</span>
            <span className="text-pink-300">DAMAI & TENTERAM (40 PETALS/S)</span>
          </p>
        </div>

        {zenMessage && (
          <div className="p-3 bg-retro-card border border-retro-gold text-xs font-sans text-retro-gold animate-fadeIn">
            {zenMessage}
          </div>
        )}

        <div className="pt-2">
          <button
            onClick={drawFortune}
            className="w-full font-pixel text-xs bg-sakura-500 hover:bg-sakura-600 text-white py-3 border-2 border-sakura-200 pixel-btn flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-scroll"></i> Ambil Ramalan Suci (Omikuji)
          </button>
        </div>
      </div>

      {/* Zen Audio Soundscape Panel */}
      <div className="bg-retro-card border-4 border-sakura-800 p-6 pixel-border flex flex-col justify-between items-center text-center space-y-4">
        <div className="space-y-2">
          <span className="font-pixel text-[9px] text-sakura-400 bg-sakura-950 px-2 py-0.5 border border-sakura-800">
            AUDIO ZEN SINTESIS
          </span>
          <h3 className="font-pixel text-sm text-white">Alunan Koto Tradisional & Angin Suci</h3>
          <p className="text-xs text-sakura-200 font-sans max-w-sm">
            Dihasilkan secara prosedural melalui Web Audio API untuk ketenangan relaksasi murni.
          </p>
        </div>

        <div className="w-16 h-16 bg-sakura-950 border-2 border-sakura-600 flex items-center justify-center text-sakura-400 text-2xl animate-bounce">
          <i className={`fa-solid ${isAudioOn ? 'fa-music' : 'fa-wind'}`}></i>
        </div>

        <div className="font-pixel text-[10px] text-sakura-200">
          Status Audio: {isAudioOn ? 'Aktif (Koto & Efek Zen)' : 'Nonaktif (Mute)'}
        </div>

        <button
          onClick={() => {
            const newState = sound.toggleSound();
            setIsAudioOn(newState);
          }}
          className="w-full font-pixel text-xs bg-sakura-500 hover:bg-sakura-600 text-white py-3 border-2 border-sakura-200 pixel-btn flex items-center justify-center gap-2"
        >
          <i className={`fa-solid ${isAudioOn ? 'fa-volume-xmark' : 'fa-volume-high'}`}></i>
          {isAudioOn ? 'Matikan Musik Zen' : 'Putar Musik Koto Zen'}
        </button>
      </div>
    </div>
  );
}
