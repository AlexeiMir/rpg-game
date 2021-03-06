import './index.scss';
import SenseiWalk from './assets/Male-4-Walk.png';
import terrianAtlas from './assets/terrain.png';
import ClientGame from './client/ClientGame';

const canvas = document.getElementById('game');
const form = document.getElementById('nameForm');
const name = document.getElementById('name');
const startGame = document.querySelector('.start-game');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const player = name.value;
  if (player === '') return false;
  startGame.classList.add('hidden');
  ClientGame.init({ tagId: 'game', playerName: player });
  return '';
});

// window.addEventListener('load', () => {
//   console.log('init');
//   ClientGame.init({ tagId: 'game', playerName:player });
// });

const { width: widthCanvas, height: heightCanvas } = canvas.getBoundingClientRect();
const ctx = canvas.getContext('2d');

const spriteW = 48;
const spriteH = 48;
const shots = 3;
let cycle = 0;
let pY = (heightCanvas - spriteH) / 2;
let pX = (widthCanvas - spriteW) / 2;
let keyPressed = null;
const atlasRows = { down: 0, left: 1, right: 2, up: 3 };
let atlasRow = 0;

const terrian = document.createElement('img');
terrian.src = terrianAtlas;

function keyDownHandler(e) {
  switch (e.key) {
    case 'ArrowDown':
    case 'Down':
      keyPressed = 'down';
      break;
    case 'ArrowUp':
    case 'Up':
      keyPressed = 'up';
      break;
    case 'ArrowRight':
    case 'Right':
      keyPressed = 'right';
      break;
    case 'ArrowLeft':
    case 'Left':
      keyPressed = 'left';
      break;
    default:
      break;
  }
}
function keyUpHandler(e) {
  switch (e.key) {
    case 'ArrowDown':
    case 'Down':
      keyPressed = null;
      break;
    case 'ArrowUp':
    case 'Up':
      keyPressed = null;
      break;
    case 'ArrowRight':
    case 'Right':
      keyPressed = null;
      break;
    case 'ArrowLeft':
    case 'Left':
      keyPressed = null;
      break;
    default:
      break;
  }
}

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

const img = document.createElement('img');
img.src = SenseiWalk;

function getCycle() {
  return (cycle + 1) % shots;
}

function walk(timestamp) {
  // timestamp - ?????????? ?????????????????? ?? ???????????? ???????????????? ????????????????.
  // ???????????????? ???? timestamp ?????????? ?????????????????? ????????????????
  // ?? ???????????????????????? ????????????
  // console.log('###: timestamp',timestamp)
  if (keyPressed === 'down' && pY <= heightCanvas - spriteH) {
    pY += 10;
    cycle = getCycle();
    atlasRow = atlasRows.down;
  }
  if (keyPressed === 'up' && pY >= 0) {
    pY -= 10;
    cycle = getCycle();
    atlasRow = spriteH * atlasRows.up;
  }
  if (keyPressed === 'right' && pX <= widthCanvas - spriteW) {
    pX += 10;
    cycle = getCycle();
    atlasRow = spriteH * atlasRows.right;
  }
  if (keyPressed === 'left' && pX > 0) {
    pX -= 10;
    cycle = getCycle();
    atlasRow = spriteH * atlasRows.left;
  }
  ctx.clearRect(0, 0, 600, 600);
  ctx.drawImage(img, spriteW * cycle, atlasRow, spriteW, spriteH, pX, pY, 48, 48);

  // ?????????????? ????????????????
  window.requestAnimationFrame(walk);
}

// img.addEventListener('load', () => {
//  window.requestAnimationFrame(walk);
// });
