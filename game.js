var i = { blocks: [0x0F00, 0x2222, 0x00F0, 0x4444], color: 'cyan'   };
var j = { blocks: [0x44C0, 0x8E00, 0x6440, 0x0E20], color: 'blue'   };
var l = { blocks: [0x4460, 0x0E80, 0xC440, 0x2E00], color: 'orange' };
var o = { blocks: [0xCC00, 0xCC00, 0xCC00, 0xCC00], color: 'yellow' };
var s = { blocks: [0x06C0, 0x8C40, 0x6C00, 0x4620], color: 'green'  };
var t = { blocks: [0x0E40, 0x4C40, 0x4E00, 0x4640], color: 'purple' };
var z = { blocks: [0x0C60, 0x4C80, 0xC600, 0x2640], color: 'red'    };

var gamearea = [];
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

var randomsquares = [];

const update = dt => {
    if (keyqueue.length > 0)
    {
        console.log(keyqueue[0], keyqueue.length);
        keyqueue = keyqueue.slice(1);

        randomsquares.push({x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, velx: 0, vely: 0})
    }

    randomsquares.forEach(sq => {
        sq.x += sq.velx;
        sq.y += sq.vely;
        sq.vely += 1;
        if (sq.y >= canvas.height) {
            sq.vely = sq.vely * -1;
        }
    })
}

const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'red';
    randomsquares.forEach(sq => {
        ctx.fillRect(sq.x - 30, sq.y - 30, 60, 60);
    });
    
}

const gameloop = async () => {
    framestart = new Date();
    framecount += 1;
    dt = framestart - frameend;

    update(dt);
    
    draw(dt);

    frameend = new Date();
    frametime = frameend - framestart;
    idletime = 16.6 - frametime;
    idletime = idletime < 0 ? 0 : idletime; // if idletime is smaller then zero, we can't go to the past, so set it to 0;
    fps = 1000 / (frametime + idletime)
    console.log(fps.toFixed(0));
    setTimeout(gameloop, idletime);
}
setTimeout(gameloop, 16.6)
