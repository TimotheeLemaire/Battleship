import {Ship} from "./ships.model"
import {Position} from "./position.model"

export enum Results {
    HIT = "HIT", 
    MISS = "MISS", 
    SINK = "SINK"
}

export class Hit {
    target:Position;
    result:Results;
    sunk:Ship;
}