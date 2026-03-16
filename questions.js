function getQuestionPool(){
return [...new Set(movedPieces)]
}

function startQuestions(){

const pool=getQuestionPool()

const piece=pool[Math.floor(Math.random()*pool.length)]

askPieceLocation(piece)

}

function askPieceLocation(piece){

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