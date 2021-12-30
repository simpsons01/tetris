import { PolyominoShape } from '../../enum'
import { BasePolyomino } from './BasePolyomino'
export class SPolyomino extends BasePolyomino {
  constructor() {
    super(
      {
        [PolyominoShape.First]: {
          anchorIndex: 1,
          coordinate: [
            { x: -1, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: -1 },
            { x: 1, y: -1 }
          ]
        },
        [PolyominoShape.Second]: {
          anchorIndex: 1,
          coordinate: [
            { x: -1, y: 0 },
            { x: 0, y: 0 },
            { x: -1, y: -1 },
            { x: 0, y: 1 }
          ]
        },
        [PolyominoShape.Third]: {
          anchorIndex: 1,
          coordinate: [
            { x: -1, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: -1 },
            { x: 1, y: -1 }
          ]
        },
        [PolyominoShape.Forth]: {
          anchorIndex: 1,
          coordinate: [
            { x: -1, y: 0 },
            { x: 0, y: 0 },
            { x: -1, y: -1 },
            { x: 0, y: 1 }
          ]
        }
      },
      {
        strokeColor: '#292929',
        fillColor: '#00CACA'
      }
    )
  }
}
