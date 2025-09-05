
(function() {
  const cnv = document.getElementById('trail-canvas');
  if (!cnv) return;
  const ctx = cnv.getContext('2d');

  function resize() {
    cnv.width = cnv.offsetWidth;
    cnv.height = cnv.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.theta = Math.random() * Math.PI * 2;
      this.r = 3;
      this.dr = 0.05;
      this.clr = `hsl(${Math.random() * 360},100%,50%)`;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 0.1;
      ctx.strokeStyle = this.clr;
      ctx.stroke();
    }
    upd() {
      this.x += Math.cos(this.theta);
      this.y += Math.sin(this.theta);
      if (this.r > this.dr) {
        this.r -= this.dr;
      } else {
        this.r = 0;
      }
    }
  }

  let part = [];
  cnv.addEventListener('mousemove', e => {
    for (let i = 0; i < 20; i++) {
      part.push(new Particle(e.offsetX, e.offsetY));
    }
  });
  // Touch support
  cnv.addEventListener('touchmove', e => {
    const touch = e.touches[0];
    const rect = cnv.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    for (let i = 0; i < 20; i++) {
      part.push(new Particle(x, y));
    }
    e.preventDefault();
  }, { passive: false });
  cnv.addEventListener('mouseleave', () => {
    part = [];
    ctx.clearRect(0, 0, cnv.width, cnv.height);
  });
  cnv.addEventListener('touchend', () => {
    part = [];
    ctx.clearRect(0, 0, cnv.width, cnv.height);
  });

  function anim() {
    part = part.filter(p => p.r > 0.025);
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    part.forEach(p => {
      p.draw();
      p.upd();
    });
    if (part.length > 200) {
      part.splice(0, parseInt(part.length / 200));
    }
    requestAnimationFrame(anim);
  }
  anim();
})();
