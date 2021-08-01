import ClientEngine from './ClientEngine';
import ClientWorld from './ClientWorld';

import sprites from '../configs/sprites';
import levelCfg from '../configs/world.json';
import gameObjects from '../configs/gameObjects.json';

const DIRECTION_LIST = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};

class ClientGame {
  constructor(cfg) {
    // дополняем полями
    Object.assign(this, {
      cfg,
      gameObjects,
      player: null,
    });
    this.engine = this.createEngine();
    this.map = this.creatWorld();

    this.initEngine();
  }

  setPlayer(player) {
    this.player = player; // ClientGameObject
  }

  createEngine() {
    return new ClientEngine(document.getElementById(this.cfg.tagId), this);
  }

  creatWorld() {
    return new ClientWorld(this, this.engine, levelCfg);
  }

  getWorld() {
    return this.map;
  }

  initEngine() {
    // когда все картинки загрузились, тогда стартуем engine
    this.engine.loadSprites(sprites).then(() => {
      this.map.init();
      // console.log('###: render',time)
      // on(event, callback).callback вызывается как только отрабатывает loop(timestamp)
      this.engine.on('render', (_, time) => {
        this.engine.camera.focusAtGameObject(this.player);
        this.map.render(time);
      });
      this.engine.start();
      this.initKeys();
    });
  }

  initKeys() {
    // onKey - инициализирует все нажатия клавиш
    const { player } = this;
    function getDirectionPart(direction) {
      const directionPart = direction.slice(5);
      return directionPart.charAt(0).toLowerCase() + directionPart.slice(1);
    }

    Object.entries(DIRECTION_LIST).forEach(([direction, coords]) => {
      this.engine.input.onKey({
        [direction]: (keydown) => {
          let canMovie; // может ли начать движение. Если уперся в стенку moveByCellCoord должна вернуть false
          if (keydown && player && player.motionProgress === 1) {
            // новое положение не начиналось
            // пока не закончится текущая анимация движения. motionProgress === 1 - движениие закончилось
            // cell - какая ячейка будет следующая ClientGameObject
            canMovie = player.moveByCellCoord(
              coords[0],
              coords[1],
              (cell) =>
                // console.log('####: cell', cell);//ClientCell
                // console.log('####: cell', cell.findObjectsByType('grass'));
                cell.findObjectsByType('grass').length,
              // console.log('####: cell', cell.findObjectsByType('grass'))
            );
          }
          const dir = getDirectionPart(direction);
          if (canMovie) {
            player.setState(dir);
            player.once('motion-stopped', () => player.setState('main'));
          }
        },
      });
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
