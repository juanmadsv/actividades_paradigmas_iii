"use strict";

// Ocho formas de conseguir tres en línea: filas, columnas y diagonales.
const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];
const cells = Array.from(document.querySelectorAll(".cell"));
const title = document.getElementById("status-title");
const help = document.getElementById("status-help");
const phaseLabel = document.getElementById("phase");
const newRoundButton = document.getElementById("new-round");
const drawButton = document.getElementById("draw");
const drawDialog = document.getElementById("draw-dialog");
const scores = { X: 0, O: 0 };
let board, currentPlayer, placed, selected, finished, winningLine;

// Los índices se convierten a fila/columna para evitar saltos entre bordes.
function areNeighbors(from, to) {
  const rowDistance = Math.abs(Math.floor(from / 3) - Math.floor(to / 3));
  const columnDistance = Math.abs((from % 3) - (to % 3));
  return rowDistance + columnDistance === 1;
}

function isMovingPhase() {
  return placed.X === 3 && placed.O === 3;
}

function findWinningLine(player) {
  return WINNING_LINES.find(line => line.every(index => board[index] === player));
}

function availableDestinations(from) {
  return board.reduce((destinations, value, index) => {
    if (value === null && areNeighbors(from, index)) destinations.push(index);
    return destinations;
  }, []);
}

function render(message = "") {
  const moving = isMovingPhase();
  const destinations = selected === null ? [] : availableDestinations(selected);
  cells.forEach((cell, index) => {
    cell.textContent = board[index] || "";
    cell.classList.toggle("o", board[index] === "O");
    cell.classList.toggle("selected", selected === index);
    cell.classList.toggle("target", destinations.includes(index));
    cell.classList.toggle("winner", winningLine.includes(index));
    cell.disabled = finished;
    const position = `Fila ${Math.floor(index / 3) + 1}, columna ${index % 3 + 1}`;
    const hint = destinations.includes(index) ? ", destino disponible" : "";
    cell.setAttribute("aria-label", `${position}: ${board[index] || "vacía"}${hint}`);
    cell.setAttribute("aria-pressed", String(selected === index));
  });
  for (const player of ["X", "O"]) {
    document.getElementById(`player-${player.toLowerCase()}`).classList.toggle("active", !finished && currentPlayer === player);
    document.getElementById(`score-${player.toLowerCase()}`).textContent = scores[player];
    const remaining = 3 - placed[player];
    document.getElementById(`reserve-${player.toLowerCase()}`).textContent = remaining === 0
      ? "3 fichas en el tablero"
      : `${remaining} ${remaining === 1 ? "ficha por colocar" : "fichas por colocar"}`;
  }
  phaseLabel.textContent = finished ? "PARTIDA TERMINADA" : moving ? "02 / MOVER" : "01 / COLOCAR";
  drawButton.hidden = !moving || finished;
  document.getElementById("draw-note").hidden = drawButton.hidden;
  newRoundButton.textContent = finished ? "Jugar otra vez ↗" : "Reiniciar partida ↗";
  if (!finished) {
    title.textContent = `Turno de ${currentPlayer}`;
    help.textContent = message || (moving
      ? selected === null ? "Elegí una ficha propia para moverla." : "Elegí un destino marcado o volvé a tocar la ficha para cancelar."
      : "Elegí una casilla vacía para colocar tu ficha.");
  }
}

function completeTurn() {
  selected = null;
  const line = findWinningLine(currentPlayer);
  if (line) {
    finished = true;
    winningLine = line;
    scores[currentPlayer] += 1;
    title.textContent = `¡Ganó ${currentPlayer}!`;
    help.textContent = "Tres en línea. ¿Jugamos otra partida?";
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
  }
  render();
}

function play(index) {
  if (finished || !Number.isInteger(index) || index < 0 || index > 8) return;
  if (!isMovingPhase()) {
    if (board[index] !== null) {
      render("Esa casilla está ocupada. Elegí una vacía.");
      return;
    }
    board[index] = currentPlayer;
    placed[currentPlayer] += 1;
    completeTurn();
    return;
  }
  if (board[index] === currentPlayer) {
    selected = selected === index ? null : index;
    const blocked = selected !== null && availableDestinations(selected).length === 0;
    render(blocked ? "Esa ficha no tiene un destino libre vecino. Elegí otra ficha." : "");
    return;
  }
  if (board[index] !== null) {
    render("Solo podés mover tus propias fichas.");
    return;
  }
  if (selected === null) {
    render("Primero elegí una de tus fichas.");
    return;
  }
  if (!areNeighbors(selected, index)) {
    render("El destino debe ser vecino horizontal o vertical. Elegí un punto marcado.");
    return;
  }
  board[selected] = null;
  board[index] = currentPlayer;
  completeTurn();
}

function startRound() {
  board = Array(9).fill(null);
  currentPlayer = "X";
  placed = { X: 0, O: 0 };
  selected = null;
  finished = false;
  winningLine = [];
  if (drawDialog.open) drawDialog.close();
  render();
}

// Todos los eventos se registran en JS, sin atributos onclick en el HTML.
cells.forEach((cell, index) => cell.addEventListener("click", () => play(index)));
newRoundButton.addEventListener("click", startRound);
document.getElementById("reset-scores").addEventListener("click", () => {
  scores.X = 0;
  scores.O = 0;
  render();
});
drawButton.addEventListener("click", () => drawDialog.showModal());
document.getElementById("cancel-draw").addEventListener("click", () => drawDialog.close());
document.getElementById("accept-draw").addEventListener("click", () => {
  if (!finished && isMovingPhase()) {
    finished = true;
    selected = null;
    title.textContent = "Empate acordado";
    help.textContent = "La partida terminó por acuerdo de ambos jugadores.";
    render();
  }
  drawDialog.close();
});
startRound();
