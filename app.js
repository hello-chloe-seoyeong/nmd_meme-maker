const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const lineWidth = document.getElementById("line-width");
const colorInput = document.getElementById("color");
const colors = Array.from(document.getElementsByClassName("color-option"));
const modeBtn = document.getElementById("mode-btn");
const resetBtn = document.getElementById("reset-btn");
const eraserBtn = document.getElementById("eraser-btn");
const fileInput = document.getElementById("file");
const textInput = document.getElementById("text");
const saveBtn = document.getElementById("save");

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

ctx.lineWidth = lineWidth.value;
ctx.lineCap = "round"; // 그려지는 라인 둥글게 만드어주기

let isPaingting = false;
let isFilling = false;

function onMove(event) {
  if (isPaingting) {
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    return;
  }
  ctx.moveTo(event.offsetX, event.offsetY);
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

function onModeChange() {
  if (isFilling) {
    isFilling = false;
    modeBtn.innerText = "Fill";
  } else {
    isFilling = true;
    modeBtn.innerText = "Draw";
  }
}

function onResetCanvas() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function onEraserBrush() {
  ctx.strokeStyle = "white";
  isFilling = false;
  modeBtn.innerText = "Fill";
}

function onCanvasClick() {
  if (isFilling) {
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}

function onFileChange(event) {
  const file = event.target.files[0];
  const url = URL.createObjectURL(file); // 이 url이 브라우저가 자신의 메모리에 있는 파일을 드러내는 방식, input file에서 선택을 실행한(?) 브라우저에서만 접근 가능, 예를 들어서 크롬에서 파일 선택하고 얻은 이 주소로 파폭에서 열어본다? 안열려. 정보가 크롬에만 있는 거거든

  const image = new Image(); // html에서 <img src="" /> 하는 거랑 같은거
  image.src = url;
  image.onload = function () {
    ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  };
  fileInput.value = null;
}

/*
1. canvas.addEventListener("mousemove", onMove); 이벤트 리스터로 하면 같은 이벤트 안에 많은 event listener들을 추가 가능하고, 같은 이벤트에서 event listener들을 삭제도 가능
2. canvas.onmousemove = onMove;
*/

function onDoubleClick(event) {
  const text = textInput.value;
  if (text !== "") {
    ctx.save(); // save()하는 시점. 현재 상태와 선택들을 저장해둠
    ctx.lineWidth = 1; // text는 lineWidth 1일때만 잘 보여서 이렇게 세팅은 했는데, 다시 선을 그릴때는 세팅된 굵기로 그려야하자나 그래서 save, restore 사용
    ctx.font = "50px serif"; // size family
    ctx.fillText(text, event.offsetX, event.offsetY); // fillText, strokeText
    ctx.restore(); // 저장했던거 다시 불러오기, save()와 restore() 사이 내용은 저장되지 않아
  }
}

function onSaveClick() {
  const url = canvas.toDataURL();
  const a = document.createElement("a");
  a.href = url;
  a.download = "myDrawing.png";
  a.click();
}

canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);
canvas.addEventListener("click", onCanvasClick);
canvas.addEventListener("dblclick", onDoubleClick);

lineWidth.addEventListener("change", onLineWidthChange);
colorInput.addEventListener("change", onColorChange);
colors.forEach((color) => {
  color.addEventListener("click", onColorClick);
});

modeBtn.addEventListener("click", onModeChange);
resetBtn.addEventListener("click", onResetCanvas);
eraserBtn.addEventListener("click", onEraserBrush);
fileInput.addEventListener("change", onFileChange);
saveBtn.addEventListener("click", onSaveClick);
