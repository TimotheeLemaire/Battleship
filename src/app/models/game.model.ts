import { Carrier, Battleship, Cruiser, Destroyer, Submarine, Ship } from './ships.model'
import { Position } from './position.model'

export class game {
    p1:String;
    p2:String;
    fleet1:Ship[];
    fleet2:Ship[];
    hitsP1:Position[];
    hitsP2:Position[];
    id:number;

    constructor(){    }

    addShip(ship:Ship,player:String){
        if(player==this.p1){
            this.fleet1.push(ship);
        } else if(player==this.p2){
            this.fleet2.push(ship);
        } else {
            console.error("Unknown player : "+player+" cannot add new ship : "+Ship);
        }
    }

    isPlacementOver(){
        return this.fleet1!=null&&this.fleet2!=null;
    }

}