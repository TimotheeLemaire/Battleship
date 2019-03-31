import { Carrier, Battleship, Cruiser, Destroyer, Submarine, Ship } from './ships.model'
import { Position } from './position.model'

export class game {
    player1:String;
    player2:String;
    fleet1:Ship[];
    fleet2:Ship[];
    salvos1:Position[];
    salvos2:Position[];

    constructor(){    }

    addShip(ship:Ship,player:String){
        if(player==this.player1){
            this.fleet1.push(ship);
        } else if(player==this.player2){
            this.fleet2.push(ship);
        } else {
            console.error("Unknown player : "+player+" cannot add new ship : "+Ship);
            
        }
    }
}