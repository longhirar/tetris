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

    try {
        update(dt);
    } catch (e){
        console.error(e);
        
        // prevent canvas size changing
        // so that if the user checks the console
        // the crash screen stays present
        // and doesn't need to be redrawn
        // (which would be terrible, because it would
        // case another call to the game's draw func
        // while the game is crashed).
        window.onresize = undefined; 

        ctx.font = "24px sans-serif";
        ctx.strokeStyle = 'red';
        ctx.fillStyle = 'red';
        ctx.fillText("GAME CRASH", 320, 150);
        ctx.font = "16px sans-serif";
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'black';
        ctx.fillText('on game update', 320, 170);
        ctx.fillText(e, 320, 220);

        
        return; // stop game execution
    }
    
    try {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw(dt, ctx);
    } catch (e){
        console.error(e);
        ctx.font = "24px sans-serif";
        ctx.strokeStyle = 'red';
        ctx.fillStyle = 'red';
        ctx.fillText("GAME CRASH", 320, 150);
        ctx.font = "16px sans-serif";
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'black';
        ctx.fillText('on game draw', 320, 170);
        ctx.fillText(e, 320, 220);
        return; // stop game execution
    }

    frameend = new Date();
    frametime = frameend - framestart;
    idletime = 16.6 - frametime;
    idletime = idletime < 0 ? 0 : idletime; // if idletime is smaller then zero, we can't go to the past, so set it to 0;
    fps = 1000 / (frametime + idletime)
    //console.log(frametime);
    setTimeout(gameloop, idletime);
}