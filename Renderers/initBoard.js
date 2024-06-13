const ROOT_DIV = document.getElementById("root");

const playerData = [{ player1: "white" }, { player2: "black" }];

let whosTurn = "white";

let InitialkillData = {
  white: [],
  black: [],
};

const initialState = [
  { id: "a2", color: "white", piece: "whitePawn" },
  { id: "a1", color: "white", piece: "whiteRook" },
  { id: "b2", color: "white", piece: "whitePawn" },
  { id: "b1", color: "white", piece: "whiteKnight" },
  { id: "c2", color: "white", piece: "whitePawn" },
  { id: "c1", color: "white", piece: "whiteBishop" },
  { id: "d2", color: "white", piece: "whitePawn" },
  { id: "d1", color: "white", piece: "whiteQueen" },
  { id: "e2", color: "white", piece: "whitePawn" },
  { id: "e1", color: "white", piece: "whiteKing" },
  { id: "f2", color: "white", piece: "whitePawn" },
  { id: "f1", color: "white", piece: "whiteBishop" },
  { id: "g2", color: "white", piece: "whitePawn" },
  { id: "g1", color: "white", piece: "whiteKnight" },
  { id: "h2", color: "white", piece: "whitePawn" },
  { id: "h1", color: "white", piece: "whiteRook" },
  { id: "a7", color: "black", piece: "blackPawn" },
  { id: "a8", color: "black", piece: "blackRook" },
  { id: "b7", color: "black", piece: "blackPawn" },
  { id: "b8", color: "black", piece: "blackKnight" },
  { id: "c7", color: "black", piece: "blackPawn" },
  { id: "c8", color: "black", piece: "blackBishop" },
  { id: "d7", color: "black", piece: "blackPawn" },
  { id: "d8", color: "black", piece: "blackQueen" },
  { id: "e7", color: "black", piece: "blackPawn" },
  { id: "e8", color: "black", piece: "blackKing" },
  { id: "f7", color: "black", piece: "blackPawn" },
  { id: "f8", color: "black", piece: "blackBishop" },
  { id: "g7", color: "black", piece: "blackPawn" },
  { id: "g8", color: "black", piece: "blackKnight" },
  { id: "h7", color: "black", piece: "blackPawn" },
  { id: "h8", color: "black", piece: "blackRook" },
];

if (!localStorage.getItem("kill")) {
  localStorage.setItem("kill", JSON.stringify(InitialkillData));
}

let killedData = JSON.parse(localStorage.getItem("kill"));

if (!localStorage.getItem("data")) {
  localStorage.setItem("data", JSON.stringify(initialState));
}

const currentGameState = JSON.parse(localStorage.getItem("data"));

const findPiece = (id) => {
  // console.log("ID FIRST",id);
  const data = currentGameState.find((piece) => piece.id === id) || null;
  // console.log("DATA",data);
  return data;
};

const square = (color, squareId) => {
  const pieceData = findPiece(squareId);
  return {
    color,
    squareId,
    piecedetail: pieceData ? pieceData.piece : null,
  };
};

const squareRow = (rowId) => {
  const squareRowData = [];
  const char = ["a", "b", "c", "d", "e", "f", "g", "h"];
  char.forEach((elem, index) => {
    const color = index % 2 === rowId % 2 ? "white" : "black";
    squareRowData.push(square(color, elem + rowId));
  });
  return squareRowData;
};

