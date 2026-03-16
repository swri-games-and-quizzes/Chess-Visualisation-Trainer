const files="abcdefgh"

const pieceImages={

wp:"https://lichess1.org/assets/piece/cburnett/wP.svg",
bp:"https://lichess1.org/assets/piece/cburnett/bP.svg",

wn:"https://lichess1.org/assets/piece/cburnett/wN.svg",
bn:"https://lichess1.org/assets/piece/cburnett/bN.svg",

wb:"https://lichess1.org/assets/piece/cburnett/wB.svg",
bb:"https://lichess1.org/assets/piece/cburnett/bB.svg",

wr:"https://lichess1.org/assets/piece/cburnett/wR.svg",
br:"https://lichess1.org/assets/piece/cburnett/bR.svg",

wq:"https://lichess1.org/assets/piece/cburnett/wQ.svg",
bq:"https://lichess1.org/assets/piece/cburnett/bQ.svg",

wk:"https://lichess1.org/assets/piece/cburnett/wK.svg",
bk:"https://lichess1.org/assets/piece/cburnett/bK.svg"

}

function renderBoard(){

const boardDiv=document.getElementById("board")
boardDiv.innerHTML=""

const board=chess.board()

for(let r=0;r<8;r++){
for(let c=0;c<8;c++){

const square=document.createElement("div")

square.classList.add("square")
square.classList.add((r+c)%2?"dark":"light")

const coord=files[c]+(8-r)

square.dataset.square=coord

square.onclick=()=>toggleSquare(square)

const piece=board[r][c]

if(piece){

const img=document.createElement("img")
img.src=pieceImages[piece.color+piece.type]
square.appendChild(img)

}

boardDiv.appendChild(square)

}
}

}

function toggleSquare(el){

const sq=el.dataset.square

if(selectedSquares.includes(sq)){

selectedSquares=selectedSquares.filter(s=>s!==sq)
el.classList.remove("selected")

}else{

if(selectedSquares.length>=correctSquares.length)return

selectedSquares.push(sq)
el.classList.add("selected")

}

}