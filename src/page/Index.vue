<template lang="pug">
  .field-main
    canvas#renderer
    .field-overlap
      .group-overlay
        .inner-overlay
          .name H.HYUNWOO
          .desc.
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took
            a galley of type and scrambled it to make a type specimen book.
            It has survived not only five centuries, but also
            the leap into electronic typesetting, remaining essentially unchanged.
            It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
</template>

<script>


const canvasFirework = function () {
  window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      };
  })();
  const canvas = document.getElementById('renderer');
  const ctx = canvas.getContext('2d');
  // full screen dimensions
  const cw = window.innerWidth;
  const ch = window.innerHeight;
  // firework collection
  const fireworks = [];
  // particle collection
  const particles = [];
  // starting hue
  let hue = 120;
  const timerTotal = 80;
  const limiterTotal = 5;
  let limiterTick = 0;
  let timerTick = 0;
  let mousedown = false;
  let mx;
  let my;
  const domRenderer = document.getElementById('renderer');
  canvas.width = domRenderer.offsetWidth;
  canvas.height = domRenderer.offsetHeight;

  function random(min, max) {
    return (Math.random() * (max - min)) + min;
  }

  function calculateDistance(p1x, p1y, p2x, p2y) {
    const xDistance = p1x - p2x;
    const yDistance = p1y - p2y;
    return Math.sqrt((xDistance ** 2) + (yDistance ** 2));
  }

  function Firework(sx, sy, tx, ty) {
    this.x = sx;
    this.y = sy;
    this.sx = sx;
    this.sy = sy;
    this.tx = tx;
    this.ty = ty;
    this.distanceToTarget = calculateDistance(sx, sy, tx, ty);
    this.distanceTraveled = 0;
    this.coordinates = [];
    this.coordinateCount = 3;
    while (this.coordinateCount--) {
      this.coordinates.push([this.x, this.y]);
    }
    this.angle = Math.atan2(ty - sy, tx - sx);
    this.speed = 2;
    this.acceleration = 1.05;
    this.brightness = random(50, 70);
    // circle target indicator radius
    this.targetRadius = 1;
  }

  Firework.prototype.update = function (index) {
    // remove last item in coordinates array
    this.coordinates.pop();
    // add current coordinates to the start of the array
    this.coordinates.unshift([this.x, this.y]);

    // cycle the circle target indicator radius
    if (this.targetRadius < 8) {
      this.targetRadius += 0.15;
    } else {
      this.targetRadius = 1;
    }

    // speed up the firework
    this.speed *= this.acceleration;

    // get the current velocities based on angle and speed
    var vx = Math.cos(this.angle) * this.speed,
      vy = Math.sin(this.angle) * this.speed;
    // how far will the firework have traveled with velocities applied?
    this.distanceTraveled = calculateDistance(this.sx, this.sy, this.x + vx, this.y + vy);

    if (this.distanceTraveled >= this.distanceToTarget) {
      createParticles(this.tx, this.ty);
      fireworks.splice(index, 1);
    } else {
      // target not reached, keep traveling
      this.x += vx;
      this.y += vy;
    }
  }

  Firework.prototype.draw = function () {
    ctx.beginPath();
    // move to the last tracked coordinate in the set, then draw a line to the current x and y
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = `hsl(${hue}, 50%, ${this.brightness * 0.5}%)`;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
    ctx.strokeStyle = `hsl(${hue}, 50%, ${this.brightness * 0.5}%)`;
    ctx.lineWidth = 8;
    ctx.stroke();
  };

  function Particle(x, y, inner) {
    if (inner === undefined) {
      inner = true;
    }
    let vel = 8;
    if (inner) {
      vel = 3;
    }
    this.x = x;
    this.y = y;
    this.vx = (Math.random() * vel) - (vel / 2);
    this.vy = (Math.random() * vel) - (vel / 2);
    this.coordinates = [];
    this.coordinateCount = 5;
    while (this.coordinateCount--) {
      this.coordinates.push([this.x, this.y]);
    }
    // set a random angle in all possible directions, in radians
    this.angle = random(0, Math.PI * 2);
    this.speed = random(1, 10);
    // friction will slow the particle down
    this.friction = 0.95;
    // gravity will be applied and pull the particle down
    this.gravity = 1;
    // set the hue to a random number +-20 of the overall hue variable
    this.hue = random(hue - 30, hue + 30);
    this.brightness = random(50, 80);
    this.alpha = 1;
    // set how fast the particle fades out
    this.decay = random(0.015, 0.03);
    this.lineWidth = (Math.random() * 40) + 60;
  }

  Particle.prototype.update = function (index) {
    // remove last item in coordinates array
    this.coordinates.pop();
    // add current coordinates to the start of the array
    this.coordinates.unshift([this.x, this.y]);
    // slow down the particle
    this.speed *= this.friction;
    // apply velocity
    this.x += this.vx;
    this.y += this.vy;
    this.vx += (Math.random() * 0.8) - 0.4;
    this.vy += (Math.random() * 0.8) - 0.4;
    // fade out the particle
    this.alpha -= this.decay;

    // remove the particle once the alpha is low enough, based on the passed in index
    if (this.alpha <= this.decay) {
      particles.splice(index, 1);
    }
  };

  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0],
      this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = `hsla(${this.hue},30%,40%,1)`;
    ctx.lineWidth = this.lineWidth * (0.25 - ((this.alpha - 0.5) ** 2));
    // ctx.lineWidth = this.alpha * 40;
    ctx.stroke();

  };

  function createParticles(x, y) {
    for (let i = 0; i < 15; i += 1) {
      particles.push(new Particle(x, y, false));
    }
    setTimeout(() => {
      for (let i = 0; i < 15; i += 1) {
        particles.push(new Particle(x, y, true));
      }
    }, 300);

  }

  function loop() {
    // this function will run endlessly with requestAnimationFrame
    window.requestAnimFrame(loop);
    hue += 0.2;
    // ctx.globalCompositeOperation = 'destination-out';
    // decrease the alpha property to create more prominent trails
    // ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    // ctx.fillRect(0, 0, cw, ch);
    // change the composite operation back to our main mode
    // lighter creates bright highlight points as the fireworks and particles overlap each other
    // ctx.globalCompositeOperation = 'lighter';

    // loop over each firework, draw it, update it
    var i = fireworks.length;
    while (i--) {
      fireworks[i].draw();
      fireworks[i].update(i);
    }

    // loop over each particle, draw it, update it
    var i = particles.length;
    while (i--) {
      particles[i].draw();
      particles[i].update(i);
    }

    if (timerTick >= timerTotal) {

      if (!mousedown) {
        const angle = Math.random() * Math.PI * 2;
        const x = (Math.cos(angle) * 2000) + 500;
        const y = (Math.sin(angle) * 2000) + 500;
        fireworks.push(new Firework(x, y, random(0, cw), random(0, ch)));
        timerTick = 0;
      }
    } else {
      timerTick++;
    }

    if (limiterTick >= limiterTotal) {
      if (mousedown) {
        const angle = Math.random() * Math.PI * 2;
        const x = (Math.cos(angle) * 2000) + 500;
        const y = (Math.sin(angle) * 2000) + 500;
        fireworks.push(new Firework(x, y, mx, my));
        limiterTick = 0;
      }
    } else {
      limiterTick++;
    }
  }

  canvas.addEventListener('mousemove', (e) => {
    mx = e.pageX - canvas.offsetLeft;
    my = e.pageY - canvas.offsetTop;
  });

  canvas.addEventListener('mousedown', (e) => {
    e.preventDefault();
    mousedown = true;
  });

  canvas.addEventListener('mouseup', (e) => {
    e.preventDefault();
    mousedown = false;
  });
  window.onload = loop;
};

export default {
  name: 'HelloWorld',
  data() {
    return {};
  },
  methods: {},
  mounted() {
    canvasFirework();
  },
};
</script>

<style scoped lang="sass">
.field-main
  position: absolute
  top: 0
  width: 100%
  height: 100vh

  .field-overlap
    position: absolute
    z-index: 1
    top: 0
    left: 0
    width: 100%
    height: 100%
    pointer-events: none
    display: flex
    align-items: center
    justify-content: center
    .group-overlay
      background: rgba(255, 255, 255, 0.4)
      padding: 24px
      .inner-overlay
        background: rgba(255, 255, 255, 0.6)
        padding: 32px
        border: solid 20px rgba(0, 0, 0, 0.5)
        .name
          font-size: 92px
          color: rgba(0, 0, 0, 0.55)
          letter-spacing: 0.07em
          font-weight: 700
          border-bottom: solid 2px rgba(0, 0, 0, 0.45)
        .desc
          padding: 12px 0
          max-width: 640px
          text-align: justify
          color: rgba(0, 0, 0, 0.75)

body
  background: #333

canvas
  background: #fff
  width: 100%
  height: 100%

body
</style>
