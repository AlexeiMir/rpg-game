import { io } from 'socket.io-client';

class ClientApi {
  constructor(cfg) {
    Object.assign(this, {
      ...cfg,
      game: cfg.game,
    });
  }

  connect() {
    const { url, path } = this;

    this.io = io(url, { path });
    // после того как подключились, сервер выполнит подписку welcome
    this.io.on('welcome', this.onWelcome);
    // когда выполнится метод join(playerName) передача игрока, случится событие join, на которое подписываемся
    this.io.on('join', this.onJoin.bind(this));
    this.io.on('newPlayer', this.onNewPlayer.bind(this));
    // подписываемся, чтобы сервер сообщил какой игрок куда пошел
    this.io.on('playerMove', this.onPlayerMove.bind(this));
    this.io.on('playerDisconnect', this.onPlayerDisconnect.bind(this));
  }

  // выполнится как только событие 'welcome' произойдет на сервере
  onWelcome(serverStatus) {
    console.log('Server is online', serverStatus);
  }

  // возвращает присоединившегося игрока
  onJoin(player) {
    this.game.createCurrentPlayer(player.player);
    this.game.setPlayers(player.playersList);
    console.log('JOINED A GAME!', player);
  }

  // присылает нового игрока,который вошел в игру
  onNewPlayer(player) {
    this.game.createPlayer(player);
  }

  // сообщаем серверу , что подключился новый игрок
  join(playerName) {
    this.io.emit('join', playerName);
  }

  // сообщаем серверу куда пошли
  move(dir) {
    this.io.emit('move', dir);
  }

  onPlayerMove(moveCfg) {
    console.log('###: move', moveCfg);
    const { game } = this;
    const { col, row, id, oldCol, oldRow } = moveCfg;
    const player = game.getPlayerById(id);

    if (player) {
      player.moveToCellCoord(col, row);
    }

    if (oldCol < col && row === oldRow) {
      // player.setState('right')
      game.moveByServer(col - oldCol, row - oldRow, 'right');
    }
    if (oldCol > col && row === oldRow) {
      // player.setState('left')
      game.moveByServer(col - oldCol, row - oldRow, 'left');
    }
    if (row > oldRow && oldCol === col) {
      // player.setState('down')
      game.moveByServer(col - oldCol, row - oldRow, 'down');
    }
    if (row < oldRow && oldCol === col) {
      // player.setState('up')
      game.moveByServer(col - oldCol, row - oldRow, 'up');
    }
  }

  onPlayerDisconnect(id) {
    this.game.removePlayerById(id);
  }
}

export default ClientApi;
