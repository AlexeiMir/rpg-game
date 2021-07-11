import EventSourceMixin from '../common/EventSourceMixin';

class ClientEngine {
  constructor(canvas) {
    Object.assign(this, {
      canvas,
      ctx: null,
      imageLoaders: [],
      sprites: {},
      images: {},
    });
    this.ctx = canvas.getContext('2d');
    this.loop = this.loop.bind(this);
  }

  start() {
    this.loop();
  }

  // ф-ия обновления нашего канваса
  loop(timestamp) {
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

    this.ctx.drawImage(img, fx, fy, fw, fh, x * w, y * h, w, h);
  }
}

Object.assign(ClientEngine.prototype, EventSourceMixin);

export default ClientEngine;
