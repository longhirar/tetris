const pieces = [
    { blocks: [0x0f00, 0x2222, 0x00f0, 0x4444], color: "cyan" },
    { blocks: [0x44c0, 0x8e00, 0x6440, 0x0e20], color: "blue" },
    { blocks: [0x4460, 0x0e80, 0xc440, 0x2e00], color: "orange" },
    { blocks: [0xcc00, 0xcc00, 0xcc00, 0xcc00], color: "yellow" },
    { blocks: [0x06c0, 0x8c40, 0x6c00, 0x4620], color: "green" },
    { blocks: [0x0e40, 0x4c40, 0x4e00, 0x4640], color: "purple" },
    { blocks: [0x0c60, 0x4c80, 0xc600, 0x2640], color: "red" },
];

var gamearea = [];
for (let y = 0; y < 20; y++) {
    gamearea.push([]);

    for (let x = 0; x < 10; x++) {
        gamearea[y].push(null);
    }
}

var piece = 0,
    rotation = 0,
    score = 0,
    lastPieceDown = new Date(),
    gameover = false,
    nextpieces = [];

const getNextPiece = (index) => {
    if(nextpieces[index] !== undefined) {
        return nextpieces[index]
    }

    while (nextpieces[index] == undefined) {
        // piece not generated yet, so generate new bag.
        let orderedBag = [...pieces]; // copy pieces
        for (let i = 0; orderedBag.length != 0; i++) {
            let pick = Math.floor(Math.random() * orderedBag.length);
            nextpieces.push(orderedBag.splice(pick, 1)[0]);
        }
    }

    return nextpieces[index];
}
const popNextPiece = () => {
    if (nextpieces[0] === undefined) {
        getNextPiece(0);
    }
    return nextpieces.splice(0,1)[0]; // same as array.pop, but from index 0
}

piece = popNextPiece();

const addPieceToGamearea = () => {
    for (let i = 0; i < 16; i++) {
        if (piece.blocks[rotation] & (0b1000000000000000 >>> i)) {
            const column = pieceX + (i % 4);
            const line = pieceY + Math.floor(i / 4);

            // Add the piece to the game area
            gamearea[line][column] = piece.color;
        }
    }

    pieceX = 3;
    pieceY = 0;
    piece = popNextPiece();

    if(checkPieceCollision()) {
        // game over, can't spawn new piece
        gameover = true;
    }
};

const checkPieceCollision = () => {
    for (let i = 0; i < 16; i++) {
        if (piece.blocks[rotation] & (0b1000000000000000 >>> i)) {
            const column = pieceX + (i % 4);
            const line = pieceY + Math.floor(i / 4);

            // Check if the current cell of the new piece is outside the game area
            if (column < 0 || column >= 10 || line < 0 || line >= 20) {
                console.log(`BOUNDARY Collision of block at ${column}x${line}`)
                return true; // Collision detected
            }

            // Check if the current cell of the new piece overlaps with any occupied cell of the existing pieces
            if (gamearea[line][column] !== null) {
                console.log(`PIECE Collision of block at ${column}x${line} with piece's ${(i%4)}x${Math.floor(i/4)}`)
                return true; // Collision detected
            }
        }
    }

    return false; // No collision detected
};

const movePieceDown = () => {
    lastPieceDown = new Date();
    pieceY += 1;

    if (checkPieceCollision()) {
        pieceY -= 1;
        addPieceToGamearea();
        return true;
    }
    return false;
};

const snapPieceDown = () => {
    while (!checkPieceCollision()) {
        pieceY += 1;
    }
    pieceY -= 1;
    addPieceToGamearea();
    lastPieceDown = new Date();
}

const gameover_update = () => {
    if (keyqueue.length > 0) {
        console.log(keyqueue[0], keyqueue.length);
        key = keyqueue[0];
        keyqueue = keyqueue.slice(1);
    
        switch (key) {
            case 27: // escape
                location.reload();
            default:
                break;
        }
    }
}

const update = (dt) => {
    
    if(gameover){
        gameover_update();
        return;
    }

    let linescleared = 0;
    for (let y = 0; y < 20; y++) {
        let linefull = true;
        for (let x = 0; x < 10; x++) {
            if (gamearea[y][x] === null) {
                linefull = false;
            }
        }
        if (linefull) {
            gamearea.splice(y, 1);
            gamearea.splice(0, 0, [null,null,null,null,null,null,null,null,null,null])
            linescleared += 1;
        }
    }
    if (linescleared >= 4) {
        score += linescleared*300;
    } else if (linescleared == 3) {
        score += linescleared*100;
    } else if (linescleared == 2) {
        score += linescleared*50;
    } else {
        score += linescleared*40;
    }

    if (keyqueue.length > 0) {
        console.log(keyqueue[0], keyqueue.length);
        key = keyqueue[0];
        keyqueue = keyqueue.slice(1);

        switch (key) {
            case 32: // space
                snapPieceDown();
                break;
            case 37: // arrow left
                pieceX = pieceX - 1;
                if (checkPieceCollision()) {
                    pieceX = pieceX + 1; // revert movement
                }
                break;
            case 38: // arrow up
                let lastRotation = rotation;
                rotation = rotation === 3 ? 0 : rotation + 1;
                if (checkPieceCollision()) {
                    rotation = lastRotation;
                }
                break;
            case 39: // arrow right
                pieceX = pieceX + 1;
                if (checkPieceCollision()) {
                    pieceX = pieceX - 1; // revert movement
                }
                break;
            case 40: // arrow down
                movePieceDown();
                break;
            case 27: // escape
                location.reload(); //restart game
                break;
            default:
                break;
        }

    }

    // Check if it's time to move the piece down
    if (new Date() - lastPieceDown > 500) {
        movePieceDown();
    }
};

const drawPiece = (ctx, piece, x, y) => {
    const blockW = 20,
        blockH = 20;

    for (let i = 0; i < 16; i++) {
        if (piece & (0b1000000000000000 >>> i)) {
            const column = i % 4;
            const line = Math.floor(i / 4);
            ctx.fillRect(
                x + column * blockW,
                y + line * blockH,
                blockW,
                blockH
            );
            //console.log(x + column * blockW, y + line * blockH, blockW, blockH);
        }
    }
};

var pieceX = 0,
    pieceY = 0;

const draw = (dt, ctx) => {
    for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 20; y++) {
            const block = gamearea[y][x];

            if (block === null) {
                ctx.strokeStyle = "black";
                ctx.fillStyle = "lightgray";
            } else {
                ctx.fillStyle = block;
            }
            ctx.fillRect(100 + x * 20, 100 + y * 20, 20, 20);

        }
    }

    ctx.fillStyle = piece.color;
    drawPiece(
        ctx,
        piece.blocks[rotation],
        100 + pieceX * 20,
        100 + pieceY * 20
    );

    for (let i = 0; i < 5; i++) {
        let nextPiece = getNextPiece(i);
        ctx.fillStyle = nextPiece.color;
        drawPiece(
            ctx,
            nextPiece.blocks[0],
            320,
            100 + 100*i
        )
        
    }

    ctx.font = "16px sans-serif";
    ctx.fillStyle = 'black';
    ctx.fillText(`Score: ${score}`, 100, 84);

    if(gameover) {
        ctx.font = "24px sans-serif";
        ctx.strokeStyle = 'red';
        ctx.fillStyle = 'red';
        ctx.fillText("GAME OVER", 120, 530);
        ctx.font = "16px sans-serif";
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'black';
        ctx.fillText("press esc", 160, 560);
    }
};

gameloop()