const initBoard = () => {
  const data = [
    squareRow(8),
    squareRow(7),
    squareRow(6),
    squareRow(5),
    squareRow(4),
    squareRow(3),
    squareRow(2),
    squareRow(1),
  ];
  // console.log(data);
  const fragment = document.createDocumentFragment();

  data.forEach((element) => {
    const rowElem = document.createElement("div");
    rowElem.classList.add("squareParentDiv");
    element.forEach((square) => {
      const squareSpan = document.createElement("span");
      squareSpan.innerText = square.piecedetail;
      squareSpan.id = square.squareId;
      squareSpan.classList.add(square.color, "square");
      rowElem.appendChild(squareSpan);
    });
    fragment.appendChild(rowElem);
  });

  ROOT_DIV.appendChild(fragment);

  // kirat-li // kirat_tw

  const squares = document.querySelectorAll(".square");

  squares.forEach((square) => {
    if (square.innerText.length !== 0) {
      square.innerHTML = `<img class="piece ${square.innerText}" id="${square.id}" src="./Assests/images/${square.innerText}.png" alt="${square.innerText}">`;
      square.style.cursor = "pointer";
    }
  });

  let highlightedSquares = [];
  let highlightedDangerSquares = [];

  function highlightSquare(id) {
    const squareToHighlight = document.getElementById(id);
    if (squareToHighlight) {
      squareToHighlight.classList.add("highlight");
      highlightedSquares.push(squareToHighlight);
    }
  }
  function highlightDangerSquare(id) {
    const squareToHighlight = document.getElementById(id);
    if (squareToHighlight) {
      squareToHighlight.classList.add("danger");
      highlightedDangerSquares.push(squareToHighlight);
    }
  }

  function clearHighlights() {
    highlightedSquares.forEach((square) => {
      square.classList.remove("danger", "highlight", "highlightSelectedSquare");
    });
    highlightedDangerSquares.forEach((square) => {
      square.classList.remove("danger", "highlight", "highlightSelectedSquare");
    });
    highlightedDangerSquares = [];
    highlightedSquares = [];
  }

  function highlightSelectedSquare(id) {
    const squareToHighlight = document.getElementById(id);
    if (squareToHighlight) {
      squareToHighlight.classList.add("highlightSelectedSquare");
      highlightedSquares.push(squareToHighlight);
    }
  }

  function handlePieceMovement(pieceType, currentSquareId) {
    let possibleMoves = [];
    let dangerMoves = [];

    function checkForDangerOrEmpty(id, enemyColor) {
      const targetSquare = document.getElementById(id);

      if (targetSquare) {
        const pieceAtTarget = targetSquare.childNodes[0];

        if (pieceAtTarget) {
          if (pieceAtTarget.classList[1].includes(enemyColor)) {
            dangerMoves.push(id);
          }
          return true; // Stop further movement in this direction
        } else {
          possibleMoves.push(id);
        }
      }
      return false; // Continue movement in this direction
    }

    let currentSelectedPawnState;

    currentGameState.map((element, index) => {
      if (element.id === currentSquareId) {
        if (element.moved) {
          currentSelectedPawnState = true;
        } else {
          currentSelectedPawnState = false;
        }
      }
    });

    if (pieceType === "whitePawn") {
      const forwardSquareId = `${currentSquareId[0]}${
        Number(currentSquareId[1]) + 1
      }`;
      checkForDangerOrEmpty(forwardSquareId, "black");

      const charCode = currentSquareId[0].charCodeAt(0);

      let char1 = String.fromCharCode(charCode - 1);
      let char2 = String.fromCharCode(charCode + 1);

      if (charCode + 1 > 104) {
        char2 = null;
      }
      if (charCode - 1 < 97) {
        char1 = null;
      }
      let targetid1 = char1
        ? `${char1}${Number(currentSquareId[1]) + 1}`
        : null;
      let targetid2 = char2
        ? `${char2}${Number(currentSquareId[1]) + 1}`
        : null;

      const targetIds = [targetid1, targetid2];

      targetIds.map((elementId) => {
        if (elementId) {
          const targetChild = document?.getElementById(elementId)?.childNodes;
          if (targetChild[0]?.classList[1]?.includes("black")) {
            dangerMoves.push(elementId);
          }
        }
      });

      if (currentSelectedPawnState === false) {
        const forwardSquareId2 = `${currentSquareId[0]}${
          Number(currentSquareId[1]) + 2
        }`;
        checkForDangerOrEmpty(forwardSquareId2, "black");
      }
    } else if (pieceType === "blackPawn") {
      const forwardSquareId = `${currentSquareId[0]}${
        Number(currentSquareId[1]) - 1
      }`;
      checkForDangerOrEmpty(forwardSquareId, "white");

      const charCode = currentSquareId[0].charCodeAt(0);

      let char1 = String.fromCharCode(charCode - 1);
      let char2 = String.fromCharCode(charCode + 1);

      if (charCode + 1 > 104) {
        char2 = null;
      }
      if (charCode - 1 < 97) {
        char1 = null;
      }
      let targetid1 = char1
        ? `${char1}${Number(currentSquareId[1]) - 1}`
        : null;
      let targetid2 = char2
        ? `${char2}${Number(currentSquareId[1]) - 1}`
        : null;

      const targetIds = [targetid1, targetid2];

      targetIds.map((elementId) => {
        if (elementId) {
          const targetChild = document?.getElementById(elementId)?.childNodes;
          if (targetChild[0]?.classList[1]?.includes("white")) {
            dangerMoves.push(elementId);
          }
        }
      });

      if (!currentSelectedPawnState) {
        const forwardSquareId2 = `${currentSquareId[0]}${
          Number(currentSquareId[1]) - 2
        }`;
        checkForDangerOrEmpty(forwardSquareId2, "white");
      }
    } else if (pieceType === "whiteRook") {
      const directions = [
        { dx: 1, dy: 0 }, // Move right
        { dx: -1, dy: 0 }, // Move left
        { dx: 0, dy: 1 }, // Move up
        { dx: 0, dy: -1 }, // Move down
      ];

      directions.forEach((direction) => {
        let x = currentSquareId[0].charCodeAt(0);
        let y = Number(currentSquareId[1]);
        console.log("x and y", x, "..", y);
        while (true) {
          console.log(x, "and", y);
          x += direction.dx;
          y += direction.dy;

          if (x < 97 || x > 104 || y < 1 || y > 8) {
            break;
          }

          const targetId = String.fromCharCode(x) + y;
          if (checkForDangerOrEmpty(targetId, "black")) {
            break;
          }
        }
      });
    } else if (pieceType === "blackRook") {
      const directions = [
        { dx: 1, dy: 0 }, // Move right
        { dx: -1, dy: 0 }, // Move left
        { dx: 0, dy: 1 }, // Move up
        { dx: 0, dy: -1 }, // Move down
      ];

      directions.forEach((direction) => {
        let x = currentSquareId[0].charCodeAt(0);
        let y = Number(currentSquareId[1]);
        while (true) {
          x += direction.dx;
          y += direction.dy;

          if (x < 97 || x > 104 || y < 1 || y > 8) {
            break;
          }

          const targetId = String.fromCharCode(x) + y;
          if (checkForDangerOrEmpty(targetId, "white")) {
            break;
          }
        }
      });
    }

    return { possibleMoves, dangerMoves };
  }

  // function rotateBoard() {
  //   // if (whosTurn === "black") {
  //   ROOT_DIV.style.transform = "rotate(180deg)";
  //   document.querySelectorAll(".piece").forEach((piece) => {
  //     piece.style.transform = "rotate(180deg)";
  //   });
  //   // }
  //   //  else {
  //   //   ROOT_DIV.style.transform = "rotate(0deg)";
  //   //   document.querySelectorAll(".piece").forEach((piece) => {
  //   //     piece.style.transform = "rotate(0deg)";
  //   //   });
  //   // }
  // }

  function saveToLocalStorage(
    targetSquareId,
    targetSquare,
    clickedElementId,
    color
  ) {
    const Piece = findPiece(targetSquareId);
    if (Piece == null) {
      currentGameState.push({
        id: targetSquareId,
        color: color,
        piece: targetSquare.childNodes[0].classList[1],
      });
      const findOne = findPiece(clickedElementId);
      findOne.piece = null;
      findOne.color = "";
      localStorage.setItem("data", JSON.stringify(currentGameState));
    } else {
      // Killing Or Terminating Other Piece Feature Goes From Here

      currentGameState.map((element, index) => {
        if (element.id === targetSquareId) {
          currentGameState[index] = {
            id: targetSquareId,
            color: color,
            piece: targetSquare.childNodes[0].classList[1],
          };
        }
      });
    }
  }

  // Initialize the game state from localStorage or set to white's turn
  let whosTurn = localStorage.getItem("whosTurn") || "white";
  let isBoardRotated = whosTurn === "black";

  // store the rotatation history when it is refreshed
  document.addEventListener("DOMContentLoaded", () => {
    const rotation = isBoardRotated ? "rotate(180deg)" : "rotate(0deg)";
    ROOT_DIV.style.transform = rotation;
    document.querySelectorAll(".piece").forEach((piece) => {
      piece.style.transform = rotation;
    });
  });

  squares.forEach((square) => {
    square.addEventListener("click", (e) => {
      clearHighlights();
      const squareId = square.id;
      const piece = square.querySelector(".piece");

      if (piece) {
        const pieceType = piece.classList[1];
        const pieceColor = pieceType.includes("black") ? "black" : "white";

        // Restrict move based on current turn
        if (pieceColor !== whosTurn) {
          return; // Not the player's turn, do nothing
        }

        highlightSelectedSquare(squareId);
        const { possibleMoves, dangerMoves } = handlePieceMovement(
          pieceType,
          squareId
        );

        possibleMoves?.forEach((move) => highlightSquare(move));

        let dangerSquareIds = dangerMoves;
        dangerMoves?.forEach((move) => highlightDangerSquare(move));
        const clickedElementId = e.target?.id;

        highlightedSquares.forEach((highlightedSquare) => {
          highlightedSquare.addEventListener("click", (e) => {
            const targetSquare = e.currentTarget;
            const targetSquareId = targetSquare.id;
            let currentSelectedPiece = null;
            const selectedPiece = document.querySelector(`#${squareId} .piece`);
            currentSelectedPiece = selectedPiece;

            if (currentSelectedPiece != null) {
              targetSquare.innerHTML = "";
              targetSquare.appendChild(currentSelectedPiece);
              clearHighlights();
              currentSelectedPiece.classList.add("moved");

              let targetElement = e.target?.childNodes[0];
              if (targetElement?.id) {
                targetElement.id = e?.target?.id;
              }

              currentSelectedPiece = null;
              const color = selectedPiece?.classList[1]?.includes("black")
                ? "black"
                : "white";

              saveToLocalStorage(
                targetSquareId,
                targetSquare,
                clickedElementId,
                color
              );
              currentGameState.map((element, index) => {
                if (element.id === e.target.id) {
                  element.moved = true;
                }
              });
              clearHighlights();
              whosTurn = whosTurn === "white" ? "black" : "white";
              rotateBoard();
              localStorage.setItem("whosTurn", whosTurn);
              localStorage.setItem("data", JSON.stringify(currentGameState));
            }
          });
        });

        highlightedDangerSquares.forEach((dangerSquare) => {
          const selectedPiece = document.querySelector(`#${squareId} .piece`);
          const color = selectedPiece?.classList[1]?.includes("black")
            ? "black"
            : "white";

          dangerSquare.addEventListener("click", (e) => {
            clearHighlights();

            let previousPieceId = piece?.id;
            piece.id = e.target?.parentNode?.id;

            e.target.parentNode.innerHTML = piece?.parentNode?.innerHTML;
            if (piece?.parentNode?.innerHTML) {
              piece.parentNode.innerHTML = "";
            }

            let clickedSquare = findPiece(clickedElementId);
            let targetPiece = findPiece(e.target.id);

            if (targetPiece?.color && targetPiece?.piece) {
              if (color === "white") {
                killedData.black.push({
                  killed: targetPiece?.piece,
                  killedAt: targetPiece?.id,
                  killedBy: pieceType,
                });
              } else {
                killedData.white.push({
                  killed: targetPiece?.piece,
                  killedAt: targetPiece?.id,
                  killedBy: pieceType,
                });
              }
              localStorage.setItem("kill", JSON.stringify(killedData));

              targetPiece.color = color;
              targetPiece.piece = pieceType;

              clickedSquare.color = "";
              clickedSquare.piece = null;

              localStorage.setItem("data", JSON.stringify(currentGameState));
            }

            currentGameState.forEach((element) => {
              if (element.id === piece.id) {
                element.color = color;
                element.piece = pieceType;
                element.moved = true;
              } else if (element.id === previousPieceId) {
                element.piece = null;
                element.color = "";
              }
            });

            localStorage.setItem("data", JSON.stringify(currentGameState));
            clearHighlights();
            whosTurn = whosTurn === "white" ? "black" : "white";
            rotateBoard();
            localStorage.setItem("whosTurn", whosTurn);
          });
        });
      }
    });
  });

  function rotateBoard() {
    isBoardRotated = !isBoardRotated;
    const rotation = isBoardRotated ? "rotate(180deg)" : "rotate(0deg)";
    ROOT_DIV.style.transform = rotation;
    document.querySelectorAll(".piece").forEach((piece) => {
      piece.style.transform = rotation;
    });
  }

};

export { initBoard };
