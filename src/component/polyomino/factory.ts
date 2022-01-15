import { BasePolyomino } from './BasePolyomino'
import { IPolyomino } from './IPolyomino'
import { JPolyomino } from './JPolyomino'
import { LPolyomino } from './LPolyomino'
import { OPolyomino } from './OPolyomino'
import { SPolyomino } from './SPolyomino'
import { TPolyomino } from './TPolyomino'
import { ZPolyomino } from './ZPolyomino'
interface IPolyominoConstuctor {
  new (): BasePolyomino
}
export class PolyominoFactory {
  create(type: string) {
    const map: { [type: string]: IPolyominoConstuctor } = {
      I: IPolyomino,
      J: JPolyomino,
      L: LPolyomino,
      O: OPolyomino,
      S: SPolyomino,
      T: TPolyomino,
      Z: ZPolyomino
    }
    const Polyomino: IPolyominoConstuctor = map[type] ? map[type] : IPolyomino
    return new Polyomino()
  }
}
