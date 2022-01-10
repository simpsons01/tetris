import { PolyominoShape } from './../../enum'
import { BasePolyomino } from '../../component/polyomino'
import { ICoordinate, IPolyominoCoordinate, IPolyominoCoordinateConfig, IRender } from '../../types'
import { EventEmitter } from '../../util/EventEmitter'

export class PolyominoModel extends EventEmitter {
  polyomino: BasePolyomino | null = null

  get isNil(): boolean {
    return this.polyomino == null
  }

  get shape(): null | PolyominoShape {
    let shape = null
    if (!!this.polyomino) {
      shape = this.polyomino.shape
    }
    return shape
  }

  get anchor(): null | ICoordinate {
    let _coordinate = null
    if (!!this.polyomino) {
      const {
        polyomino: { coordinate, coordinateConfig, shape }
      } = this
      _coordinate = coordinate[coordinateConfig[shape].anchorIndex]
    }
    return _coordinate
  }

  get coordinate(): null | IPolyominoCoordinate['coordinate'] {
    let _coordinate = null
    if (!!this.polyomino) {
      const {
        polyomino: { coordinate }
      } = this
      _coordinate = coordinate
    }
    return _coordinate
  }

  get coordinateConfig(): null | IPolyominoCoordinateConfig {
    let coordinateConfig = null
    if (!!this.polyomino) {
      coordinateConfig = this.polyomino.coordinateConfig
    }
    return coordinateConfig
  }

  get info(): null | Array<ICoordinate & IRender> {
    let info = null
    if (!!this.polyomino) {
      info = this.polyomino.getInfo()
    }
    return info
  }

  set(polyomino: BasePolyomino): void {
    if (!this.polyomino) {
      this.polyomino = polyomino
      this.commit()
    }
  }

  reset(): void {
    if (!!this.polyomino) {
      this.polyomino = null
      this.commit()
    }
  }

  updateCoordinate(coodrinate: ICoordinate): void {
    if (!!this.polyomino) {
      this.polyomino.updateCoordinate(coodrinate)
      this.commit()
    }
  }

  updateShape(shape: PolyominoShape): void {
    if (!!this.polyomino) {
      this.polyomino.changeShape(shape)
      this.commit()
    }
  }

  calcCoordinateByShape(shape: PolyominoShape): null | IPolyominoCoordinate['coordinate'] {
    let polyominoCoordinate = null
    if (!!this.polyomino) {
      polyominoCoordinate = this.polyomino.getCoodinate(shape)
    }
    return polyominoCoordinate
  }

  calcAnchorByCoordinate(polyominoCoodinate: IPolyominoCoordinate['coordinate']): null | ICoordinate {
    let anchor = null
    if (!!this.polyomino) {
      const {
        polyomino: { coordinateConfig, shape }
      } = this
      anchor = polyominoCoodinate[coordinateConfig[shape].anchorIndex]
    }
    return anchor
  }

  getRange(): {
    minX: null | number
    maxX: null | number
    minY: null | number
    maxY: null | number
  } {
    let _minX = null,
      _maxX = null,
      _minY = null,
      _maxY = null
    if (!!this.polyomino) {
      const { minX, maxX, minY, maxY } = this.polyomino.range
      _minX = minX
      _maxX = maxX
      _minY = minY
      _maxY = maxY
    }
    return {
      minX: _minX,
      maxX: _maxX,
      minY: _minY,
      maxY: _maxY
    }
  }

  commit() {
    this.emit('change')
  }
}
