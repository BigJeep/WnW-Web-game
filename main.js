// my debug console
const debugWindow  = document.getElementById('debug-window');
const debugContent = new Array(1);

function myDebug (content) {
    index = debugContent.length > 0 ? debugContent.length + 1: 0;
    debugContent[index] = String(content);
    const time1 = new Date();
    const time2 = time1.getHours() + ":" + time1.getMinutes() + ":" + time1.getSeconds()/* + ":" + time1.getMilliseconds()*/;
    debugWindow.innerHTML += `<div>[${time2}] ${content}</div>`;
    debugWindow.scrollTop = debugWindow.scrollHeight;
}

// test


// html elements / DOM

// board/viewport
const zoomSlide         = document.getElementById('zoom-slide');
const mainViewport      = document.getElementById('main-viewport');
const zoomViewport      = document.getElementById('zoom-viewport')
const tileBoard         = document.getElementById('tile-board');
const playerBoard       = document.getElementById('player-board');
// tile data window
const tileDataWindow    = document.getElementById('tile-properties-window');

// context menu
const myContextMenu     = document.getElementById('custom-context-menu');



// basic constants/parameters
const boardSize = 8; // better not go beyond 24 for now
const boardTiles = Array.from(Array(boardSize), (i)=>i=Array(boardSize)); // tile ELEMENTS are stored here, in a 2d array, to be later called by their x-1,y-1
const floorMin = -1;
const floorMax = 3;
const playerBoardRect = playerBoard.getBoundingClientRect();

let mouseX
let mouseY


// Initialization, Listeners, Events

zoomSlide.addEventListener ("input", resizeBoard);
document.addEventListener ("wheel", mouseWheelZoom, {passive: false});


document.addEventListener("click", () => {if (myContextMenu.style.display == "block") {myContextMenu.style.display = "none";myDebug("context menu hidden");}})
document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX; 
    mouseY = e.clientY; 
    // myDebug (`${mouseX}, ${mouseY}`);
})


// CONSTRUCT BOARD + TILE PROPERTIES


for (let count = 0, x = 0, y = 0; count < boardSize * boardSize; count++, y++) {
    if (y == boardSize) {y=0; x++;}
    myDebug("constructing tile " + (x+1) + ", " + (y+1));
    
    const newTile = new boardTile();
    tileBoard.appendChild(newTile);
    
    newTile.x = x + 1;
    newTile.y = y + 1;
    
    tileBoard.style.setProperty('--board-size', boardSize);
    newTile.addEventListener ("mouseenter", showTileProperties);
    newTile.addEventListener ("contextmenu", openActionMenu);
    

    boardTiles[x][y] = newTile;
}

function resizeBoard (event, amount = 1600) {
    const slideValue = zoomSlide.value;
    
    myDebug(slideValue);
    zoomViewport.style.width = amount - slideValue*8+"px";
    zoomViewport.style.height = amount/2 - slideValue*8+"px";
}

function mouseWheelZoom (event) {
    
    if (event.deltaY > 0) {
        zoomSlide.value += 10;
        
        myDebug (zoomSlide.value);
        resizeBoard (amount = zoomSlide.value);
        //myDebug ("down")
    }
    else {
        zoomSlide.value -= 10;
        resizeBoard (amount = zoomSlide.value)
        //myDebug ("up")
    }
    event.preventDefault();

}

function openActionMenu (e) {
    
    e.preventDefault();
    myContextMenu.style.display = "block";
    myContextMenu.style.top = mouseX + "px";
    myContextMenu.style.left = mouseY + "px";
    myDebug ("context menu")
    myDebug (`mouse ${mouseX}, ${mouseY}`);
    const rect = myContextMenu.getBoundingClientRect();
    myDebug (`rect ${rect.top}, ${rect.top}`);
    // PAREI AQUI QUE PREGUIÇA zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz

}

function showTileProperties () {
    const objClass = this.objectWithin != undefined || null ? this.objectWithin.className:"none"; 
    const objName = this.objectWithin != undefined || null ? this.objectWithin["name"]:"none";
    tileDataWindow.innerHTML = `
    <div><b>Selected Tile properties </b></div>
    <p>X: ${this.x}</p>
    <p>Y: ${this.y}</p>
    <p>Is Wall: ${this.wall}</p>
    <p>Level: ${this.level}</p>
    <p>Object within: ${objClass}</p>
    <p>Object name: ${objName}</p>
    
    `;

}

// classes

function boardTile() {
    const tile = document.createElement('div');
    tile.className = 'board-tile';
    if (this.wall == true) {this.classList.add("wall-tile")}
    this.level = 0; // Default level
    this.objectWithin = null;
    return tile;
}
