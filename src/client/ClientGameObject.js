// ласс, представляющий собой любой игровой объект, который может быть отрендерен в игре. В каждый момент он
// должен быть привязан к какой-то ячейке

import MovableObject from '../common/MovableObject';
import { animateEx } from '../common/util';

class ClientGameObject extends MovableObject {
  constructor(cfg) {
    super();

    const { x, y, width, height } = cfg.cell;

    const { world } = cfg.cell;
    const gameObjs = world.game.gameObjects;
    const objCfg = typeof cfg.objCfg === 'string' ? { type: cfg.objCfg } : cfg.objCfg;

    Object.assign(
      this,
      {
        cfg,
        x,
        y,
        width,
        height,
        spriteCfg: gameObjs[objCfg.type],
        objectConfig: objCfg,
        type: objCfg.type,
        world,
        state: 'main',
        animationStartTime: 0,
      },
      cfg,
    );
  }

  moveByCellCoord(dcol, drow, conditionCallback = null) {
    const { cell } = this;
    return this.moveToCellCoord(cell.cellCol + dcol, cell.cellRow + drow, conditionCallback);
  }

  moveToCellCoord(dcol, drow, conditionCallback = null) {
    const { world } = this;
    const newCell = world.cellAt(dcol, drow);
    const canMovie = !conditionCallback || conditionCallback(newCell);

    if (canMovie) {
      this.setCell(newCell);
    }
    // console.log('canMovie', canMovie);
    return canMovie;
  }

  setCell(newCell) {
    if (newCell) {
      this.detouch();
      this.cell = newCell;
      newCell.addGameObject(this);

      // console.log('ClientGameObject newCell', newCell);
      this.moveTo(newCell.x, newCell.y, true, 200);

      // const { x, y, width, height } = newCell;
      // Object.assign(this, { x, y, width, height });
    }
  }

  setState(state) {
    this.state = state;

    if (this.world) {
      this.animationStartTime = this.world.engine.lastRenderTime;
    }
  }

  getCurrentFrame(time) {
    const state = this.spriteCfg.states[this.state];
    const lengthFrame = state.frames.length;
    const animate = animateEx(lengthFrame, this.animationStartTime, time, state.duration, true);
    // вернет номер текущего кадра в св-ве offset
    const frame = Math.floor(lengthFrame + animate.offset) % lengthFrame; // 0 - lengthFrame
    // какой кадр в данный момент времени нужно использовать
    return state.frames[frame];
  }

  render(time) {
    super.render(time);

    const { x, y, width, height, world } = this;
    const { engine } = world;
    const { sprite, frame, states, type } = this.spriteCfg;

    const spriteFrame = type === 'static' ? frame : this.getCurrentFrame(time);
    engine.renderSpriteFrame({ sprite, frame: spriteFrame, x, y, w: width, h: height });
  }

  detouch() {
    if (this.cell) {
      this.cell.removeGameObject(this);
      this.cell = null;
    }
  }
}

export default ClientGameObject;
