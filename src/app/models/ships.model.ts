import {Position} from "./position.model"

export enum orientation {
    North,
    East,
    South,
    West
}

export abstract class Ship {
    protected position : Position
    protected size : number
    protected orientation : orientation
    protected destroyed : boolean

    constructor(position:Position, size:number, orientation:orientation){
        this.position = position;
        this.size = size;
        this.orientation = orientation;
        this.destroyed = false;
    }

    getPosition(){
        return this.position;
    }
    getSize(){
        return this.size;
    }
    getOrientation(){
        return this.orientation;
    }
    setDestroyed(){
        this.destroyed = true;
    }
}

export class Carrier extends Ship {
    constructor(position:Position, orientation:orientation){
        super(position,5,orientation);
    }
}

export class Battleship extends Ship {
    constructor(position:Position, orientation:orientation){
        super(position,4,orientation);
    }
}

export class Cruiser extends Ship {
    constructor(position:Position, orientation:orientation){
        super(position,3,orientation);
    }
}

export class Destroyer extends Ship {
    constructor(position:Position, orientation:orientation){
        super(position,2,orientation);
    }
}

export class Submarine extends Ship {
    constructor(position:Position, orientation:orientation){
        super(position,1,orientation);
    }
}





