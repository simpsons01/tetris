import { PolyominoShape } from '../../enum'
import { BasePolyomino } from './BasePolyomino'
export class ZPolyomino extends BasePolyomino {
  constructor() {
    super(
      {
        [PolyominoShape.First]: {
          anchorIndex: 1,
          coordinate: [
            { x: -1, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 1 }
          ]
        },
        [PolyominoShape.Second]: {
          anchorIndex: 2,
          coordinate: [
            { x: -1, y: -1 },
            { x: -1, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 1 }
          ]
        },
        [PolyominoShape.Third]: {
          anchorIndex: 1,
          coordinate: [
            { x: -1, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 1 }
          ]
        },
        [PolyominoShape.Forth]: {
          anchorIndex: 2,
          coordinate: [
            { x: -1, y: -1 },
            { x: -1, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 1 }
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
