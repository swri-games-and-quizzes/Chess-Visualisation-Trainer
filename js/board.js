const files="abcdefgh"␊
␊
const pieceImages={␊
␊
wp:"https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg",
bp:"https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg",
␊
wn:"https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg",
bn:"https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg",
␊
wb:"https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg",
bb:"https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg",
␊
wr:"https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg",
br:"https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg",
␊
wq:"https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg",
bq:"https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg",
␊
wk:"https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg",
bk:"https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg"
␊
}␊
␊
function renderBoard(){␊
␊
const boardDiv=document.getElementById("board")␊
boardDiv.innerHTML=""␊
␊
const board=chess.board()␊
␊
for(let r=0;r<8;r++){␊
for(let c=0;c<8;c++){␊
␊
const square=document.createElement("div")␊
␊
square.classList.add("square")␊
square.classList.add((r+c)%2?"dark":"light")␊
␊
const coord=files[c]+(8-r)␊
␊
square.dataset.square=coord␊
␊
square.onclick=()=>toggleSquare(square)␊
␊
const piece=board[r][c]␊
␊
if(piece){␊
␊
const img=document.createElement("img")␊
img.src=pieceImages[piece.color+piece.type]␊
square.appendChild(img)␊
␊
}␊
␊
boardDiv.appendChild(square)␊
␊
}␊
}␊
␊
}␊
␊
function toggleSquare(el){␊
␊
const sq=el.dataset.square␊
␊
if(selectedSquares.includes(sq)){␊
␊
selectedSquares=selectedSquares.filter(s=>s!==sq)␊
el.classList.remove("selected")␊
␊
}else{␊
␊
if(selectedSquares.length>=correctSquares.length)return␊
␊
selectedSquares.push(sq)␊
el.classList.add("selected")␊
␊
}␊
␊
