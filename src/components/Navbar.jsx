import React, { useState } from 'react';
import { sound } from '../utils/audio';

export default function Navbar({
  currentTab,
  setCurrentTab,
  coins,
  petals,
  day,
  timeOfDay,
  isAudioOn,
  setIsAudioOn,
  openQuestsModal,
  openGalleryModal,
  activeQuestsCount
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAudioToggle = () => {
    const newState = sound.toggleSound();
    setIsAudioOn(newState);
  };

  const navItems = [
    { id: 'farm', label: 'Kebun Kuil', icon: 'fa-solid fa-wheat-awn' },
    { id: 'pond', label: 'Jembatan & Kolam', icon: 'fa-solid fa-water' },
    { id: 'altar', label: 'Altar Suci', icon: 'fa-solid fa-torii-gate' },
    { id: 'market', label: 'Pasar Bibit', icon: 'fa-solid fa-store' },
  ];

  const getTimeBadge = () => {
    switch (timeOfDay) {
      case 'morning':
        return { label: 'PAGI', icon: 'fa-solid fa-cloud-sun', color: 'text-amber-300' };
      case 'noon':
        return { label: 'SIANG', icon: 'fa-solid fa-sun', color: 'text-yellow-400' };
      case 'dusk':
        return { label: 'SENJA', icon: 'fa-solid fa-cloud-sun-rain', color: 'text-orange-400' };
      case 'night':
        return { label: 'MALAM', icon: 'fa-solid fa-moon', color: 'text-indigo-300' };
      default:
        return { label: 'SIANG', icon: 'fa-solid fa-sun', color: 'text-yellow-400' };
    }
  };

  const timeBadge = getTimeBadge();

  return (
    <nav className="sticky top-0 z-50 bg-retro-dark/95 backdrop-blur-md border-b-4 border-sakura-800 px-3 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Logo */}
        <div 
          onClick={() => { setCurrentTab('farm'); sound.playTone(523, 'sine', 0.1); }}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 bg-sakura-500 border-2 border-sakura-200 flex items-center justify-center pixel-border text-white group-hover:scale-105 transition-transform">
            <i className="fa-solid fa-torii-gate text-sm"></i>
          </div>
          <div>
            <span className="font-pixel text-[11px] sm:text-xs text-sakura-200 tracking-wider group-hover:text-sakura-400 transition-colors">
              SAKURA.PIX
            </span>
            <span className="hidden sm:block text-[9px] text-sakura-400/80 font-pixel">FARM SANCTUARY</span>
          </div>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden lg:flex items-center gap-2 font-pixel text-[10px]">
          {navItems.map(item => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  sound.playTone(isActive ? 440 : 587, 'sine', 0.08);
                }}
                className={`px-3 py-2 border-2 transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-sakura-500 text-white border-sakura-200 pixel-border'
                    : 'bg-retro-card text-sakura-300 border-sakura-800 hover:border-sakura-400 hover:text-white'
                }`}
              >
                <i className={item.icon}></i>
                {item.label}
              </button>
            );
          })}
          
          {/* Gallery Button */}
          <button
            onClick={() => {
              openGalleryModal();
              sound.playChime();
            }}
            className="px-3 py-2 border-2 bg-retro-card text-sakura-300 border-sakura-800 hover:border-retro-gold hover:text-retro-gold transition-all flex items-center gap-1.5"
          >
            <i className="fa-solid fa-images"></i>
            Galeri
          </button>
        </div>

        {/* Stats HUD (Coins, Petals, Day) */}
        <div className="flex items-center gap-2 sm:gap-3 font-pixel text-[10px]">
          {/* Day & Time Cycle */}
          <div className="hidden sm:flex items-center gap-1.5 bg-retro-card px-2.5 py-1.5 border border-retro-border text-sakura-200">
            <i className={`${timeBadge.icon} ${timeBadge.color}`}></i>
            <span>HARI {day}</span>
            <span className="text-[8px] px-1 bg-sakura-950 text-sakura-400 border border-sakura-800">
              {timeBadge.label}
            </span>
          </div>

          {/* Coins */}
          <div className="flex items-center gap-1 bg-retro-card px-2 sm:px-2.5 py-1.5 border border-retro-gold/60 text-retro-gold pixel-border-sm">
            <span>🪙</span>
            <span className="font-pixel text-[10px] sm:text-xs">{coins}</span>
          </div>

          {/* Petals */}
          <div className="flex items-center gap-1 bg-retro-card px-2 sm:px-2.5 py-1.5 border border-sakura-500 text-sakura-300 pixel-border-sm">
            <span>🌸</span>
            <span className="font-pixel text-[10px] sm:text-xs">{petals}</span>
          </div>

          {/* Quest Icon */}
          <button
            onClick={() => {
              openQuestsModal();
              sound.playChime();
            }}
            title="Misi & Pencapaian Zen"
            className="relative bg-retro-card hover:bg-sakura-950 border border-sakura-600 text-retro-gold w-8 h-8 flex items-center justify-center pixel-btn"
          >
            <i className="fa-solid fa-scroll text-xs"></i>
            {activeQuestsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-sakura-500 text-white text-[8px] flex items-center justify-center border border-white animate-pulse">
                {activeQuestsCount}
              </span>
            )}
          </button>

          {/* Audio Zen Button */}
          <button
            onClick={handleAudioToggle}
            title={isAudioOn ? 'Matikan Audio Zen' : 'Nyalakan Audio Zen (Koto & Efek)'}
            className={`w-8 h-8 flex items-center justify-center border-2 pixel-btn ${
              isAudioOn
                ? 'bg-sakura-600 text-white border-sakura-200'
                : 'bg-retro-card text-sakura-400/60 border-retro-border'
            }`}
          >
            <i className={`fa-solid ${isAudioOn ? 'fa-volume-high' : 'fa-volume-xmark'} text-xs`}></i>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-sakura-300 text-base p-1.5 focus:outline-none"
          >
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden pt-3 pb-2 border-t border-retro-border mt-2 grid grid-cols-2 gap-2 font-pixel text-[10px]">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentTab(item.id);
                setMobileMenuOpen(false);
                sound.playTone(523, 'sine', 0.1);
              }}
              className={`p-2 border text-left flex items-center gap-2 ${
                currentTab === item.id
                  ? 'bg-sakura-500 text-white border-sakura-200'
                  : 'bg-retro-card text-sakura-300 border-sakura-800'
              }`}
            >
              <i className={item.icon}></i>
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              openGalleryModal();
              setMobileMenuOpen(false);
              sound.playChime();
            }}
            className="p-2 border bg-retro-card text-retro-gold border-retro-gold/50 flex items-center gap-2 col-span-2"
          >
            <i className="fa-solid fa-images"></i>
            Galeri Suaka Sakura
          </button>
        </div>
      )}
    </nav>
  );
}
