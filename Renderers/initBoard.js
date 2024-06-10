const ROOT_DIV = document.getElementById("root");

const playerData = [{ player1: "white" }, { player2: "black" }];

let whosTurn = "white";

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

const findPiece = (id) => {
  return initialState.find((piece) => piece.id === id);
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
  console.log(data);
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

  const squares = document.querySelectorAll(".square");

  squares.forEach((square) => {
    if (square.innerText.length !== 0) {
      square.innerHTML = `<img class="piece ${square.innerText}" id="${square.id}" src="./Assests/images/${square.innerText}.png" alt="${square.innerText}">`;
      square.style.cursor = "pointer";
    }
  });

  let highlightedSquares = [];

  function highlightSquare(id) {
    const squareToHighlight = document.getElementById(id);
    if (squareToHighlight) {
      squareToHighlight.classList.add("highlight");
      highlightedSquares.push(squareToHighlight);
    }
  }

  function clearHighlights() {
    highlightedSquares.forEach((square) => {
      square.classList.remove("highlight", "highlightSelectedSquare");
    });
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

    const currentSelectedPawnState = document
      .getElementById(currentSquareId)
      .childNodes[0]?.className?.includes("moved");

    switch (pieceType) {
      case "whitePawn":
        possibleMoves.push(
          `${currentSquareId[0]}${Number(currentSquareId[1]) + 1}`
        );
        if (!currentSelectedPawnState) {
          possibleMoves.push(
            `${currentSquareId[0]}${Number(currentSquareId[1]) + 2}`
          );
        } 
        
        break;
      // Add cases for other pieces
    }
    return possibleMoves;
  }

  function removeClickListeners() {
    squares.forEach((square) => {
      const newSquare = square.cloneNode(true);
      square.parentNode.replaceChild(newSquare, square);
    });
  }

  function rotateBoard() {
    if (whosTurn === "black") {
      ROOT_DIV.style.transform = "rotate(180deg)";
      document.querySelectorAll(".piece").forEach((piece) => {
        piece.style.transform = "rotate(180deg)";
      });
    } else {
      ROOT_DIV.style.transform = "rotate(0deg)";
      document.querySelectorAll(".piece").forEach((piece) => {
        piece.style.transform = "rotate(0deg)";
      });
    }
  }

  squares.forEach((square) => {
    square.addEventListener("click", (e) => {
      // removeClickListeners();
      clearHighlights();
      const squareId = square.id;
      const piece = square.querySelector(".piece");

      if (piece) {
        const pieceType = piece.classList[1];
        highlightSelectedSquare(squareId);
        const possibleMoves = handlePieceMovement(pieceType, squareId);

        possibleMoves?.forEach((move) => highlightSquare(move));

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
              currentSelectedPiece = null;
              //   whosTurn = whosTurn === "white" ? "black" : "white";
              //   // rotateBoard();
            }
          });
        });
      }
    });
  });

  // rotateBoard();
};

export { initBoard };
