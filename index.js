const height = window.innerHeight;
const width = window.innerWidth;

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

let isMouseDown = null;

canvas.addEventListener("mousedown", function(event) {
    isMouseDown = true;
});

canvas.addEventListener("mouseup", function(event) {
    isMouseDown = false;
});

canvas.addEventListener("mousemove", function(event) {
    if (isMouseDown) {
        world.push(
            new Circle(event.pageX, event.pageY, getRandomColor(), 10, performance.now(), 500)
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
