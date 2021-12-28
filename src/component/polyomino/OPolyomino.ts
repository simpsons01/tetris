import { PolyominoShape } from '../../enum'
import { BasePolyomino } from './BasePolyomino'
export class OPolyomino extends BasePolyomino {
  constructor() {
    super(
      {
        [PolyominoShape.First]: {
          anchorIndex: 3,
          coordinate: [
            { x: -1, y: -1 },
            { x: 0, y: -1 },
            { x: -1, y: 0 },
            { x: 0, y: 0 }
          ]
        },
        [PolyominoShape.Second]: {
          anchorIndex: 3,
          coordinate: [
            { x: -1, y: -1 },
            { x: 0, y: -1 },
            { x: -1, y: 0 },
            { x: 0, y: 0 }
          ]
        },
        [PolyominoShape.Third]: {
          anchorIndex: 3,
          coordinate: [
            { x: -1, y: -1 },
            { x: 0, y: -1 },
            { x: -1, y: 0 },
            { x: 0, y: 0 }
          ]
        },
        [PolyominoShape.Forth]: {
          anchorIndex: 3,
          coordinate: [
            { x: -1, y: -1 },
            { x: 0, y: -1 },
            { x: -1, y: 0 },
            { x: 0, y: 0 }
          ]
        }
      },
      {
        strokeColor: '#D3D3D3',
        fillColor: '#00CACA'
      }
    )
  }
}
