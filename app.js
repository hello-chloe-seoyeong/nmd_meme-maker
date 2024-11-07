const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const lineWidth = document.getElementById("line-width");
const colorInput = document.getElementById("color");
const colors = Array.from(document.getElementsByClassName("color-option"));

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

ctx.lineWidth = lineWidth.value;

let isPaingting = false;

function onMove(event) {
  if (isPaingting) {
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    return;
  }
  ctx.moveTo(event.offsetX.event.offsetY);
}

function startPainting(event) {
  isPaingting = true;
}

function cancelPainting(event) {
  isPaingting = false;
  ctx.beginPath();
}

function onLineWidthChange(event) {
  ctx.lineWidth = event.target.value;
}

function onColorChange(event) {
  ctx.strokeStyle = event.target.value;
  ctx.fillStyle = event.target.value;
}

function onColorClick(event) {
  const colorChip = event.target.dataset.color;
  ctx.strokeStyle = colorChip;
  ctx.fillStyle = colorChip;
  colorInput.value = colorChip;
}

canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);

lineWidth.addEventListener("change", onLineWidthChange);
colorInput.addEventListener("change", onColorChange);
colors.forEach((color) => {
  color.addEventListener("click", onColorClick);
});
