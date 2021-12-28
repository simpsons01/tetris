import { PolyominoShape } from '../../enum'
import { BasePolyomino } from './BasePolyomino'
export class JPolyomino extends BasePolyomino {
  constructor() {
    super(
      {
        [PolyominoShape.First]: {
          anchorIndex: 2,
          coordinate: [
            { x: -1, y: 1 },
            { x: 0, y: 1 },
            { x: 0, y: 0 },
            { x: 0, y: -1 }
          ]
        },
        [PolyominoShape.Second]: {
          anchorIndex: 2,
          coordinate: [
            { x: -1, y: -1 },
            { x: -1, y: 0 },
            { x: 0, y: 0 },
            { x: 1, y: 0 }
          ]
        },
        [PolyominoShape.Third]: {
          anchorIndex: 2,
          coordinate: [
            { x: 1, y: -1 },
            { x: 0, y: -1 },
            { x: 0, y: 0 },
            { x: 0, y: 1 }
          ]
        },
        [PolyominoShape.Forth]: {
          anchorIndex: 1,
          coordinate: [
            { x: -1, y: 0 },
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 1, y: 1 }
          ]
        }
      },
      {
        strokeColor: '#D3D3D3',
        fillColor: '#A6A600'
      }
    )
  }
}
