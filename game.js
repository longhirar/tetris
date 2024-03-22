const pieces = [
    { blocks: [0x0F00, 0x2222, 0x00F0, 0x4444], color: 'cyan'   },
    { blocks: [0x44C0, 0x8E00, 0x6440, 0x0E20], color: 'blue'   },
    { blocks: [0x4460, 0x0E80, 0xC440, 0x2E00], color: 'orange' },
    { blocks: [0xCC00, 0xCC00, 0xCC00, 0xCC00], color: 'yellow' },
    { blocks: [0x06C0, 0x8C40, 0x6C00, 0x4620], color: 'green'  },
    { blocks: [0x0E40, 0x4C40, 0x4E00, 0x4640], color: 'purple' },
    { blocks: [0x0C60, 0x4C80, 0xC600, 0x2640], color: 'red'    }
]

var gamearea = [];

var piecenum = 0, rotation = 0;

const update = dt => {
    if (keyqueue.length > 0)
    {
        console.log(keyqueue[0], keyqueue.length);
        key = keyqueue[0];
        keyqueue = keyqueue.slice(1);
        
        if(key === 38) {
            // ARROW UP
            rotation = rotation === 3 ? 0 : rotation + 1;
        }
        if(key === 39) {
            piecenum = piecenum === 6 ? 0 : piecenum + 1;
        }
    }

}

const drawPiece = (ctx, piece, x, y) => {
    const blockW = 20, blockH = 20;

    for (let i = 0; i < 16; i++) {
        if (piece & (0b1000000000000000 >>> i)) {
            const column = i % 4;
            const line = Math.floor(i / 4);
            ctx.fillRect(x + column * blockW, y + line * blockH, blockW, blockH);
            //console.log(x + column * blockW, y + line * blockH, blockW, blockH);
        }
    }
}

const draw = (dt,ctx) => {
    
    ctx.fillStyle = pieces[piecenum].color;
    drawPiece(ctx, pieces[piecenum].blocks[rotation], 100, 100);
}

gameloop(); //  start game