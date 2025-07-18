// my debug console
const debugWindow  = document.getElementById('debug-window');
const debugContent = new Array(1);
const debugRealTimeWindow = document.getElementById ('real-time-debug-window');

function myDebug (content) {
    index = debugContent.length > 0 ? debugContent.length + 1: 0;
    debugContent[index] = String(content);
    const time1 = new Date();
    const time2 = time1.getHours() + ":" + time1.getMinutes() + ":" + time1.getSeconds()/* + ":" + time1.getMilliseconds()*/;
    debugWindow.innerHTML += `<div>[${time2}] ${content}</div>`;
    debugWindow.scrollTop = debugWindow.scrollHeight;
}

// test

myDebug ("initializing")

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
const boardSize = 10; // better not go beyond 24 for now
const borderLinePx = boardSize > 8 ? 1-0.05*(boardSize-8) : 1; //
myDebug("tile border size: " + borderLinePx);
const boardTiles = Array.from(Array(boardSize), (i)=>i=Array(boardSize)); // tile ELEMENTS are stored here, in a 2d array, to be later called by their x-1,y-1
const floorMin = -1;
const floorMax = 3;
const playerBoardRect = playerBoard.getBoundingClientRect();


let mouseX
let mouseY
let isMouseInsideViewPort = false
let boardTranslationX = 0;
let boardTranslationY = 0;
const mainViewportRect = mainViewport.getBoundingClientRect();

// Initialization, Listeners, Events

zoomViewport.style.transform = `scale(${3 - zoomSlide.value/50}) translate(0, 0)`;
zoomSlide.addEventListener ("input", resizeBoard);
document.addEventListener ("wheel", mouseWheelZoom, {passive: false});

myContextMenu.addEventListener ("contextmenu", (e) => e.preventDefault());
document.addEventListener("click", () => {
    const menuRect = myContextMenu.getBoundingClientRect();
    if (myContextMenu.style.display == "block" && 
        !(mouseY < menuRect.bottom && 
            mouseY > menuRect.y &&
            mouseX < menuRect.right &&
            mouseX > menuRect.x) // checks if cursor is outside the context menu div
        ) {
            myContextMenu.style.display = "none";
            myDebug("context menu hidden");
        }
    }
    )

document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX; 
    mouseY = e.clientY; 

    debugRealTimeWindow.innerText = "Cursor X, Y: " + mouseX + ", " + mouseY;

    
    if( 
    mouseY < mainViewportRect.bottom &&
    mouseY > mainViewportRect.y &&
    mouseX < mainViewportRect.right &&
    mouseX > mainViewportRect.x // checks if cursor is inside the main viewport
    ){
        isMouseInsideViewPort = true;
    } else {
    isMouseInsideViewPort = false;
    }


    
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
    
    newTile.style.boxShadow = `inset 0 0 0 ${borderLinePx > 0 ? borderLinePx : 0.01}px #000`;

    boardTiles[x][y] = newTile;
}

function resizeBoard () {
    const scale = 3 - zoomSlide.value/50;
    const borderSize = borderLinePx > 0 ? borderLinePx : 0.01 ;
    const tiles = document.querySelectorAll('.board-tile')
    const scaleRegex = /scale\(.*?\)/
    
    zoomViewport.style.transform = zoomViewport.style.transform.replace(scaleRegex, `scale(${scale})`);
    tiles.forEach(e => {
        e.style.boxShadow = `inset 0 0 0 ${borderSize}px #000`;
    });
        
    
    
    // // zoomViewport.style.width = 1600 - slideValue*8+"px";
    // // zoomViewport.style.height = 1600/2 - slideValue*8+"px";
}

function mouseWheelZoom (event) {
    
    const translateRegex = /translate\(.*?\)/

    if (isMouseInsideViewPort){
    event.preventDefault();

    const step = 5
    let newValue = parseInt(zoomSlide.value);
    if (event.deltaY > 0) { // ZOOM OUT
        newValue += step;
        
        let zoomPercent = 1.5-(zoomSlide.value)/200;
        boardTranslationY = Math.abs(Math.round(boardTranslationY))-2 != 0 ? boardTranslationY/zoomPercent:0;
        boardTranslationX = Math.abs(Math.round(boardTranslationX))-3 != 0 ? boardTranslationX/zoomPercent:0;
        
        if (zoomSlide.value == 100) {
            boardTranslationY = 0
            boardTranslationX = 0
        }
        
    }
    else { // ZOOM IN
        newValue -= step;
        if (zoomSlide.value > 1) {
            const zoomX = 1 * Math.abs(mouseX - 960)/20
            const zoomY = 1 * Math.abs(mouseY - 480)/20
            boardTranslationX += mouseX > 960 ? - zoomX:zoomX;
            boardTranslationY += mouseY > 480 ? - zoomY:zoomY;
            
            
        } 
    
    }
    zoomSlide.value = newValue
    resizeBoard ()
    
    const translateLiteral = `translate(${boardTranslationX}px, ${boardTranslationY}px)`;
    zoomViewport.style.transform = zoomViewport.style.transform.replace(translateRegex, translateLiteral);
    
    


    }

    


}

function openActionMenu (e) {
    e.preventDefault();
    myContextMenu.style.display = "block";
    myContextMenu.style.left = mouseX + "px";
    myContextMenu.style.top = mouseY + "px";
    myDebug ("context menu")
    const rect = myContextMenu.getBoundingClientRect();
    

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
