import { Injectable } from '@angular/core';
import { Carrier, Battleship, Cruiser, Destroyer, Submarine, Ship } from './models/ships.model'
import { Position } from './models/position.model'
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  // :{[key:string]:number} =
  shipsToPlace = new BehaviorSubject<{[key:string]:number}>({
    ['carriers']:1,
    ['battleships']:1,
    ['cruisers']:1,
    ['destroyers']:2,
    ['submarines']:2
  });

  ships:Ship[];
  
  constructor() { 
    this.ships = [];
    this.hits = [];
  }
  
  saveShip(ship:Ship){
    this.ships.push(ship);
  }
  
  getShips():Ship[] {
    return this.ships;
  }

  //local testing

  hits:Position[];

  saveHit(pos:Position){
    this.hits.push(pos);
    var result=null;
    this.ships.forEach(element => {
      if(this.matchShip(pos,element))
      result = element;
    });
    return result;
  }
  
  private matchShip(pos:Position,ship:Ship){
    var result=false;
    ship.toPositionArray().forEach(element => {
      if(element.equals(pos))
        result=true;
    });
    return result;
  }

  isShipSunk(ship:Ship){
    var matched = false;
    var result = true;
    ship.toPositionArray().forEach(shipPos => {
      matched=false;
      this.hits.forEach(hit =>{
        if(shipPos.equals(hit)){
          matched = true;
        }
      })
      if(!matched){
        result = false;
      }
    });
    return result;
  }
}
