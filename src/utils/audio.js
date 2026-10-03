// Web Audio API Synthesizer for 8-bit retro sound effects and peaceful Zen Koto melodies

class SoundController {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.musicTimer = null;
    this.currentScale = [
      261.63, // C4
      277.18, // C#4
      349.23, // F4
      392.00, // G4
      415.30, // G#4
      523.25, // C5
      554.37, // C#5
      698.46, // F5
      783.99, // G5
      830.61  // G#5
    ]; // Japanese Insen / Sakura Pentatonic Scale
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound(forceState) {
    this.init();
    if (forceState !== undefined) {
      this.isMuted = !forceState;
    } else {
      this.isMuted = !this.isMuted;
    }

    if (this.isMuted) {
      this.stopZenMusic();
    } else {
      this.startZenMusic();
      this.playChime();
    }
    return !this.isMuted;
  }

  // Play a single 8-bit tone
  playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1) {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio playback note error", e);
    }
  }

  // SFX: Tilling soil with Hoe
  playDig() {
    if (this.isMuted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {}
  }

  // SFX: Watering soil with bamboo can
  playWater() {
    if (this.isMuted) return;
    this.init();
    try {
      const bufferSize = this.ctx.sampleRate * 0.18;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(1400, this.ctx.currentTime + 0.18);
      filter.Q.value = 3;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch (e) {}
  }

  // SFX: Planting seed
  playPlant() {
    if (this.isMuted) return;
    this.init();
    this.playTone(330, 'sine', 0.08, 0.12);
    setTimeout(() => this.playTone(440, 'sine', 0.1, 0.12), 60);
  }

  // SFX: Harvesting a ripe crop
  playHarvest() {
    if (this.isMuted) return;
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.18, 0.15);
      }, idx * 60);
    });
  }

  // SFX: Selling / Zen Coin earned
  playCoins() {
    if (this.isMuted) return;
    this.init();
    this.playTone(987.77, 'square', 0.08, 0.06); // B5
    setTimeout(() => {
      this.playTone(1318.51, 'square', 0.2, 0.07); // E6
    }, 70);
  }

  // SFX: Gentle chime
  playChime() {
    if (this.isMuted) return;
    this.init();
    this.playTone(698.46, 'sine', 0.4, 0.1);
    setTimeout(() => this.playTone(830.61, 'sine', 0.5, 0.1), 100);
  }

  // SFX: Fish bite splash
  playFishBite() {
    if (this.isMuted) return;
    this.init();
    this.playTone(880, 'sine', 0.08, 0.2);
    setTimeout(() => this.playTone(1174.66, 'sine', 0.15, 0.2), 90);
  }

  // SFX: Fish caught fanfare
  playFishCaught() {
    if (this.isMuted) return;
    this.init();
    const melody = [440, 554.37, 659.25, 880];
    melody.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.2, 0.12);
      }, i * 80);
    });
  }

  // SFX: Blessing received
  playBlessing() {
    if (this.isMuted) return;
    this.init();
    const chords = [392, 523.25, 659.25, 783.99, 1046.50];
    chords.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.6, 0.08);
      }, i * 90);
    });
  }

  // Ambient Zen Koto Plucks
  startZenMusic() {
    if (this.musicTimer) clearInterval(this.musicTimer);

    const playNextKotoNote = () => {
      if (this.isMuted || !this.ctx) return;
      const note = this.currentScale[Math.floor(Math.random() * this.currentScale.length)];
      
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Koto pluck characteristics: fast attack, gentle decay
        osc.type = Math.random() > 0.4 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(note, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 1.6);

        // Chance for a gentle harmony pair
        if (Math.random() > 0.65) {
          const secondNote = this.currentScale[(this.currentScale.indexOf(note) + 2) % this.currentScale.length];
          const osc2 = this.ctx.createOscillator();
          const gain2 = this.ctx.createGain();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(secondNote, this.ctx.currentTime + 0.12);
          gain2.gain.setValueAtTime(0.03, this.ctx.currentTime + 0.12);
          gain2.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.5);
          osc2.connect(gain2);
          gain2.connect(this.ctx.destination);
          osc2.start(this.ctx.currentTime + 0.12);
          osc2.stop(this.ctx.currentTime + 1.6);
        }
      } catch (e) {}

      // Schedule next random pluck
      const delay = Math.random() * 2200 + 1600;
      this.musicTimer = setTimeout(playNextKotoNote, delay);
    };

    this.musicTimer = setTimeout(playNextKotoNote, 800);
  }

  stopZenMusic() {
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }
}

export const sound = new SoundController();
