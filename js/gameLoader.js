function displayMoves(moves){

const table=document.getElementById("movesTable")
table.innerHTML=""

let moveNum=startMoveNumber
let index=0

if(startTurn==="b"){

const row=document.createElement("tr")
row.innerHTML=`<td>${moveNum}</td><td>...</td><td>${moves[0]}</td>`
table.appendChild(row)

index=1
moveNum++

}

while(index<moves.length){

const white=moves[index]
const black=moves[index+1]||""

const row=document.createElement("tr")
row.innerHTML=`<td>${moveNum}</td><td>${white}</td><td>${black}</td>`
table.appendChild(row)

index+=2
moveNum++

}

}

function getFallbackGame(){
return games[Math.floor(Math.random()*games.length)]
}

function getRandomGamePosition(){

const game=getFallbackGame()
const temp=new Chess()

temp.load_pgn(game)

const history=temp.history()

if(history.length<=halfMoveCount){
throw new Error("No game has enough moves for current halfMoveCount")
}

return buildPositionFromHistory(temp,history)

}

function buildPositionFromHistory(temp,history){

/* ensure there are always N moves remaining */
const randomMove=Math.floor(Math.random()*(history.length-halfMoveCount))

temp.reset()

for(let i=0;i<randomMove;i++){
temp.move(history[i])
}

startMoveNumber=Math.floor(randomMove/2)+1
startTurn=temp.turn()

/* store the real next N moves from the game */
generatedMoves=history.slice(randomMove,randomMove+halfMoveCount)

/* determine which pieces moved */
movedPieces=[]

const tracker=new Chess(temp.fen())

for(let m of generatedMoves){

const move=tracker.move(m,{sloppy:true})

movedPieces.push(move.color+move.piece)

}

finalChess=new Chess(temp.fen())

for(let m of generatedMoves){
finalChess.move(m,{sloppy:true})
}

return temp

}

function generateMoves(){

/* moves already generated from the game */

return generatedMoves

}
