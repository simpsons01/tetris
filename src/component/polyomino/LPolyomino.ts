import { PolyominoShape } from '../../enum'
import { BasePolyomino } from './BasePolyomino'
export class LPolyomino extends BasePolyomino {
  constructor() {
    super(
      {
        [PolyominoShape.First]: {
          anchorIndex: 2,
          coordinate: [
            { x: 0, y: -1 },
            { x: 0, y: 1 },
            { x: 0, y: 0 },
            { x: 1, y: 1 }
          ]
        },
        [PolyominoShape.Second]: {
          anchorIndex: 2,
          coordinate: [
            { x: -1, y: 1 },
            { x: -1, y: 0 },
            { x: 0, y: 0 },
            { x: 1, y: 0 }
          ]
        },
        [PolyominoShape.Third]: {
          anchorIndex: 2,
          coordinate: [
            { x: -1, y: -1 },
            { x: 0, y: -1 },
            { x: 0, y: 0 },
            { x: 0, y: 1 }
          ]
        },
        [PolyominoShape.Forth]: {
          anchorIndex: 2,
          coordinate: [
            { x: -1, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: 0 },
            { x: 1, y: -1 }
          ]
        }
      },
      {
        strokeColor: '#292929',
        fillColor: '#C6A300'
      }
    )
  }
}
