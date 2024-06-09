const ROOT_DIV = document.getElementById("root");
let data = null;

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
  return initialState.find((piece) => piece.id == id);
};
const square = (color, squareId) => {
  const pieceData = findPiece(squareId);

  return {
    color,
    squareId,
    piecedetail: pieceData ? pieceData.piece : null,
  };
};

const initBoard = () => {
  const squareRow = (rowId) => {
    const squareRowData = [];
    const char = ["a", "b", "c", "d", "e", "f", "g", "h"];
    char.forEach((elem, index) => {
      const color = index % 2 === rowId % 2 ? "white" : "black";
      squareRowData.push(square(color, elem + rowId));
    });

    return squareRowData;
  };

  data = [
    squareRow(8),
    squareRow(7),
    squareRow(6),
    squareRow(5),
    squareRow(4),
    squareRow(3),
    squareRow(2),
    squareRow(1),
  ];

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
      square.innerHTML = `<img class="piece ${square.innerText} " id="${square.id}" src="./Assests/images/${square.innerText}.png" alt="${square.innerText}">`;
      square.style.cursor = "pointer";
    }
  });

  let highlightedSquares = [];
  let highlightSquareState = false;
  function highlightSquare(id) {
    const squareToHighlight = document.getElementById(id);
    squareToHighlight.innerHTML = "";
    const highlightDiv = document.createElement("div");
    squareToHighlight.appendChild(highlightDiv);
    if (squareToHighlight) {
      highlightSquareState = true;
      highlightDiv.classList.add("highlight");
      highlightedSquares.push(highlightDiv);
    }
  }

  function clearHighlights() {
    highlightedSquares.forEach((square) => {
      square.classList.remove("highlight", "highlightSelectedSqaure");
      highlightSquareState = false;
    });
    highlightedSquares = [];
  }
  function highlightSelectedSqaure(id) {
    const squareToHighlight = document.getElementById(id);
    if (squareToHighlight) {
      highlightSquareState = true;
      squareToHighlight.classList.add("highlightSelectedSqaure");
      highlightedSquares.push(squareToHighlight);
    } else {
      return 0;
    }
  }

  // highlighting Feature
  squares.forEach((square) => {
    square.addEventListener("click", (e) => {
      // Clear previously highlighted squares
      clearHighlights();

      const squareId = square.id;
      // console.log(
      //   square.children[0]?.className?.includes("whitePawn")
      // );

      if (
        square.children[0]?.className?.includes("whitePawn")
         //&& highlightSelectedSqaure === false
      ) {
        highlightSelectedSqaure(squareId);
        const highlightSquare1 = `${squareId[0]}${Number(squareId[1]) + 1}`;
        const highlightSquare2 = `${squareId[0]}${Number(squareId[1]) + 2}`;

        highlightSquare(highlightSquare1);
        highlightSquare(highlightSquare2);
        highlightedSquares.forEach((element) => {
          element.addEventListener("click", (e) => {
            const parentSquareId = e.target.parentNode.id;
            const targetSquare = document.getElementById(parentSquareId);
            const clickedELemnet = document.getElementById(squareId);
            if (parentSquareId != squareId) {
              targetSquare.innerHTML = `<img class="piece" id="${parentSquareId}" src="./Assests/images/whitePawn.png" alt="whitePawn">`;
              clickedELemnet.innerHTML = "";
            }
          });
        });
      } else {
        clearHighlights();
      }
    });
  });
};

export { initBoard, data };
