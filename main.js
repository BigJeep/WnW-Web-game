// html elements / DOM
    // board/viewport
const mainViewport      = document.getElementById('main-viewport');
const tileBoard         = document.getElementById('tile-board');
const playerBoard       = document.getElementById('player-board');
    // windows
    // add pawn window
const addPawnBtn        = document.getElementById('new-pawn-btn');
const pawnXInput        = document.getElementById('pawn-x-input');
const pawnYInput        = document.getElementById('pawn-y-input');
const pawnNameInput     = document.getElementById('pawn-name-input');
    // tile data window
const tileDataWindow    = document.getElementById('tile-properties-window');
    // pawn data window
const pawnDataWindow    = document.getElementById('pawn-window-data');
const pawnBtnWindow     = document.getElementById('pawn-window-buttons');
const pawnCancelBtn     = document.getElementById("pawn-cancel-button");
const pawnPlayBtn       = document.getElementById("pawn-play-button");
    // player actions window
const playerWindow          = document.getElementById('player-window');
const playerWindowData      = document.getElementById("player-window-data");
const playerButtons         = document.getElementById("player-buttons");
const playerPawnMoveBtn     = document.getElementById("pawn-move-button"  );
const playerPawnAttackBtn   = document.getElementById("pawn-attack-button");
const playerPawnSkipBtn     = document.getElementById("pawn-skip-button");

// basic constants/parameters
const boardSize = 8; // 8x8 default size
const boardTiles = Array.from(Array(boardSize), (i)=>i=Array(boardSize)); // tile ELEMENTS are stored here, in a 2d array, to be later called by their x-1,y-1
const floorMin = -1;
const floorMax = 3;


let playerSelectedPawn;


// Listeners and Events

//  ADD PAWN
addPawnBtn.addEventListener ("click", addPawn)

// PAWN BUTTONS
pawnCancelBtn.addEventListener ("click", pawnCancel);
pawnPlayBtn.addEventListener ("click", pawnActions);

// PLAYER PAWN ACTIONS
playerPawnMoveBtn.addEventListener ("click", null);
playerPawnAttackBtn.addEventListener ("click", null);
playerPawnSkipBtn.addEventListener ("click", null);

// CONSTRUCT BOARD + TILE PROPERTIES
for (let count = 0, x = 0, y = 0; count < boardSize * boardSize; count++, y++) {
    if (y == boardSize) {y=0; x++;}
    console.log("constructing tile " + x + ", " + y);
    
    const newTile = new boardTile();
    tileBoard.appendChild(newTile);
    
    newTile.x = x + 1;
    newTile.y = y + 1;
    
    
    tileBoard.style.setProperty('--board-size', boardSize);
    newTile.addEventListener ("click", showTileProperties.bind(newTile));
    
    boardTiles[x][y] = newTile;
    
    // for debugging //
    
    // console.log(`Current iteration: X - ${x}, Y - ${y} ${boardTiles[x][y]}`);

    //newTile.innerText = (x + 1) + ", " + (y + 1); // adds text to the tiles with the number of their coordinates
    
    // random property assign //
    // newTile.level = Math.floor(Math.random() * (floorMax - floorMin) + floorMin); // random level between -1 and 3
    // newTile.wall = new Boolean(Math.round(Math.random()));
}

function addPawn() {
    
    const x = pawnXInput.value;
    const y = pawnYInput.value;
    const actualX = x - 1;
    const actualY = y - 1;
    const tile = boardTiles[actualX][actualY];
    console.log("adding new pawn");
    if (tile.objectWithin == null) {
        const newPawn = new pawnCharacter();
        playerBoard.appendChild(newPawn);
        newPawn.x = x
        newPawn.y = y
        newPawn.name = pawnNameInput.innerText;
        
        
        
        const tileRect = tile.getBoundingClientRect();
        const playerBoardRect = playerBoard.getBoundingClientRect();

        tile.objectWithin = newPawn;

        // const actualTop = tile.offsetTop;
        // const actualLeft = tileRect.offsetLeft;
        const actualTop = tileRect.top - playerBoardRect.top;
        const actualLeft = tileRect.left - playerBoardRect.left;

        Object.assign(newPawn.style, {
            position: 'absolute',
            height: `${tileRect.height}px`,
            width: `${tileRect.width}px`,
            top: `${actualTop}px`,
            left: `${actualLeft}px`
        });

        // console.log("Tile Rect:", tileRect);
        // console.log("Pawn Rect:", newPawn.getBoundingClientRect());

        newPawn.addEventListener ("click", pawnSelect);
    }
    else {
        console.log("Tile occupied - Can't add a new pawn.")
    }

}
    
function pawnSelect () {
    console.log("Pawn clicked!")
    
    if (playerSelectedPawn != this) {
        
        console.log("New Pawn selected!")
        pawnDataWindow.innerHTML = `
        <div><b>Selected Pawn properties </b></div>
        <p>Name: ${this.name}</p>
        <p>X: ${this.x}</p>
        <p>Y: ${this.y}</p>
        `;
        pawnBtnWindow.hidden = false;
        
        
    } 
}

function pawnCancel () {
    console.log("Selection cancelled")
    pawnDataWindow.innerHTML = "";
    pawnBtnWindow.hidden = true;

    playerWindowData.innerHTML = ""
    playerButtons.style.display = "none";
}

function pawnActions () {
    playerWindowData.innerHTML = `
    <p>Select an action. Cancel at the window above.</p>`
    playerButtons.style.display = "block";
    
}

function showTileProperties () {
    
    tileDataWindow.innerHTML = `
    <div><b>Selected Tile properties </b></div>
    <p>X: ${this.x}</p>
    <p>Y: ${this.y}</p>
    <p>Is Wall: ${this.wall}</p>
    <p>Level: ${this.level}</p>
    `;
    
    
}

// classes

function pawnCharacter () {
    const pawn = document.createElement('div');
    pawn.className = 'pawn';
    this.name = "unnamed";
    this.x = 1;
    this.y = 1;
    this.speed = 3;
    return pawn;
}

function boardTile() {
    const tile = document.createElement('div');
    tile.className = 'board-tile';
    this.wall = false; // Default to no wall
    this.level = 0; // Default level
    this.objectWithin = null;
    return tile;
}