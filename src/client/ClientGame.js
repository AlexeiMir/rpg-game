import ClientEngine from './ClientEngine';
import ClientWorld from './ClientWorld';

import sprites from '../configs/sprites';
import levelCfg from '../configs/world.json';
import gameObjects from '../configs/gameObjects.json';

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
    this.player = player;
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
      this.map.init();
      // console.log('###: render',time)
      // on(event, callback).callback вызывается как только отрабатывает loop(timestamp)
      this.engine.on('render', (_, time) => {
        this.map.render(time);
      });
      this.engine.start();
      this.initKeys();
    });
  }

  initKeys() {
    // onKey - инициализирует все нажатия клавиш
    const objdirection = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    Object.entries(objdirection).forEach(([direction, coords]) => {
      this.engine.input.onKey({
        [direction]: (keydown) => {
          if (keydown) {
            // cell - какая ячейка будет следующая ClientGameObject
            this.player.moveByCellCoord(coords[0], coords[1], (cell) => {
              console.log(cell);
              console.log('####: cell', cell.findObjectsByType('grass'));
              return cell.findObjectsByType('grass').length;
              // console.log('####: cell', cell.findObjectsByType('grass'))
            });
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

// this.engine.input.onKey({
//
//     ArrowLeft: (keydown) => {
//         if (keydown) {
//             // cell - какая ячейка будет следующая ClientGameObject
//             this.player.moveByCellCoord(-1,0, (cell) => {
//                 console.log(cell)
//                 console.log('####: cell', cell.findObjectsByType('grass'))
//                 return cell.findObjectsByType('grass').length
//                 //console.log('####: cell', cell.findObjectsByType('grass'))
//             })
//         }
//     }
//
// })
