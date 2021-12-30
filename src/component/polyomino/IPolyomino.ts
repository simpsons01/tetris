import { PolyominoShape } from '../../enum'
import { BasePolyomino } from './BasePolyomino'
export class IPolyomino extends BasePolyomino {
  constructor() {
    super(
      {
        [PolyominoShape.First]: {
          anchorIndex: 1,
          coordinate: [
            { x: 0, y: -1 },
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: 2 }
          ]
        },
        [PolyominoShape.Second]: {
          anchorIndex: 1,
          coordinate: [
            { x: -1, y: 0 },
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 }
          ]
        },
        [PolyominoShape.Third]: {
          anchorIndex: 1,
          coordinate: [
            { x: 0, y: -1 },
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: 2 }
          ]
        },
        [PolyominoShape.Forth]: {
          anchorIndex: 1,
          coordinate: [
            { x: -1, y: 0 },
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 }
          ]
        }
      },
      {
        strokeColor: '#292929',
        fillColor: '#00BB00'
      }
    )
  }
}
