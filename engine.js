var running = true;
var keyqueue = [];

document.body.onkeydown = (ev) => {
    keyqueue.push(ev.keyCode);
}

var canvas = document.querySelector('#tetris');
window.onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    console.log("Window resize:", window.innerWidth, window.innerHeight);
}
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


var frames = 0;
var ctx = canvas.getContext("2d");
var framestart = 0;
var frameend = 0;
var frametime = 16.6;
var dt = 0;
var fps = 0;
var framecount = 0;

const gameloop = async () => {
    framestart = new Date();
    framecount += 1;
    dt = framestart - frameend;

    update(dt);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw(dt, ctx);

    frameend = new Date();
    frametime = frameend - framestart;
    idletime = 16.6 - frametime;
    idletime = idletime < 0 ? 0 : idletime; // if idletime is smaller then zero, we can't go to the past, so set it to 0;
    fps = 1000 / (frametime + idletime)
    console.log(frametime);
    setTimeout(gameloop, idletime);
}