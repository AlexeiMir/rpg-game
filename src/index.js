import './index.scss';
import SenseiWalk from './assets/Male-4-Walk.png';

const canvas = document.getElementById('game');
const loading = document.getElementById('loading');
const { width: widthCanvas, height: heightCanvas } = canvas.getBoundingClientRect();
const ctx = canvas.getContext('2d');
const spriteW = 48;
const spriteH = 48;
const shots = 3;
let cycle = 0;
let bottomPressed = false;
let upPressed = false;
let rightPressed = false;
let leftPressed = false;
let pY = (heightCanvas - spriteH) / 2;
let pX = (widthCanvas - spriteW) / 2;
let col = 0;

function keyDownHandler(e) {
  switch (e.key) {
    case 'ArrowDown':
    case 'Down':
      bottomPressed = true;
      break;
    case 'ArrowUp':
    case 'Up':
      upPressed = true;
      break;
    case 'ArrowRight':
    case 'Right':
      rightPressed = true;
      break;
    case 'ArrowLeft':
    case 'Left':
      leftPressed = true;
      break;
    default:
      break;
  }
}
function keyUpHandler(e) {
  switch (e.key) {
    case 'ArrowDown':
    case 'Down':
      bottomPressed = false;
      break;
    case 'ArrowUp':
    case 'Up':
      upPressed = false;
      break;
    case 'ArrowRight':
    case 'Right':
      rightPressed = false;
      break;
    case 'ArrowLeft':
    case 'Left':
      leftPressed = false;
      break;
    default:
      break;
  }
}
function brick(x, y) {
  ctx.fillStyle = '#9C4A00';
  ctx.fillRect(x, y, 48, 48);
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#636363';
  ctx.strokeRect(x, y, 48, 48);
}

function tree(x, y) {
  ctx.fillStyle = 'green';
  ctx.strokeStyle = 'green';
  ctx.fillStyle = 'green';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 30, y - 30);
  ctx.lineTo(x + 60, y);
  ctx.lineTo(x + 45, y);
  ctx.lineTo(x + 75, y + 30);
  ctx.lineTo(x - 15, y + 30);
  ctx.lineTo(x + 15, y);
  ctx.lineTo(x, y);
  ctx.fill();
  ctx.fillStyle = 'rgb(145,121,100)';
  ctx.fillRect(x + 20, y + 30, 20, 20);
  ctx.stroke();
  ctx.closePath();
}

function mushroom(x, y) {
  ctx.moveTo(x, y);
  ctx.strokeStyle = '#9C4A00';
  ctx.fillStyle = '#9C4A00';
  ctx.arc(x - 30, y, 30, Math.PI, 6.35);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = 'rgb(145,121,100)';
  ctx.fillRect(x - 39, y + 2, 20, 20);
}

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

const img = document.createElement('img');
img.src = SenseiWalk;

img.addEventListener('load', () => {
  setTimeout(() => {
    loading.style.transition = 'all 0.1s ease';
    loading.style.visibility = 'hidden';
    loading.style.opacity = 'none';
  }, 50);

  function getCycle() {
    return (cycle + 1) % shots;
  }

  setInterval(() => {
    if (bottomPressed && pY <= heightCanvas - spriteH) {
      pY += 10;
      cycle = getCycle();
      col = 0;
    }
    if (upPressed && pY >= 0) {
      pY -= 10;
      cycle = getCycle();
      col = spriteH * 3;
    }
    if (rightPressed && pX <= widthCanvas - spriteW) {
      pX += 10;
      cycle = getCycle();
      col = spriteH * 2;
    }
    if (leftPressed && pX > 0) {
      pX -= 10;
      cycle = getCycle();
      col = spriteH;
    }
    ctx.clearRect(0, 0, 600, 600);
    ctx.drawImage(img, spriteW * cycle, col, spriteW, spriteH, pX, pY, 48, 48);
    mushroom(400, 500);
    tree(400, 150);
    tree(200, 450);

    for (let i = 0; i < widthCanvas; i += 50) {
      brick(i, heightCanvas - 50);
    }
    for (let i = 0; i < 4; i += 1) {
      brick(100, 50 * i);
    }
    for (let i = 0; i < 4; i += 1) {
      brick(100, 50 * i);
    }
    for (let i = 0; i < 3; i += 1) {
      brick(150 + 50 * i, 150);
    }
    ctx.strokeStyle = '#00a9ff';
    ctx.fillStyle = '#00a9ff';
    ctx.beginPath();
    ctx.moveTo(0, 250);
    ctx.quadraticCurveTo(200, 250, 600, 550);
    ctx.fill();
    ctx.stroke();
  }, 120);
});

/*
ctx.beginPath()
// ctx.moveTo(50,50)
// ctx.lineTo(550,50)
// ctx.lineTo(50,100)
// ctx.lineTo(550,100)
// ctx.moveTo(50,150)
// ctx.lineTo(550,150)
// ctx.lineTo(50,200)
// ctx.lineTo(550,200)

ctx.strokeStyle = 'red'
ctx.lineWidth = 3
ctx.fillStyle = 'green'

ctx.arc(300,300,150,1, 5)
ctx.quadraticCurveTo(60,10,90,90)
ctx.bezierCurveTo(10,10,90,90,50,90)

// ctx.closePath()
// ctx.fill()
ctx.stroke()

/!*ctx.strokeStyle = 'red'
ctx.lineWidth = 5;
ctx.strokeRect(20,20,200,100)

ctx.fillStyle = '#e4e4e4'
ctx.fillRect(200,200,300,150)

ctx.fillStyle = 'rgb(145,121,100)'
ctx.fillRect(100,400,200,150)

ctx.clearRect(0,0,300,300)*!/

/!*let xy=0
setInterval(() => {
    ctx.clearRect(0,0,600,600)
    xy +=10
    ctx.fillStyle = 'red'
    ctx.fillRect(xy,xy,100,50)
},120)*!/
*/
