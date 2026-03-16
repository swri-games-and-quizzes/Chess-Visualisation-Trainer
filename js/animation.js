function animateMoves(){

const temp = new Chess(chess.fen())
let i = 0

function step(){

if(i >= generatedMoves.length) return

const move = temp.move(generatedMoves[i], {sloppy:true})

const fromEl = document.querySelector(`[data-square="${move.from}"]`)
const toEl = document.querySelector(`[data-square="${move.to}"]`)
const piece = fromEl.querySelector("img")

if(!piece){
chess.load(temp.fen())
renderBoard()
i++
setTimeout(step,80)
return
}

/* measure BOTH squares before DOM changes */
const startRect = fromEl.getBoundingClientRect()
const endRect = toEl.getBoundingClientRect()

/* create floating clone */
const clone = piece.cloneNode(true)

clone.style.position = "fixed"
clone.style.left = startRect.left + "px"
clone.style.top = startRect.top + "px"
clone.style.width = piece.width + "px"
clone.style.height = piece.height + "px"
clone.style.pointerEvents = "none"
clone.style.zIndex = "9999"

/* lichess-like animation curve */
clone.style.transition = "transform 0.45s cubic-bezier(.25,.8,.25,1)"

document.body.appendChild(clone)

/* hide original piece */
piece.style.visibility = "hidden"

/* straight movement vector */
const dx = endRect.left - startRect.left
const dy = endRect.top - startRect.top

requestAnimationFrame(()=>{
clone.style.transform = `translate(${dx}px, ${dy}px)`
})

setTimeout(()=>{

clone.remove()

/* update board AFTER animation */
chess.load(temp.fen())
renderBoard()

i++
setTimeout(step,80)

},450)

}

step()

}