import {Position} from "./position.model"

export enum Orientation {
    North,
    East,
    South,
    West
}

export abstract class Ship {
    protected position : Position
    protected size : number
    protected orientation : Orientation
    protected destroyed : boolean

    constructor(position:Position, size:number, orientation:Orientation){
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
    toPositionArray(){
        var i:number;
        var positions:Position[] = [];
        var newPosition;

        for(i=0;i<this.size;i++){
            switch(this.orientation){
            case Orientation.North:
                newPosition = new Position( Position.letters[Position.letters.indexOf(this.position.getLetter())],
                                            Position.indices[Position.indices.indexOf(this.position.getNumber())-i]);
                positions.push(newPosition);
                break;
            case Orientation.South:
                newPosition = new Position( Position.letters[Position.letters.indexOf(this.position.getLetter())],
                                            Position.indices[Position.indices.indexOf(this.position.getNumber())+i]);
                positions.push(newPosition);
                break;
            case Orientation.East:
                newPosition = new Position( Position.letters[Position.letters.indexOf(this.position.getLetter())+i],
                                            Position.indices[Position.indices.indexOf(this.position.getNumber())]);
                positions.push(newPosition);
                break;
            case Orientation.West:
                newPosition = new Position( Position.letters[Position.letters.indexOf(this.position.getLetter())-i],
                                            Position.indices[Position.indices.indexOf(this.position.getNumber())]);
                positions.push(newPosition);
                break;
            }
        }
        return positions;
    }
}

export class Carrier extends Ship {
    constructor(position:Position, orientation:Orientation){
        super(position,5,orientation);
    }
}

export class Battleship extends Ship {
    constructor(position:Position, orientation:Orientation){
        super(position,4,orientation);
    }
}

export class Cruiser extends Ship {
    constructor(position:Position, orientation:Orientation){
        super(position,3,orientation);
    }
}

export class Destroyer extends Ship {
    constructor(position:Position, orientation:Orientation){
        super(position,2,orientation);
    }
}

export class Submarine extends Ship {
    constructor(position:Position, orientation:Orientation){
        super(position,1,orientation);
    }
}





