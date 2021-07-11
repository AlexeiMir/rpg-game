import ClientEngine from './ClientEngine';
import ClientWorld from './ClientWorld';

import sprites from '../configs/sprites';
import levelCfg from '../configs/world.json';

class ClientGame {
  constructor(cfg) {
    // дополняем полями
    Object.assign(this, { cfg });

    this.engine = this.createEngine();
    this.map = this.creatWorld();

    this.initEngine();
  }

  createEngine() {
    return new ClientEngine(document.getElementById(this.cfg.tagId));
  }

  creatWorld() {
    return new ClientWorld(this, this.engine, levelCfg);
  }

  initEngine() {
    // когда все картинки загрузились, тогда стартуем engine
    this.engine.loadSprites(sprites).then(() => {
      // on(event, callback).callback вызывается как только отрабатывает loop(timestamp)
      this.engine.on('render', (_, time) => {
        this.map.init();
        // console.log('###: render',time)
      });
      this.engine.start();
    });
  }

  // инициализация игры
  static init(cfg) {
    // предотвращение повторной инициализации
    if (!ClientGame.game) {
      ClientGame.game = new ClientGame(cfg);
    }
  }
}

export default ClientGame;
