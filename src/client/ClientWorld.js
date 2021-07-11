import sprites from '../configs/sprites';

class ClientWorld {
  constructor(game, engine, levelCfg) {
    Object.assign(this, {
      game,
      engine,
      levelCfg,
      height: levelCfg.map.length,
      width: levelCfg.map[0].length,
    });
  }

  init() {
    const { map } = this.levelCfg;
    map.forEach((cfgRow, y) => {
      cfgRow.forEach((cfgCell, x) => {
        this.engine.renderSpriteFrame({
          // cfgCell = ["wall"]
          sprite: ['terrain', cfgCell[0]],
          frame: 0,
          x,
          y,
          w: 48,
          h: 48,
        });
        // const [sX,sY,sW,sH] = sprites.terrain[cfgCell[0]].frames[0]
        // ctx.drawImage(terrian,sX,sY,sW,sH,spriteW*x,spriteH*y,spriteW,spriteH)
      });
    });
  }
}

export default ClientWorld;
