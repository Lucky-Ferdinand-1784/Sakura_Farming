import React, { useState } from 'react';
import { GALLERY_ARTWORKS } from '../utils/gameData';
import { sound } from '../utils/audio';

export default function GalleryModal({ isOpen, onClose }) {
  const [filter, setFilter] = useState('ALL');
  const [selectedArt, setSelectedArt] = useState(null);

  if (!isOpen) return null;

  const filtered = filter === 'ALL'
    ? GALLERY_ARTWORKS
    : GALLERY_ARTWORKS.filter(a => a.category === filter);

  return (
    <div className="fixed inset-0 z-50 bg-retro-dark/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-retro-card border-4 border-sakura-600 p-6 max-w-4xl w-full pixel-border space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b-2 border-retro-border pb-3">
          <div>
            <span className="font-pixel text-[9px] text-sakura-400 bg-sakura-950 px-2 py-0.5 border border-sakura-800">
              GALERI VISUAL KUIL
            </span>
            <h3 className="font-pixel text-sm text-white mt-1">Pemandangan Suaka Sakura Klasik</h3>
          </div>
          <button
            onClick={onClose}
            className="text-sakura-400 hover:text-white font-pixel text-xs px-2.5 py-1 border border-retro-border"
          >
            ✕
          </button>
        </div>

        {/* Filter categories */}
        <div className="flex flex-wrap gap-2 font-pixel text-[9px]">
          {['ALL', 'KUIL', 'JEMBATAN', 'ALAM', 'TORII'].map(cat => (
            <button
              key={cat}
              onClick={() => {
                setFilter(cat);
                sound.playTone(550, 'sine', 0.05);
              }}
              className={`px-3 py-1.5 border-2 pixel-btn ${
                filter === cat
                  ? 'bg-sakura-500 text-white border-sakura-200 pixel-border-sm'
                  : 'bg-retro-dark text-sakura-300 border-sakura-800 hover:border-sakura-400'
              }`}
            >
              {cat === 'ALL' ? 'Semua' : cat}
            </button>
          ))}
        </div>

        {/* Gallery Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(art => (
            <div
              key={art.id}
              className="bg-retro-dark border-2 border-retro-border p-3 pixel-border flex flex-col justify-between group hover:border-sakura-500 transition-colors"
            >
              <div>
                <div className="aspect-video bg-retro-card border border-retro-border overflow-hidden mb-3 relative">
                  <img
                    src={art.img}
                    alt={art.title}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=600&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter contrast-110 saturate-125"
                  />
                  <div className="absolute top-2 right-2 bg-retro-dark/80 px-2 py-0.5 font-pixel text-[8px] text-retro-gold border border-retro-gold/40">
                    {art.category}
                  </div>
                </div>
                <h4 className="font-pixel text-xs text-sakura-200 mb-1">{art.title}</h4>
                <p className="text-xs text-sakura-300/80 font-sans leading-relaxed">{art.desc}</p>
              </div>

              <div className="pt-3 mt-3 border-t border-retro-border flex items-center justify-between">
                <span className="font-pixel text-[8px] text-sakura-400">STATUS: TERBUKA</span>
                <button
                  onClick={() => setSelectedArt(art)}
                  className="font-pixel text-[9px] bg-sakura-600 hover:bg-sakura-500 text-white px-3 py-1 border border-sakura-300 pixel-btn"
                >
                  Lihat Detail
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Selected artwork modal detail if clicked */}
        {selectedArt && (
          <div className="p-4 bg-retro-dark border-2 border-retro-gold pixel-border-gold space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-pixel text-xs text-retro-gold">{selectedArt.title}</span>
              <button
                onClick={() => setSelectedArt(null)}
                className="text-sakura-400 font-pixel text-[9px]"
              >
                ✕ Tutup
              </button>
            </div>
            <p className="text-xs text-sakura-200 font-sans leading-relaxed">
              {selectedArt.desc}
            </p>
          </div>
        )}

        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="w-full font-pixel text-xs bg-sakura-500 hover:bg-sakura-600 text-white py-2.5 border-2 border-sakura-200 pixel-btn"
          >
            Tutup Galeri
          </button>
        </div>
      </div>
    </div>
  );
}
