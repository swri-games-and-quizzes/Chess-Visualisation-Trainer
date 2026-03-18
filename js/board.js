const files="abcdefgh"

const pieceGlyphs={
wp:"♙",
bp:"♟",
wn:"♘",
bn:"♞",
wb:"♗",
bb:"♝",
wr:"♖",
br:"♜",
wq:"♕",
bq:"♛",
wk:"♔",
bk:"♚"
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

const glyph=document.createElement("span")
glyph.textContent=pieceGlyphs[piece.color+piece.type]
glyph.style.fontSize="40px"
glyph.style.lineHeight="1"
glyph.style.userSelect="none"
square.appendChild(glyph)

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
