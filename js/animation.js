function animateMoves() {
  const temp = new Chess(chess.fen());
  let i = 0;
  const MOVE_DELAY_MS = 110;
  const SLIDE_DURATION_MS = 360;
  const EASING = "cubic-bezier(.25,.8,.25,1)";

  function getCastleRookSquares(move) {
    if (!move) return null;
    const flags = typeof move.flags === "string" ? move.flags : "";
    const isCastleByFlags = flags.includes("k") || flags.includes("q");
    const isCastleBySan = move.san === "O-O" || move.san === "O-O-O";
    if (!isCastleByFlags && !isCastleBySan) return null;
    if (move.to === "g1") return { from: "h1", to: "f1" };
    if (move.to === "c1") return { from: "a1", to: "d1" };
    if (move.to === "g8") return { from: "h8", to: "f8" };
    if (move.to === "c8") return { from: "a8", to: "d8" };
    return null;
  }

  function createFloatingClone(pieceImg, fromEl, toEl) {
    if (!pieceImg || !fromEl || !toEl) return null;

    const startImgRect = pieceImg.getBoundingClientRect();
    const endSquareRect = toEl.getBoundingClientRect();

    const cloneWidth = startImgRect.width;
    const cloneHeight = startImgRect.height;

    const startCenterX = startImgRect.left + startImgRect.width / 2;
    const startCenterY = startImgRect.top + startImgRect.height / 2;
    const endCenterX = endSquareRect.left + endSquareRect.width / 2;
    const endCenterY = endSquareRect.top + endSquareRect.height / 2;

    const startLeft = startCenterX - cloneWidth / 2;
    const startTop = startCenterY - cloneHeight / 2;
    const endLeft = endCenterX - cloneWidth / 2;
    const endTop = endCenterY - cloneHeight / 2;

    const clone = pieceImg.cloneNode(true);
    clone.style.position = "fixed";
    clone.style.left = `${startLeft}px`;
    clone.style.top = `${startTop}px`;
    clone.style.width = `${cloneWidth}px`;
    clone.style.height = `${cloneHeight}px`;
    clone.style.pointerEvents = "none";
    clone.style.zIndex = 9999;
    clone.style.transform = "translate(0px, 0px)";
    clone.style.transition = `transform ${SLIDE_DURATION_MS}ms ${EASING}`;
    clone.style.willChange = "transform";

    return { clone, dx: endLeft - startLeft, dy: endTop - startTop };
  }

  function step() {
function animateMoves() {
  const temp = new Chess(chess.fen());
  let i = 0;
  const MOVE_DELAY_MS = 110;
  const SLIDE_DURATION_MS = 360;
  const EASING = "cubic-bezier(.25,.8,.25,1)";

  function getCastleRookSquares(move) {
    if (!move || !move.flags || !move.flags.includes("k")) return null;
    if (move.to === "g1") return { from: "h1", to: "f1" };
    if (move.to === "c1") return { from: "a1", to: "d1" };
    if (move.to === "g8") return { from: "h8", to: "f8" };
    if (move.to === "c8") return { from: "a8", to: "d8" };
    return null;
  }

  function createFloatingClone(pieceImg, fromEl, toEl) {
    if (!pieceImg || !fromEl || !toEl) return null;

    const startImgRect = pieceImg.getBoundingClientRect();
    const endSquareRect = toEl.getBoundingClientRect();

    const cloneWidth = startImgRect.width;
    const cloneHeight = startImgRect.height;

    const startCenterX = startImgRect.left + startImgRect.width / 2;
    const startCenterY = startImgRect.top + startImgRect.height / 2;
    const endCenterX = endSquareRect.left + endSquareRect.width / 2;
    const endCenterY = endSquareRect.top + endSquareRect.height / 2;

    const startLeft = startCenterX - cloneWidth / 2;
    const startTop = startCenterY - cloneHeight / 2;
    const endLeft = endCenterX - cloneWidth / 2;
    const endTop = endCenterY - cloneHeight / 2;

    const clone = pieceImg.cloneNode(true);
    clone.style.position = "fixed";
    clone.style.left = `${startLeft}px`;
    clone.style.top = `${startTop}px`;
    clone.style.width = `${cloneWidth}px`;
    clone.style.height = `${cloneHeight}px`;
    clone.style.pointerEvents = "none";
    clone.style.zIndex = 9999;
    clone.style.transform = "translate(0px, 0px)";
    clone.style.transition = `transform ${SLIDE_DURATION_MS}ms ${EASING}`;
    clone.style.willChange = "transform";

    return { clone, dx: endLeft - startLeft, dy: endTop - startTop };
  }

  function step() {
    if (i >= generatedMoves.length) return;

    try {
      // play next half-move on the temp instance so we know move.from / move.to
      const moveData = generatedMoveData[i];
      const move = moveData
        ? temp.move(
            {
              from: moveData.from,
              to: moveData.to,
              promotion: moveData.promotion
            },
            { sloppy: true }
          )
        : temp.move(generatedMoves[i], { sloppy: true });

      // if a move cannot be parsed, skip animation for it but keep playback moving
      if (!move) {
        i++;
        setTimeout(step, MOVE_DELAY_MS);
        return;
      }

      const fromEl = document.querySelector(`[data-square="${move.from}"]`);
      const toEl = document.querySelector(`[data-square="${move.to}"]`);
      const pieceImg = fromEl ? fromEl.querySelector("img") : null;

      const castleRook = getCastleRookSquares(move);
      const rookFromEl = castleRook ? document.querySelector(`[data-square="${castleRook.from}"]`) : null;
      const rookToEl = castleRook ? document.querySelector(`[data-square="${castleRook.to}"]`) : null;
      const rookImg = rookFromEl ? rookFromEl.querySelector("img") : null;

      const kingAnimation = createFloatingClone(pieceImg, fromEl, toEl);
      const rookAnimation = castleRook ? createFloatingClone(rookImg, rookFromEl, rookToEl) : null;

      // if we cannot animate visually, just commit and continue
      if (!kingAnimation || (castleRook && !rookAnimation)) {
        chess.load(temp.fen());
        renderBoard();
        i++;
        setTimeout(step, MOVE_DELAY_MS);
        return;
      }
      const movingAnimations = [kingAnimation];
      if (rookAnimation) movingAnimations.push(rookAnimation);

      movingAnimations.forEach(({ clone }) => document.body.appendChild(clone));

      // hide original piece while clone is visible (prevents duplicate)
      pieceImg.style.visibility = "hidden";
      if (rookImg) rookImg.style.visibility = "hidden";

      // start animation in next frame
      requestAnimationFrame(() => {
        movingAnimations.forEach(({ clone, dx, dy }) => {
          clone.style.transform = `translate(${dx}px, ${dy}px)`;
        });
      });

      // finish when transition ends (or fallback)
      let settled = false;
      function finishAnimation() {
        if (settled) return;
        settled = true;
        kingAnimation.clone.removeEventListener("transitionend", finishAnimation);

        // remove clone and commit move to real board
        movingAnimations.forEach(({ clone }) => {
          if (clone.parentElement) clone.parentElement.removeChild(clone);
        });

        // commit move to real chess state and re-render
        chess.load(temp.fen());
      const fromEl = document.querySelector(`[data-square="${move.from}"]`);
      const toEl = document.querySelector(`[data-square="${move.to}"]`);
      const pieceImg = fromEl ? fromEl.querySelector("img") : null;

      const castleRook = getCastleRookSquares(move);
      const rookFromEl = castleRook ? document.querySelector(`[data-square="${castleRook.from}"]`) : null;
      const rookToEl = castleRook ? document.querySelector(`[data-square="${castleRook.to}"]`) : null;
      const rookImg = rookFromEl ? rookFromEl.querySelector("img") : null;

      const kingAnimation = createFloatingClone(pieceImg, fromEl, toEl);
      const rookAnimation = castleRook ? createFloatingClone(rookImg, rookFromEl, rookToEl) : null;

      // if we cannot animate visually, just commit and continue
      if (!kingAnimation || (castleRook && !rookAnimation)) {
        chess.load(temp.fen());
        renderBoard();
        i++;
        setTimeout(step, MOVE_DELAY_MS);
        return;
      }
      const movingAnimations = [kingAnimation];
      if (rookAnimation) movingAnimations.push(rookAnimation);

      movingAnimations.forEach(({ clone }) => document.body.appendChild(clone));

      // hide original piece while clone is visible (prevents duplicate)
      pieceImg.style.visibility = "hidden";
      if (rookImg) rookImg.style.visibility = "hidden";

      // start animation in next frame
      requestAnimationFrame(() => {
        movingAnimations.forEach(({ clone, dx, dy }) => {
          clone.style.transform = `translate(${dx}px, ${dy}px)`;
        });
      });

      // finish when transition ends (or fallback)
      let settled = false;
      function finishAnimation() {
        if (settled) return;
        settled = true;
        kingAnimation.clone.removeEventListener("transitionend", finishAnimation);

        // remove clone and commit move to real board
        movingAnimations.forEach(({ clone }) => {
          if (clone.parentElement) clone.parentElement.removeChild(clone);
        });

        // commit move to real chess state and re-render
        chess.load(temp.fen());
        renderBoard();

        i++;
        setTimeout(step, MOVE_DELAY_MS);
      }

      kingAnimation.clone.addEventListener("transitionend", finishAnimation);
      setTimeout(finishAnimation, SLIDE_DURATION_MS + 260);
      }␊
␊
      kingAnimation.clone.addEventListener("transitionend", finishAnimation);
      setTimeout(finishAnimation, SLIDE_DURATION_MS + 260);␊
    } catch (err) {
      console.error("Animation step failed:", err);
      // recover by syncing board and moving to next half-move
      chess.load(temp.fen());
      renderBoard();
      i++;
      setTimeout(step, MOVE_DELAY_MS);
    }
  } // step()

  step();
}
