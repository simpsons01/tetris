import { IPolyomino } from './IPolyomino'
import { JPolyomino } from './JPolyomino'
import { LPolyomino } from './LPolyomino'
import { OPolyomino } from './OPolyomino'
import { SPolyomino } from './SPolyomino'
import { TPolyomino } from './TPolyomino'
import { ZPolyomino } from './ZPolyomino'

export class PolyominoFactory {
  create() {
    const ary = [ZPolyomino, TPolyomino, SPolyomino, OPolyomino, LPolyomino, JPolyomino, IPolyomino]
    const polyomino = ary[Math.round(Math.random() * (ary.length - 1))]
    return new polyomino()
  }
}
