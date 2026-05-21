// ── Animated Network Background (hero-bg style) ──
function createNetworkBg(canvasId, options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  canvas.style.pointerEvents = 'none';
  const ctx = canvas.getContext('2d');
  const color = options.color || '59,111,224';
  const dotCount = options.dots || 60;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const dots = Array.from({ length: dotCount }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    r: Math.random() * 3 + 1.5,
    pulse: Math.random() * Math.PI * 2,
  }));

  function draw() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move dots
    dots.forEach(d => {
      d.x += d.vx; d.y += d.vy; d.pulse += 0.03;
      if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
      if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
    });

    // Draw connections
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${color},${(1 - dist / 140) * 0.35})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw dots with pulse
    dots.forEach(d => {
      const pulse = Math.sin(d.pulse) * 0.4 + 0.6;
      // outer ring
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r * 2.5 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color},0.08)`;
      ctx.fill();
      // inner dot
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color},${0.5 * pulse})`;
      ctx.fill();
      // center bright
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color},0.9)`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
}

// ── Animated Geometric Background (for light pages) ──
function createGeometricBg(canvasId, options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  canvas.style.pointerEvents = 'none';
  const ctx = canvas.getContext('2d');

  function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);

  const lines = Array.from({ length: 8 }, (_, i) => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    angle: Math.random() * Math.PI * 2,
    speed: 0.002 + Math.random() * 0.003,
    length: 120 + Math.random() * 200,
  }));

  let t = 0;
  function draw() {
    canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    t += 0.005;

    lines.forEach((l, i) => {
      l.angle += l.speed;
      const cx = canvas.width * (0.15 + (i % 4) * 0.25);
      const cy = canvas.height * (i < 4 ? 0.3 : 0.7);
      const x2 = cx + Math.cos(l.angle) * l.length;
      const y2 = cy + Math.sin(l.angle) * l.length;
      const grad = ctx.createLinearGradient(cx, cy, x2, y2);
      grad.addColorStop(0, 'rgba(0,51,160,0.12)');
      grad.addColorStop(1, 'rgba(0,51,160,0)');
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // dot at center
      ctx.beginPath();
      ctx.arc(cx, cy, 3 + Math.sin(t + i) * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,51,160,0.15)';
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
}
