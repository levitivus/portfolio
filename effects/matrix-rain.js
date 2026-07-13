/* ── effects/matrix-rain.js ── */
(function() {
  let canvas = null;
  let ctx = null;
  let animationId = null;
  let columns = [];
  const fontSize = 16; // Increased character size slightly

  function initRain() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      stopRain();
      return;
    }
    
    if (canvas) return;

    canvas = document.createElement('canvas');
    canvas.id = 'matrix-rain-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '-2';
    canvas.style.pointerEvents = 'none';
    canvas.style.opacity = '0.10'; // Set global opacity inside 8-12% target
    document.body.appendChild(canvas);

    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    animationId = requestAnimationFrame(draw);
  }

  function stopRain() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    if (canvas) {
      window.removeEventListener('resize', resizeCanvas);
      canvas.remove();
      canvas = null;
      ctx = null;
    }
  }

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const cols = Math.floor(canvas.width / fontSize) + 1;
    columns = [];
    for (let i = 0; i < cols; i++) {
      columns.push({
        y: Math.random() * -100,
        speed: 0.7 + Math.random() * 1.5,
        opacity: 0.15 + Math.random() * 0.85 // Dynamic brightness variation
      });
    }
  }

  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ日ハミヒーウシナモエヌアン';

  function draw() {
    if (!ctx || !canvas) return;
    
    ctx.fillStyle = 'rgba(2, 4, 2, 0.11)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = col.y * fontSize;

      // Volumetric effect: draw streams with varying alpha
      ctx.fillStyle = `rgba(0, 255, 65, ${col.opacity})`;
      ctx.fillText(char, x, y);

      if (y > canvas.height && Math.random() > 0.98) {
        col.y = 0;
        col.speed = 0.7 + Math.random() * 1.5;
        col.opacity = 0.15 + Math.random() * 0.85;
      } else {
        col.y += col.speed;
      }
    }

    animationId = requestAnimationFrame(draw);
  }

  window.MatrixRain = {
    start: initRain,
    stop: stopRain
  };
})();
