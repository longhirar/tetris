var running = true,
    keyqueue = [],
    centerX = 0,
    centerY = 0;

document.body.onkeydown = (ev) => {
    keyqueue.push(ev.keyCode);
}

var canvas = document.querySelector('#tetris');
window.onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    console.log("Window resize:", window.innerWidth, window.innerHeight);
    centerX = canvas.width/2;
    centerY = canvas.height/2;
}
window.onresize();


var frames = 0,
    ctx = canvas.getContext("2d"),
    framestart = 0,
    frameend = 0,
    frametime = 16.6,
    dt = 0,
    fps = 0,
    framecount = 0;

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
        ctx.fillText("GAME CRASH", 20, 40);
        ctx.font = "16px sans-serif";
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'black';
        ctx.fillText('on game update', 20, 60);
        ctx.fillText(e, 20, 100);

        
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
        ctx.fillText("GAME CRASH", 20, 40);
        ctx.font = "16px sans-serif";
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'black';
        ctx.fillText('on game draw', 20, 60);
        ctx.fillText(e, 20, 100);
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