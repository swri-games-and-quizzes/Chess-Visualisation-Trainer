function getQuestionPool(){
return [...new Set(movedPieces)]
}

function getRandomPiece(pool,pawnWeight=1){

const weighted=[]

for(let piece of pool){
const weight=piece[1]==="p"?pawnWeight:1
weighted.push({piece,weight})
}

const total=weighted.reduce((sum,item)=>sum+item.weight,0)

if(total===0) return null

let roll=Math.random()*total

for(let item of weighted){
roll-=item.weight
if(roll<=0) return item.piece
}

return weighted[weighted.length-1].piece

}

function startQuestions(){

const pool=getQuestionPool()
const attackPool=pool.filter(piece=>piece[1]!=="k")

const questionTypes=[
{ weight:0.05, ask:()=>askPieceLocation(getRandomPiece(pool,0.5)) },
{ weight:0.05, ask:()=>askPieceAttacks(getRandomPiece(attackPool)) },
{ weight:0.3, ask:()=>askEnemyTargets(getRandomPiece(attackPool)) },
{ weight:0.3, ask:()=>askWhoHasMoreAttackers() },
{ weight:0.3, ask:()=>askCheckingDestination() }
]

for(let attempt=0;attempt<20;attempt++){

const picked=pickWeightedQuestion(questionTypes)

if(picked.ask()) return

}

const fallbackPiece=getRandomPiece(pool,0.5)
if(fallbackPiece){
askPieceLocation(fallbackPiece)
}

}

function pickWeightedQuestion(options){

const total=options.reduce((sum,opt)=>sum+opt.weight,0)
let roll=Math.random()*total

for(let opt of options){
roll-=opt.weight
if(roll<=0) return opt
}

return options[options.length-1]

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

function inBounds(r,c){
return r>=0 && r<8 && c>=0 && c<8
}

function getAttackedSquaresForPiece(piece,square,board,{onlyEnemyOccupied=false}={}){

const attackedSquares=new Set()

const c=files.indexOf(square[0])
const r=8-parseInt(square[1])

function addSquare(nr,nc){
if(!inBounds(nr,nc)) return

if(onlyEnemyOccupied){
const target=board[nr][nc]
if(!target || target.color===piece[0]) return
}

attackedSquares.add(files[nc]+(8-nr))
}

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

if(onlyEnemyOccupied){
const target=board[nr][nc]
if(target){
if(target.color!==piece[0]) addSquare(nr,nc)
break
}
}else{
addSquare(nr,nc)
if(board[nr][nc]) break
}

nr+=dr
nc+=dc

}

}

}

return attackedSquares

}

function getAttackersOnSquare(square,color,board){

const attackers=[]

for(let r=0;r<8;r++){
for(let c=0;c<8;c++){

const p=board[r][c]
if(!p || p.color!==color) continue

const fromSq=files[c]+(8-r)
const pieceKey=p.color+p.type
const attacked=getAttackedSquaresForPiece(pieceKey,fromSq,board)

if(attacked.has(square)){
attackers.push(fromSq)
}

}
}

return attackers

}

function askPieceLocation(piece){

if(!piece) return false

const squares=getPieceSquares(piece)
if(squares.length===0) return false

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

return true

}

function askPieceAttacks(piece){

if(!piece) return false

const board=finalChess.board()
const pieceSquares=getPieceSquares(piece)
if(pieceSquares.length===0) return false

const attackedSquares=new Set()

for(let sq of pieceSquares){
const attacks=getAttackedSquaresForPiece(piece,sq,board)
for(let attack of attacks) attackedSquares.add(attack)
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

return true

}

function askEnemyTargets(piece){

if(!piece) return false

const board=finalChess.board()
const pieceSquares=getPieceSquares(piece)
if(pieceSquares.length===0) return false

const attackedEnemySquares=new Set()

for(let sq of pieceSquares){
const attacks=getAttackedSquaresForPiece(piece,sq,board,{onlyEnemyOccupied:true})
for(let attack of attacks) attackedEnemySquares.add(attack)
}

correctSquares=[...attackedEnemySquares].sort()
selectedSquares=[]

const color=piece[0]==="w"?"WHITE":"BLACK"

const names={
p:"PAWNS",
n:"KNIGHTS",
b:"BISHOPS",
r:"ROOKS",
q:"QUEEN",
k:"KING"
}

document.getElementById("question").textContent=
"Which enemy pieces/pawns are attacked by "+color+" "+names[piece[1]]+"?"

return true

}

function askWhoHasMoreAttackers(){

const targetSquares=["d4","e4","d5","e5"]
const target=targetSquares[Math.floor(Math.random()*targetSquares.length)]
const board=finalChess.board()

const whiteAttackers=getAttackersOnSquare(target,"w",board)
const blackAttackers=getAttackersOnSquare(target,"b",board)

if(whiteAttackers.length===blackAttackers.length) return false

const winningColor=whiteAttackers.length>blackAttackers.length?"WHITE":"BLACK"
const winningSquares=whiteAttackers.length>blackAttackers.length?whiteAttackers:blackAttackers

correctSquares=[...new Set(winningSquares)].sort()
selectedSquares=[]

document.getElementById("question").textContent=
"Who has more attackers on "+target+"? Select the "+winningColor+" attacking piece squares."

return true

}

function askCheckingDestination(){

const turnColor=finalChess.turn()
const colorLabel=turnColor==="w"?"WHITE":"BLACK"
const moves=finalChess.moves({verbose:true})
const checkSquares=[]

for(let move of moves){

finalChess.move({
from:move.from,
to:move.to,
promotion:move.promotion
})

if(finalChess.in_check()){
checkSquares.push(move.to)
}

finalChess.undo()

}

const unique=[...new Set(checkSquares)].sort()
if(unique.length===0) return false

correctSquares=unique
selectedSquares=[]

document.getElementById("question").textContent=
"On which square can "+colorLabel+" give check next move?"

return true

}
