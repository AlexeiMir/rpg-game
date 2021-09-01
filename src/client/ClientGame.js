import ClientEngine from './ClientEngine';
import ClientWorld from './ClientWorld';

import sprites from '../configs/sprites';
import levelCfg from '../configs/world.json';
import gameObjects from '../configs/gameObjects.json';
import ClientApi from './ClientApi';

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
      gameObjects: cfg.gameObjects,
      player: null,
      players: {},
      api: new ClientApi({
        game: this,
        ...cfg.apiCfg,
      }),
      spawnPoint: [],
    });
    this.api.connect(); // инициализация сокета

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
    return new ClientWorld(this, this.engine, this.cfg.world);
  }

  getWorld() {
    return this.map;
  }

  initEngine() {
    // когда все картинки загрузились, тогда стартуем engine
    this.engine.loadSprites(this.cfg.sprites).then(() => {
      this.map.init();
      // console.log('###: render',time)
      // on(event, callback).callback вызывается как только отрабатывает loop(timestamp)
      this.engine.on('render', (_, time) => {
        this.player && this.engine.camera.focusAtGameObject(this.player);
        this.map.render(time);
      });
      this.engine.start();
      this.initKeys();
      this.engine.focus();
      this.api.join(this.cfg.playerName);
    });
  }

  setPlayers(playersList) {
    playersList.forEach((player) => this.createPlayer(player));
  }

  createCurrentPlayer(playerCfg) {
    console.log('### playerCfg', playerCfg);
    const playerObj = this.createPlayer(playerCfg);

    this.setPlayer(playerObj);
  }

  createPlayer({ id, col, row, layer, skin, name }) {
    if (!this.players[id]) {
      const cell = this.map.cellAt(col, row);
      const playerObj = cell.createGameObject(
        {
          class: 'player',
          type: skin,
          playerId: id,
          playerName: name,
        },
        layer,
      );
      cell.addGameObject(playerObj);

      this.players[id] = playerObj;
    }
    return this.players[id];
  }

  initKeys() {
    this.engine.input.onKey({
      ArrowLeft: (keydown) => keydown && this.movePlayerToDir('left'),
      ArrowRight: (keydown) => keydown && this.movePlayerToDir('right'),
      ArrowUp: (keydown) => keydown && this.movePlayerToDir('up'),
      ArrowDown: (keydown) => keydown && this.movePlayerToDir('down'),
    });
  }

  movePlayerToDir(dir) {
    this.api.move(dir);
  }

  moveByServer(dcol, drow, dir) {
    const { player } = this;

    if (player && player.motionProgress === 1) {
      const canMovie = player.moveByCellCoord(dcol, drow, (cell) => cell.findObjectsByType('grass').length);

      if (canMovie) {
        player.setState(dir);
        player.once('motion-stopped', () => player.setState('main'));
      }
    }
  }

  addSpawnPoint(spawnPoint) {
    this.spawnPoint.push(spawnPoint);
    console.log('### spawnPoint', spawnPoint);
  }

  getPlayerById(id) {
    return this.players[id];
  }

  removePlayerById(id) {
    const player = this.getPlayerById(id);

    if (player) {
      player.detouch();
      delete this.players[id];
      console.log('### players after del', this.players);
    }
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

/*
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
      let dir;
      if (keydown && player && player.motionProgress === 1) {
        dir = getDirectionPart(direction);
        this.api.move(dir)
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

      if (canMovie) {
        player.setState(dir);
        player.once('motion-stopped', () => player.setState('main'));
      }
    },
  });
}); */
