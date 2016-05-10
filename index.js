const height = window.clientWidth * window.devicePixelRatio;
const width = window.clientHeight * window.devicePixelRatio;

const canvas = document.getElementById("canvas");
// Look up const if you need.
// document = global document of the page
// .getElementById gets the element by ID
canvas.width = width;
canvas.height = height;

const ctx = canvas.getContext("2d");

function clear() {
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, width, height);
}

function getRandomColor() {
    const r = Math.round(Math.random() * 255)
    const g = Math.round(Math.random() * 255)
    const b = Math.round(Math.random() * 255)

    return [r, g, b];
}

let world = [];

class Circle {
    constructor(x, y, color, radius, now, lifetime) {
        this.path = new Path2D;
        this.path.arc(x, y, radius, 0, Math.PI*2, true);
        this.color = color;
        this.createdAt = now;
        // we need `now` because we're going to use it for calculating
        // lifetime.
        this.lifetime = lifetime;
    }

    draw(now) {
        const a = 1 - ((now - this.createdAt) / this.lifetime);
        ctx.fillStyle = "rgba(" + this.color[0] + "," +
            this.color[1] + "," +
            this.color[2] + "," +
            a + ")";
        ctx.fill(this.path);
        return this.createdAt + this.lifetime > now;
        // returns true if the object should be still alive.
    }
}

let mouseDownAt = null;

function start() {
  mouseDownAt = performance.now();
}
canvas.addEventListener("mousedown", start);
canvas.addEventListener("touchstart", start);

function end() {
  mouseDownAt = null;
}
canvas.addEventListener("mouseup", end);
canvas.addEventListener("touchend", end);

canvas.addEventListener("mousemove", function(event) {
    if (mouseDownAt != null) {
        const now = performance.now();
        const radius = (now - mouseDownAt) / 100;
        world.push(
            new Circle(event.pageX, event.pageY, getRandomColor(), radius, now, 500)
        );
    }
});

canvas.addEventListener("touchmove", function(event) {
  const touches = Array.from(event.changedTouches);
  const now = performance.now();
  const radius = (now - mouseDownAt) / 100;
  for (var i = 0; i < touches.length; i++) {
    world.push(
      new Circle(touches[i].pageX * window.devicePixelRatio,
                 touches[i].pageY * window.devicePixelRatio,
                 getRandomColor(),
                 radius,
                 now,
                 500)
    );
  }
});

world.push(
    new Circle(100, 100, "rgb(150,150,0)", 50, performance.now(), 2000),
    new Circle(300, 300, "rgb(250,250,130)", 50, performance.now(), 3000),
    new Circle(500, 500, "rgb(10,240,50)", 50, performance.now(), 6000),
    new Circle(500, 600, "rgb(120,220,34)", 50, performance.now(), 5000)
)

// Recursive loop that called before each frame is painted.
function drawLoop(now) {
    clear();
    world = world.filter(thing => thing.draw(now));
    requestAnimationFrame(drawLoop);
}

requestAnimationFrame(drawLoop);
