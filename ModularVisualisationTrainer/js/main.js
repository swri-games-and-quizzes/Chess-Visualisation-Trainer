const chess=new Chess()

let finalChess=null
let selectedSquares=[]
let correctSquares=[]
let movedPieces=[]
let generatedMoves=[]

let startMoveNumber=1
let startTurn="w"

function showCard(message,type){

const card=document.createElement("div")
card.classList.add("notification")
card.classList.add(type)

if(type==="correct"){
card.textContent="✓ "+message
}else{
card.textContent="✗ "+message
}

document.body.appendChild(card)

setTimeout(()=>card.classList.add("show"),10)

setTimeout(()=>{
card.classList.remove("show")
setTimeout(()=>card.remove(),300)
},2000)

}

function highlightResults(){

const squares=document.querySelectorAll(".square")

squares.forEach(sq=>{

const coord=sq.dataset.square

if(correctSquares.includes(coord)){
sq.classList.add("correctSquare")
}

if(selectedSquares.includes(coord) && !correctSquares.includes(coord)){
sq.classList.add("wrongSquare")
}

})

}

function startPosition(){

const startPos=getRandomGamePosition()

chess.load(startPos.fen())

selectedSquares=[]
correctSquares=[]

renderBoard()

const moves=generateMoves()

displayMoves(moves)

document.getElementById("question").textContent=""

document.getElementById("submitBtn").textContent="Submit"

document.getElementById("visualisedBtn").style.display="inline-block"

}

function checkAnswer(){

const btn=document.getElementById("submitBtn")

if(btn.textContent==="Next"){

startPosition()
return

}

/* FIX: prevent submit with no squares selected */

if(selectedSquares.length===0){
showCard("Select at least one square","wrong")
return
}

const user=[...selectedSquares].sort().join()
const correct=[...correctSquares].sort().join()

if(user===correct){
showCard("Correct!","correct")
}else{
showCard("Correct: "+correctSquares.join(", "),"wrong")
}

highlightResults()

document.getElementById("question").textContent=""
document.getElementById("visualisedBtn").style.display="none"

setTimeout(()=>{

animateMoves()

btn.textContent="Next"

},1200)

}

startPosition()