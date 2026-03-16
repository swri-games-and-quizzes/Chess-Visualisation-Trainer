function animateMoves(){

const temp=new Chess(chess.fen())

let i=0

function step(){

if(i>=generatedMoves.length)return

temp.move(generatedMoves[i])

chess.load(temp.fen())

renderBoard()

i++

setTimeout(step,600)

}

step()

}