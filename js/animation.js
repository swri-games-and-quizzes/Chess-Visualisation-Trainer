function animateMoves() {
  const temp = new Chess(chess.fen());
  let i = 0;
  const MOVE_DELAY_MS = 110;
  const SLIDE_DURATION_MS = 360;

  function step() {
    if (i >= generatedMoves.length) return;

    try {
      // play next half-move on the temp instance so we know move.from / move.to
      const move = temp.move(generatedMoves[i], { sloppy: true });

      // if a move cannot be parsed, skip animation for it but keep playback moving
      if (!move) {
        i++;
        setTimeout(step, MOVE_DELAY_MS);
        return;
      }

      const fromEl = document.querySelector(`[data-square="${move.from}"]`);
      const toEl = document.querySelector(`[data-square="${move.to}"]`);
      const pieceImg = fromEl ? fromEl.querySelector("img") : null;

      // if we cannot animate visually, just commit and continue
      if (!fromEl || !toEl || !pieceImg) {
        chess.load(temp.fen());
        renderBoard();
        i++;
        setTimeout(step, MOVE_DELAY_MS);
        return;
      }

      // Measure BEFORE any DOM changes (center-to-center)
      const startImgRect = pieceImg.getBoundingClientRect();
      const endSquareRect = toEl.getBoundingClientRect();

      // Determine clone size to match the visual piece exactly
      const cloneWidth = startImgRect.width;
      const cloneHeight = startImgRect.height;

      // Center-based coordinates
      const startCenterX = startImgRect.left + startImgRect.width / 2;
      const startCenterY = startImgRect.top + startImgRect.height / 2;

      const endCenterX = endSquareRect.left + endSquareRect.width / 2;
      const endCenterY = endSquareRect.top + endSquareRect.height / 2;

      const startLeft = startCenterX - cloneWidth / 2;
      const startTop = startCenterY - cloneHeight / 2;
      const endLeft = endCenterX - cloneWidth / 2;
      const endTop = endCenterY - cloneHeight / 2;

      const dx = endLeft - startLeft;
      const dy = endTop - startTop;

      // create floating clone
      const clone = pieceImg.cloneNode(true);
      clone.style.position = "fixed";
      clone.style.left = `${startLeft}px`;
      clone.style.top = `${startTop}px`;
      clone.style.width = `${cloneWidth}px`;
      clone.style.height = `${cloneHeight}px`;
      clone.style.pointerEvents = "none";
      clone.style.zIndex = 9999;
      clone.style.transform = "translate(0px, 0px)";
      clone.style.transition = `transform ${SLIDE_DURATION_MS}ms cubic-bezier(.25,.8,.25,1)`;
      clone.style.willChange = "transform";

      document.body.appendChild(clone);

      // hide original piece while clone is visible (prevents duplicate)
      pieceImg.style.visibility = "hidden";

      // start animation in next frame
      requestAnimationFrame(() => {
        clone.style.transform = `translate(${dx}px, ${dy}px)`;
      });

      // finish when transition ends (or fallback)
      let settled = false;
      function finishAnimation() {
        if (settled) return;
        settled = true;
        clone.removeEventListener("transitionend", finishAnimation);

        // remove clone and commit move to real board
        if (clone.parentElement) clone.parentElement.removeChild(clone);

        // commit move to real chess state and re-render
        chess.load(temp.fen());
        renderBoard();

        i++;
        setTimeout(step, MOVE_DELAY_MS);
      }

      clone.addEventListener("transitionend", finishAnimation);
      setTimeout(finishAnimation, SLIDE_DURATION_MS + 260);
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
