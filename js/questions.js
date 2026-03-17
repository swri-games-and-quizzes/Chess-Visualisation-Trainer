function getQuestionPool(){
return [...new Set(movedPieces)]
}

function startQuestions(){

const pool=getQuestionPool()

const piece=pool[Math.floor(Math.random()*pool.length)]

if(Math.random()<0.5){
askPieceLocation(piece)
}else{
askPieceAttacks(piece)
}

}

function getPieceSquares(piece){

const board=finalChess.board()

let squares=[]

for(let r=0;r<8;r++){
for(let c=0;c<8;c++){

const p=board[r][c]

if(p && (p.color+p.type)===piece){
squares.push(files[c]+(8-r))
}

}
}

return squares

}

function askPieceLocation(piece){

const squares=getPieceSquares(piece)

correctSquares=squares
selectedSquares=[]

const color=piece[0]=="w"?"WHITE":"BLACK"

const names={
p:"PAWNS",
n:"KNIGHTS",
b:"BISHOPS",
r:"ROOKS",
q:"QUEEN",
k:"KING"
}

document.getElementById("question").textContent=
"Where are the "+color+" "+names[piece[1]]+"?"

}

function askPieceAttacks(piece){

const board=finalChess.board()
const pieceSquares=getPieceSquares(piece)
const attackedSquares=new Set()

function inBounds(r,c){
return r>=0 && r<8 && c>=0 && c<8
}

function addSquare(r,c){
if(inBounds(r,c)){
attackedSquares.add(files[c]+(8-r))
}
}

for(let sq of pieceSquares){

const c=files.indexOf(sq[0])
const r=8-parseInt(sq[1])

if(piece[1]==="p"){

const dir=piece[0]==="w"?-1:1
addSquare(r+dir,c-1)
addSquare(r+dir,c+1)

}else if(piece[1]==="n"){

const jumps=[[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]]

for(let [dr,dc] of jumps){
addSquare(r+dr,c+dc)
}

}else if(piece[1]==="k"){

for(let dr=-1;dr<=1;dr++){
for(let dc=-1;dc<=1;dc++){
if(dr===0 && dc===0) continue
addSquare(r+dr,c+dc)
}
}

}else{

const directions=[]

if(piece[1]==="b" || piece[1]==="q"){
directions.push([1,1],[1,-1],[-1,1],[-1,-1])
}

if(piece[1]==="r" || piece[1]==="q"){
directions.push([1,0],[-1,0],[0,1],[0,-1])
}

for(let [dr,dc] of directions){

let nr=r+dr
let nc=c+dc

while(inBounds(nr,nc)){

addSquare(nr,nc)

if(board[nr][nc]) break

nr+=dr
nc+=dc

}

}

}

}

correctSquares=[...attackedSquares].sort()
selectedSquares=[]

const color=piece[0]=="w"?"WHITE":"BLACK"

const names={
p:"PAWNS",
n:"KNIGHTS",
b:"BISHOPS",
r:"ROOKS",
q:"QUEEN",
k:"KING"
}

document.getElementById("question").textContent=
"Which squares do "+color+" "+names[piece[1]]+" now attack?"

}
