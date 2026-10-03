import React, { useEffect, useRef } from 'react';

export default function PetalCanvas({ weather = 'clear', intensity = 45 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    class Petal {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * canvas.width;
        this.y = initial ? Math.random() * canvas.height : -20;
        this.size = Math.floor(Math.random() * 5) + 4; // Pixelated square petal
        
        // Speed depends on weather
        const speedMultiplier = weather === 'storm' ? 2.5 : weather === 'windy' ? 1.8 : 1.0;
        this.speedY = (Math.random() * 1.4 + 0.8) * speedMultiplier;
        this.speedX = (Math.random() * 2 - 0.5) * speedMultiplier;
        
        this.rotation = Math.random() * 360;
        this.rotSpeed = (Math.random() * 2 - 1) * speedMultiplier;
        
        // Color variation in shades of sakura pink
        const colors = ['#fdf2f4', '#f7d1d9', '#f1abb9', '#e8758c', '#dc4a6b'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y * 0.015) * 0.8;
        this.rotation += this.rotSpeed;

        if (this.y > canvas.height + 25 || this.x > canvas.width + 30 || this.x < -30) {
          this.reset(false);
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        // Pixel block drawing
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
      }
    }

    const count = weather === 'storm' ? intensity * 2 : intensity;
    const petals = Array.from({ length: count }, () => new Petal());

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petals.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [weather, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-30"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
