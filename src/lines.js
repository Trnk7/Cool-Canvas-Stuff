// LINES EFFECT
(function() {
  const cnv = document.getElementById('lines-canvas');
  if (!cnv) return;
  const ctx = cnv.getContext('2d');
  let spc = 10;
  let lines = [];
  function size() {
    cnv.width = cnv.offsetWidth;
    cnv.height = cnv.offsetHeight;
    lines = [];
    for (let i = 0; i <=cnv.width; i += spc) {
      for (let j = 0; j <=cnv.height; j += spc) {
        lines.push({x: i, y: j, len: spc, angle: Math.sin((i+j)*2/Math.PI), clr: Math.random()*360});
      }
    }
  }
  size();
  window.addEventListener('resize', size);
  cnv.addEventListener('mousemove', e => {
    lines.forEach(l => {
      let dx = e.offsetX - l.x;
      let dy = e.offsetY - l.y;
      l.angle = Math.atan2(dy, dx);
    });
  });
  // Touch support
  cnv.addEventListener('touchmove', e => {
    const touch = e.touches[0];
    const rect = cnv.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    lines.forEach(l => {
      let dx = x - l.x;
      let dy = y - l.y;
      l.angle = Math.atan2(dy, dx);
    });
    // e.preventDefault();
  }, { passive: false });
  cnv.addEventListener('mouseleave', () => {
    lines.forEach(l => {
      l.angle = Math.sin((l.x + l.y) * 2 / Math.PI);
    });
  });
  cnv.addEventListener('touchend', () => {
    lines.forEach(l => {
      l.angle = Math.sin((l.x + l.y) * 2 / Math.PI);
    });
  });
  function anim() {
    ctx.clearRect(0,0,cnv.width,cnv.height);
    lines.forEach(l => {
      ctx.beginPath();
      ctx.moveTo(l.x, l.y);
      ctx.lineTo(l.x + Math.cos(l.angle)*l.len, l.y + Math.sin(l.angle)*l.len);
      ctx.strokeStyle = `hsl(${l.clr}, 100%, 50%)`;
      ctx.stroke();
      l.angle += 0.1;
      l.clr = l.angle*55;
    });
    requestAnimationFrame(anim);
  }
  anim();
})();
