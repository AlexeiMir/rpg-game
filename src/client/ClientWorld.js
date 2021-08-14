import sprites from '../configs/sprites';
import PositionedObject from '../common/PositionedObject';
import ClientCell from './ClientCell';
import { clamp } from '../common/util';

class ClientWorld extends PositionedObject {
  constructor(game, engine, levelCfg) {
    super();
    const worldHeight = levelCfg.map.length;
    const worldWidth = levelCfg.map[0].length;
    const cellSize = engine.canvas.height / levelCfg.camera.height;
    Object.assign(this, {
      game,
      engine,
      levelCfg,
      height: worldHeight * cellSize,
      width: worldWidth * cellSize,
      worldHeight,
      worldWidth,
      cellWidth: cellSize,
      cellHeight: cellSize,
      // массив, который будет хранить наш мир
      map: [],
    });
  }

  init() {
    const { levelCfg, map, worldHeight, worldWidth } = this;
    for (let row = 0; row < worldHeight; row += 1) {
      for (let col = 0; col < worldWidth; col += 1) {
        if (!map[row]) {
          map[row] = [];
        }

        map[row][col] = new ClientCell({
          world: this,
          cellCol: col,
          cellRow: row,
          cellCfg: levelCfg.map[row][col], // ['wall']
        });
      }
    }
  }

  // проходится по уже созданному миру и рисует ячейки
  render(time) {
    const { levelCfg, map, worldWidth, worldHeight } = this;

    for (let layerId = 0; layerId < levelCfg.layers.length; layerId += 1) {
      const layer = levelCfg.layers[layerId];

      if (layer.isStatic) {
        this.renderStaticLayer(time, layer, layerId);
      } else {
        this.renderDynamicLayer(time, layerId, this.getRenderRange());
      }
    }
  }

  renderStaticLayer(time, layer, layerId) {
    const { engine } = this;
    const { camera } = engine;

    const layerName = `static_layer_${layerId}`;
    const cameraPos = camera.worldBounds();

    if (!layer.isRendered) {
      // если слой не отрендерен
      engine.addCanvas(layerName, this.width, this.height);
      engine.switchCanvas(layerName); // переключаемся на канвас, с которым будем работать

      camera.moveTo(0, 0, false); // рисуем мир от нуля координат

      this.renderDynamicLayer(time, layerId); // чтобы отрисовать слой

      camera.moveTo(cameraPos.x, cameraPos.y, false); // перемещаем камеру в изначальное положение

      engine.switchCanvas('main'); // переключаем обратно на главный слой
      layer.isRendered = true;
    }

    engine.renderCanvas(layerName, cameraPos, { x: 0, y: 0, width: cameraPos.width, height: cameraPos.height });
  }

  renderDynamicLayer(time, layerId, rangeCells) {
    const { map, worldWidth, worldHeight } = this;

    if (!rangeCells) {
      rangeCells = {
        startCell: this.cellAt(0, 0),
        endCell: this.cellAt(worldWidth - 1, worldHeight - 1),
      };
    }

    const { startCell, endCell } = rangeCells;

    for (let { row } = startCell; row <= endCell.row; row += 1) {
      for (let { col } = startCell; col <= endCell.col; col += 1) {
        map[row][col].render(time, layerId);
      }
    }
  }

  cellAt(col, row) {
    return this.map[row] && this.map[row][col];
  }

  // какая ячейка находится по соответствующим координатам в нашем мире
  cellAtXY(x, y) {
    const { width, height, cellWidth, cellHeight } = this;

    return this.cellAt(
      Math.floor(clamp(x, 0, width - 1) / cellWidth),
      Math.floor(clamp(y, 0, height - 1) / cellHeight),
    );
  }

  getRenderRange() {
    const { x, y, width, height } = this.engine.camera.worldBounds();
    const { cellWidth, cellHeight } = this;

    return {
      startCell: this.cellAtXY(x - cellWidth, y - cellHeight),
      endCell: this.cellAtXY(x + width + cellWidth, y + height + cellHeight),
    };
  }
}

export default ClientWorld;
