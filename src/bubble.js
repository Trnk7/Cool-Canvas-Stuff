
(function() {
  const canvas = document.getElementById('bubble-canvas');
  if (!canvas) return;
  const context = canvas.getContext('2d');

  // Particle grid effect
  let particles = [];
  let gridsize = 30;
  let offsetX = 15;
  let offsetY = 15;
  function resizeParticles() {
    let disp = document.getElementsByClassName('disp')[0].getBoundingClientRect()
    canvas.width = disp.width;
    canvas.height = disp.height;
    let gridx = Math.floor(canvas.width / gridsize);
    let gridy = Math.floor(canvas.height / gridsize);
    offsetX = 15 + (canvas.width % gridsize) / 2;
    offsetY = 15 + (canvas.height % gridsize) / 2;
    particles = [];
    for (let i = 0; i < gridx; i++) {
      particles[i] = [];
      for (let j = 0; j < gridy; j++) {
        particles[i].push({
          x: offsetX + i * gridsize,
          y: offsetY + j * gridsize,
          bx: offsetX + i * gridsize,
          by: offsetY + j * gridsize,
          radius: gridsize / 2,
          clr: (offsetY + j * gridsize),
          neighbours: []
        });
      }
    }
  }
  
  resizeParticles();
  window.addEventListener('resize', resizeParticles);

  function findNeighbours(p, i, j) {
    p.neighbours = [];
    for (let ii = 0; ii < particles.length; ii++) {
      for (let jj = 0; jj < particles[ii].length; jj++) {
        let dx = p.x - particles[ii][jj].x;
        let dy = p.y - particles[ii][jj].y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= gridsize * Math.sqrt(3)) {
          p.neighbours.push(particles[ii][jj]);
        }
      }
    }
  }

  function updateParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = 0; j < particles[i].length; j++) {
        let p = particles[i][j];
        findNeighbours(p, i, j);
        for (let n = 0; n < p.neighbours.length; n++) {
          let dclr = p.neighbours[n].clr - p.clr;
          if (dclr > 4) {
            p.clr += dclr / 10;
          }
        }
      }
    }
  }

  function drawParticles() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
      for (let j = 0; j < particles[i].length; j++) {
        let p = particles[i][j];
        context.beginPath();
        context.fillStyle = `hsl(${p.clr},100%,50%)`;
        context.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        context.fill();
      }
    }
  }

  let call = 0;
    canvas.addEventListener('mousemove', function(e) {
      call++;
      let rect = canvas.getBoundingClientRect();
      let i = Math.floor((e.clientX - rect.left) / gridsize);
      let j = Math.floor((e.clientY - rect.top) / gridsize);
      if (particles[i] && particles[i][j] && call % 5 === 0) {
        particles[i][j].clr += 10;
      }
    });

    // Touch support
    canvas.addEventListener('touchmove', function(e) {
      call++;
      let rect = canvas.getBoundingClientRect();
      let touch = e.touches[0];
      let i = Math.floor((touch.clientX - rect.left) / gridsize);
      let j = Math.floor((touch.clientY - rect.top) / gridsize);
      if (particles[i] && particles[i][j] && call % 5 === 0) {
        particles[i][j].clr += 10;
      }
      e.preventDefault();
    }, { passive: false });

  function anim() {
    updateParticles();
    drawParticles();
    requestAnimationFrame(anim);
  }
  anim();

})();

