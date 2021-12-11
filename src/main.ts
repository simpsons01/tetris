import { isRegExp } from "util";
import { Cube } from "./enum";

class main {

  currentActiveCube: Cube | null 

  init() {

  }

  startGame() {
     
  }

  pauseGame() {
    
  }

  autoProcess() {
    
  }

  excute() {
     
  }

  getIsCubeCollide() {
    
  }
  

  getShouldClearCubes() {

  }

  changeCubePosiiton(x,y) {
    const cubbe = Cube.updatePositon()
    if(getIsCubeCollide(cubePosition)) {
      // clear auto process
      // create 3s move or chage shape movement
      const sholudClearCubes = this.getShouldClearCubes()
      if(sholudClearCubes) {
        claerCubes().then(()=> {
          autoProcess
        })
      }
    }
  }
  
}