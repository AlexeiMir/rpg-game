import EventSourceMixin from '../common/EventSourceMixin';
import ClientCamera from './ClientCamera';
import ClientInput from './ClientInput';
import { clamp } from '../common/util';

class ClientEngine {
  constructor(canvas, game) {
    Object.assign(this, {
      canvas,
      canvases: { main: canvas },
      ctx: null,
      imageLoaders: [],
      sprites: {},
      images: {},
      camera: new ClientCamera({ canvas, engine: this }),
      input: new ClientInput(canvas),
      game,
      lastRenderTime: 0,
      startTime: 0,
    });
    this.ctx = canvas.getContext('2d');
    this.loop = this.loop.bind(this);
  }

  start() {
    this.loop();
  }

  // ф-ия обновления нашего канваса
  loop(timestamp) {
    if (!this.startTime) {
      this.startTime = timestamp;
    }
    this.lastRenderTime = timestamp;
    const { ctx, canvas } = this;
    ctx.fillStyle = 'black';
    ctx.clearRect(0, 0, ctx.width, ctx.height);
    this.trigger('render', timestamp);
    this.initNextFrame();
  }

  initNextFrame() {
    // requestAnimationFrame чтобы создать несколько анимаций одновременно.
    // запланировать перерисовку на следущем кадре анимации
    window.requestAnimationFrame(this.loop);
  }

  loadSprites(spritesGroup) {
    this.imageLoaders = [];
    Object.keys(spritesGroup).forEach((groupName) => {
      // groupName = 'terrain'
      const group = spritesGroup[groupName];
      // group = grass: {}, water: {}
      this.sprites[groupName] = group;
      Object.keys(group).forEach((spriteName) => {
        // spriteName = grass, water, wall, spawn
        const { img } = group[spriteName];
        // если нет такого пути картинки, то положим в imageLoaders обработчик загрузки картинки
        if (!this.images[img]) {
          this.imageLoaders.push(this.loadImage(img));
        }
      });
    });
    // собирает все промисы картинок, дожидается загрузки и только потом их отдает
    return Promise.all(this.imageLoaders);
  }

  loadImage(url) {
    return new Promise((resolve) => {
      const i = new Image();
      // кладем экземпляр класса Img в поле объекта this
      this.images[url] = i;
      // ждем загрузку картинки
      i.onload = () => resolve(i);
      i.src = url;
    });
  }

  renderSpriteFrame({ sprite, frame, x, y, w, h }) {
    // sprite = ['terrain', 'wall']
    const spriteCfg = this.sprites[sprite[0]][sprite[1]];
    const [fx, fy, fw, fh] = spriteCfg.frames[frame];
    const img = this.images[spriteCfg.img];
    const { camera } = this;
    // console.log("camera ClientEngine", camera);

    this.ctx.drawImage(img, fx, fy, fw, fh, x - camera.x, y - camera.y, w, h);
  }

  addCanvas(name, width, height) {
    let canvas = this.canvases[name];

    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      this.canvases[name] = canvas;
    }

    return canvas;
  }

  // переключение канваса, чтобы могли работать с нужным канвасом, в нужный момент времени
  switchCanvas(name) {
    const canvas = this.canvases[name];

    if (canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
    }

    return canvas;
  }

  focus() {
    this.canvases.main.focus();
  }

  renderCanvas(name, fromPos, toPos) {
    const canvas = this.canvases[name];

    if (canvas) {
      this.ctx.drawImage(
        canvas,
        fromPos.x,
        fromPos.y,
        fromPos.width,
        fromPos.height,
        toPos.x,
        toPos.y,
        toPos.width,
        toPos.height,
      );
    }
  }

  renderSign(opt) {
    const options = {
      color: 'Black',
      bgColor: '#f4f4f4',
      font: '16px sans-serif',
      verticalPadding: 5,
      horizontalPadding: 3,
      textAlign: 'center',
      textBaseline: 'center',
      ...opt,
    };
    const { ctx, camera } = this;

    ctx.textBaseline = options.textBaseline;
    ctx.textAlign = options.textAlign;
    ctx.font = options.font;

    const measure = ctx.measureText(options.text); // объект, содержащий информацию об измеряемом тексте
    const textHeight = measure.actualBoundingBoxAscent;

    const barWidth = clamp(measure.width + 2 * options.horizontalPadding, options.minWidth, options.maxWidth);
    const barHeight = textHeight + 2 * options.verticalPadding;

    const barX = options.x - barWidth / 2 - camera.x;
    const barY = options.y - barHeight / 2 - camera.y;

    const textWidth = clamp(measure.width, 0, barWidth - 2 * options.horizontalPadding);

    ctx.fillStyle = options.bgColor;
    ctx.fillRect(barX, barY, barWidth, barHeight);

    ctx.fillStyle = options.color;
    ctx.fillText(options.text, barX + barWidth / 2, barY + barHeight - options.verticalPadding);
  }
}

Object.assign(ClientEngine.prototype, EventSourceMixin);

export default ClientEngine;
