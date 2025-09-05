// SPLASH EFFECT
(function() {
  const cnv = document.getElementById('splash-canvas');
  if (!cnv) return;
  const ctx = cnv.getContext('2d');

  function resize() {
    cnv.width = cnv.offsetWidth;
    cnv.height = cnv.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  let particles = [];
  class Particle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.size = Math.min(Math.floor(Math.random() * 5 + 10) * (cnv.width / 900), 10);
      this.color = color;
      this.vx = (Math.random() - 0.5) * 15;
      this.vy = (Math.random() - 0.5) * 15;
      this.r = (Math.random() - 0.5) * Math.PI;
      this.g = 0.2;
      this.a = 1;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.a;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.r);
      ctx.beginPath();
      ctx.fillStyle = this.color;
      for (let i = 0; i < Math.floor(Math.random() * 5) + 3; i++) {
        let a = (i / 5) * Math.PI * 2;
        let x = this.size + Math.cos(a) * this.size;
        let y = this.size + Math.sin(a) * this.size;
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    upd() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.g;
      this.a -= 0.06;
      this.r += 0.35;
      this.size -= 0.8;
      if (this.size <= 0) this.size = 0;
    }
  }

  function splash(x, y) {
    let color = `hsl(${Math.random() * 360},100%,50%)`;
    for (let i = 0; i < 100; i++) {
      particles.push(new Particle(x, y, color));
    }
  }

  cnv.addEventListener('mousedown', e => {
    const rect = cnv.getBoundingClientRect();
    splash(e.clientX - rect.left, e.clientY - rect.top);
  });
  cnv.addEventListener('mouseleave', () => {
    ctx.clearRect(0, 0, cnv.width, cnv.height);
  });

  function anim() {
    // ctx.clearRect(0, 0, cnv.width, cnv.height);
    particles.forEach((p, i) => {
      if (p.a <= 0) {
        particles.splice(i, 1);
      } else {
        p.draw();
        p.upd();
      }
    });
    requestAnimationFrame(anim);
  }
  anim();
})();
