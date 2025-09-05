// TORCH EFFECT
(function() {
  const cnv = document.getElementById('torch-canvas');
  if (!cnv) return;
  const ctx = cnv.getContext('2d');

  function resize() {
    cnv.width = cnv.offsetWidth;
    cnv.height = cnv.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Letters grid
  const ch = [
    "Q","W","E","R","T","T","T","Y","U","I","O","P",
    "A","S","D","F","G","H","J","K","L","Z","X","C",
    "V","B","N","M"
  ];
  let img;
  function drawLetters() {
    ctx.clearRect(0,0,cnv.width,cnv.height);
    ctx.font = "10px arial";
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 10; j++) {
        let s = ch[Math.floor(Math.random() * ch.length)];
        ctx.fillStyle = s === "T" ? "red" : "black";
        ctx.fillText(s, i * 10, j * 10, 100);
      }
    }
    img = ctx.getImageData(0, 0, 150, 150);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 150, 150);
  }
  drawLetters();

  // Torch effect
  let m = { x: NaN, y: NaN };
  cnv.addEventListener('mousemove', e => {
    const rect = cnv.getBoundingClientRect();
    m.x = e.clientX - rect.left;
    m.y = e.clientY - rect.top;
  });
  cnv.addEventListener('mouseleave', () => {
    m.x = NaN; m.y = NaN;
  });
  let rad = cnv.width / 10;
  class Part {
    constructor(x, y, clr) {
      this.x = x;
      this.y = y;
      this.clr = clr;
      this.f = "black";
      this.bx = this.x;
      this.by = this.y;
    }
    draw() {
      ctx.fillStyle = this.f;
      ctx.fillRect(this.x, this.y, 2.5, 2.5);
    }
    upd() {
      let d = Math.sqrt((this.x - m.x) ** 2 + (this.y - m.y) ** 2);
      if (d < rad) {
        this.f = this.clr;
      } else {
        this.f = "black";
      }
      if (this.clr == "red") {
        if (d < 50) {
          this.x += (this.x - m.x) / d;
          this.y += (this.y - m.y) / d;
        }
        if (this.x !== this.bx || this.y !== this.by) {
          this.x += (this.bx - this.x) * 0.08;
          this.y += (this.by - this.y) * 0.08;
        }
      }
    }
  }
  // Build points from image
  let poi = [];
  let c = 3;
  for (let i = 0; i < img.width; i++) {
    for (let j = 0; j < img.height; j++) {
      let r = img.data[c - 3];
      let a = img.data[c];
      let clr = r === 0 ? "lime" : "red";
      if (a !== 0) {
        poi.push(new Part(j * 5, i * 5, clr));
      }
      c += 4;
    }
  }
  function anim() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    poi.forEach(a => {
      a.draw();
      a.upd();
    });
    requestAnimationFrame(anim);
  }
  anim();
})();
