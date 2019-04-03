import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms'
import { Carrier, Battleship, Cruiser, Destroyer, Submarine, Ship, Orientation } from '../models/ships.model'
import { Position } from '../models/position.model'
import { GameService } from '../game.service'
import { observable } from 'rxjs';

export enum states {
  empty,
  valid,
  projection,
  ship,
  shipEnd,
}


export enum targetStates {
  clear,
  miss,
  hit,
  sunk,
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  placement:boolean;

  //for playing phase
  hoverCol:string = "";
  hoverRow:string = "";

  indices: number[];
  letters: string[];

  targetGrid:{[key:string]:{[key:number]:targetStates}};
  fleetGrid:{[key:string]:{[key:number]:states}};
  
  //"proxy" for visibility from html
  shipsKeys;
  states;
  targetStates;

  //to put in another file

  shipToPlace;
  origin:Position=null;
  gameService:GameService;

  constructor(gameService: GameService) { 
    this.gameService=gameService;
  }

  ngOnInit(){

    this.gameService.shipsToPlace.subscribe(ships =>{
      this.shipToPlace = ships;
      this.shipsKeys = Object.keys(this.shipToPlace);
    });

    this.states = states;
    this.targetStates = targetStates;
    
    this.indices = Position.indices;
    this.letters = Position.letters;

    this.initGrid();

    this.placement = true;
  }

  initGrid(){
    var i:number = 0;
    var j:number = 0;

    this.targetGrid = {};
    this.fleetGrid = {};

    this.letters.forEach(letter => {
      this.targetGrid[letter] = {};
      this.fleetGrid[letter] = {};

      this.indices.forEach(number => {
        this.targetGrid[letter][number]=targetStates.clear;
        this.fleetGrid[letter][number]=states.empty;
      });
    });
  }

  highlight(event, on:boolean){
        //retrieve case id and parse it.
    if(on){
      var target = event.target.id.split("-",3);
      this.hoverCol = target[1];
      this.hoverRow = target[2];
    } else {
      this.hoverCol = "";
      this.hoverRow = "";
    }
  }

  fire(event){
    var target = event.target.id.split("-",3);
    var letter = target[1];
    var number:string = target[2];
    if(this.targetGrid[letter][number]==targetStates.clear){

      //local testing
      var affectedShip=this.gameService.saveHit(new Position(letter,Number(number)));
      if(affectedShip!=null){
        if(this.gameService.isShipSunk(affectedShip)){
          affectedShip.toPositionArray().forEach(element => {
            this.targetGrid[element.getLetter()][element.getNumber()]=targetStates.sunk;
          });
        } else {
          this.targetGrid[letter][number]=targetStates.hit;
        }
      } else {
        this.targetGrid[letter][number]=targetStates.miss;
      }
    }
  }

  //toggle highlight for possible placement
  highlightPlacement(pos:Position, state:states){
  
    var letterIndex = this.letters.indexOf(pos.getLetter());
    var numberIndex = this.indices.indexOf(pos.getNumber());

    var i:number;

    let maxRange=Object.keys(this.shipToPlace).length -1;

    for(i=0;i<=maxRange;i++){
      if(this.fleetGrid[this.letters[letterIndex]][this.indices[numberIndex + i]]==states.ship
        ||(this.fleetGrid[this.letters[letterIndex]][this.indices[numberIndex + i]]==states.shipEnd)){
        if(state==states.valid){
          break;
        } else {
          continue;
        }
      }
      if(this.shipToPlace[this.shipsKeys[maxRange-i]]>0||state==this.states.empty){
        this.fleetGrid[this.letters[letterIndex]][this.indices[numberIndex + i]]=state;
      }
    }
    for(i=1;i<=maxRange;i++){
      if(this.fleetGrid[this.letters[letterIndex]][this.indices[numberIndex - i]]==states.ship
        ||(this.fleetGrid[this.letters[letterIndex]][this.indices[numberIndex - i]]==states.shipEnd)){
        if(state==states.valid){
          break;
        } else {
          continue;
        }
      }
      if(this.shipToPlace[this.shipsKeys[maxRange-i]]>0||state==this.states.empty){
        this.fleetGrid[this.letters[letterIndex]][this.indices[numberIndex - i]]=state;
      }
    }
    for(i=1;i<=maxRange;i++){
      if((this.fleetGrid[this.letters[letterIndex + i]]==null)
      ||(this.fleetGrid[this.letters[letterIndex + i]][this.indices[numberIndex]]==states.shipEnd)
      ||(this.fleetGrid[this.letters[letterIndex + i]][this.indices[numberIndex]]==states.ship)){
        if(state==states.valid){
          break;
        } else {
          continue;
        }      
      }
      if(this.shipToPlace[this.shipsKeys[maxRange-i]]>0||state==this.states.empty){
        this.fleetGrid[this.letters[letterIndex + i]][this.indices[numberIndex]]=state;
      }
    }
    for(i=1;i<=maxRange;i++){
      if((this.fleetGrid[this.letters[letterIndex - i]]==null)
      ||(this.fleetGrid[this.letters[letterIndex - i]][this.indices[numberIndex]]==states.ship)
      ||(this.fleetGrid[this.letters[letterIndex - i]][this.indices[numberIndex]]==states.shipEnd)){
        if(state==states.valid){
          break;
        } else {
          continue;
        }
      }
      if(this.shipToPlace[this.shipsKeys[maxRange-i]]>0||state==this.states.empty){
        this.fleetGrid[this.letters[letterIndex - i]][this.indices[numberIndex]]=state;
      }
    }
  }

  highlightProjection(event,state:states){
    var target = event.target.id.split("-",3);
    var letter = target[1];
    var number:string = target[2];
    var pos = new Position(letter,Number(number));

    let maxRange=Object.keys(this.shipToPlace).length -1;

    if(this.fleetGrid[pos.getLetter()][pos.getNumber()]==states.valid
    ||this.fleetGrid[pos.getLetter()][pos.getNumber()]==states.projection){

      var letterDiff =  this.letters.indexOf(pos.getLetter()) - this.letters.indexOf(this.origin.getLetter());
      var numberDiff = this.indices.indexOf(pos.getNumber()) - this.indices.indexOf(this.origin.getNumber());

      var i:number = 0;
      if (letterDiff < 0){
        for(i=0;i<=(-letterDiff);i++){
          if(state==this.states.valid){
            if(this.shipToPlace[this.shipsKeys[maxRange-i]]>0){
              this.fleetGrid
              [this.letters[this.letters.indexOf(this.origin.getLetter()) - i]]
              [this.indices[this.indices.indexOf(this.origin.getNumber())]]=state;
            } else {
              this.fleetGrid
              [this.letters[this.letters.indexOf(this.origin.getLetter()) - i]]
              [this.indices[this.indices.indexOf(this.origin.getNumber())]]=states.empty;
            }
          } else {
            this.fleetGrid
            [this.letters[this.letters.indexOf(this.origin.getLetter()) - i]]
            [this.indices[this.indices.indexOf(this.origin.getNumber())]]=state;
          }
        } 
      } else {
        for(i=0;i<=letterDiff;i++){
          if(state==this.states.valid){
            if(this.shipToPlace[this.shipsKeys[maxRange-i]]>0){
              this.fleetGrid
              [this.letters[this.letters.indexOf(this.origin.getLetter()) + i]]
              [this.indices[this.indices.indexOf(this.origin.getNumber())]]=state;
            } else {
              this.fleetGrid
              [this.letters[this.letters.indexOf(this.origin.getLetter()) + i]]
              [this.indices[this.indices.indexOf(this.origin.getNumber())]]=states.empty;
            }
          } else {            
            this.fleetGrid
            [this.letters[this.letters.indexOf(this.origin.getLetter()) + i]]
            [this.indices[this.indices.indexOf(this.origin.getNumber())]]=state;
          }
        }
      }
      if (numberDiff < 0){
        for(i=0;i<=(-numberDiff);i++){
          if(state==this.states.valid){
            if(this.shipToPlace[this.shipsKeys[maxRange-i]]>0){
              this.fleetGrid
              [this.letters[this.letters.indexOf(this.origin.getLetter())]]
              [this.indices[this.indices.indexOf(this.origin.getNumber()) - i]]=state;
            } else {
              this.fleetGrid
              [this.letters[this.letters.indexOf(this.origin.getLetter())]]
              [this.indices[this.indices.indexOf(this.origin.getNumber()) - i]]=states.empty;
            }
          } else {            
            this.fleetGrid
            [this.letters[this.letters.indexOf(this.origin.getLetter())]]
            [this.indices[this.indices.indexOf(this.origin.getNumber()) - i]]=state;
          }
        } 
      } else {
        for(i=0;i<=numberDiff;i++){
          if(state==this.states.valid){
            if(this.shipToPlace[this.shipsKeys[maxRange-i]]>0){
              this.fleetGrid
              [this.letters[this.letters.indexOf(this.origin.getLetter())]]
              [this.indices[this.indices.indexOf(this.origin.getNumber()) + i]]=state;
            } else {
              this.fleetGrid
              [this.letters[this.letters.indexOf(this.origin.getLetter())]]
              [this.indices[this.indices.indexOf(this.origin.getNumber()) + i]]=states.empty;
            }
          } else {            
            this.fleetGrid
            [this.letters[this.letters.indexOf(this.origin.getLetter())]]
            [this.indices[this.indices.indexOf(this.origin.getNumber()) + i]]=state;
          }
        }
      }
    }
  }

  putShip(event){
    var target = event.target.id.split("-",3);
    var letter = target[1];
    var number:string = target[2];
    var pos = new Position(letter,Number(number));

    if(this.fleetGrid[pos.getLetter()][pos.getNumber()]==states.projection){
      
      var letterDiff =  this.letters.indexOf(pos.getLetter()) - this.letters.indexOf(this.origin.getLetter());
      var numberDiff = this.indices.indexOf(pos.getNumber()) - this.indices.indexOf(this.origin.getNumber());
      var direction;
      var diffLength;

      if(letterDiff==0){
        if(numberDiff==0){
          direction = Orientation.North;
          diffLength = 0;
        } else if(numberDiff>0){
          direction = Orientation.South;
          diffLength = numberDiff;
        } else {
          direction = Orientation.North;
          diffLength = -numberDiff;
        }
      } else if(letterDiff>0){
        direction = Orientation.East;
        diffLength = letterDiff;
      } else {
        direction = Orientation.West;
        diffLength = -letterDiff;
      }
      
      var newShip;
      switch(diffLength){
        case 0:
          newShip = new Submarine(this.origin,direction);
          this.shipToPlace['submarines']--;
          break;
        case 1:
          newShip = new Destroyer(this.origin,direction);
          this.shipToPlace['destroyers']--;
          break;
        case 2:
          newShip = new Cruiser(this.origin,direction);
          this.shipToPlace['cruisers']--;
          break;
        case 3:
          newShip = new Battleship(this.origin,direction);
          this.shipToPlace['battleships']--;
          break;
        case 4:
          newShip = new Carrier(this.origin,direction);
          this.shipToPlace['carriers']--;
          break;
        default:{
          console.log(console.error("abnormal length, ship creation failed"));
          return;
        }
      }
      this.gameService.shipsToPlace
      this.gameService.saveShip(newShip);
      var shipsRemaining = 0;
      this.shipsKeys.forEach(key => {
        shipsRemaining += this.shipToPlace[key];
      });
      if (shipsRemaining == 0){
        this.placement=false;
      }
    }
  }

  drawShip(ship:Ship){
    var i:number;
    var length = ship.getSize()-1;

    this.fleetGrid
    [this.letters[this.letters.indexOf(ship.getPosition().getLetter())]]
    [this.indices[this.indices.indexOf(ship.getPosition().getNumber())]]=states.shipEnd;
    
    for(i=1;i<length;i++){
      switch(ship.getOrientation()){
        case Orientation.North:
          this.fleetGrid
          [this.letters[this.letters.indexOf(ship.getPosition().getLetter())]]
          [this.indices[this.indices.indexOf(ship.getPosition().getNumber()) - i]]=states.ship;
          break;
        case Orientation.South:
          this.fleetGrid
          [this.letters[this.letters.indexOf(ship.getPosition().getLetter())]]
          [this.indices[this.indices.indexOf(ship.getPosition().getNumber()) + i]]=states.ship;
          break;
        case Orientation.West:
          this.fleetGrid
          [this.letters[this.letters.indexOf(ship.getPosition().getLetter()) - i]]
          [this.indices[this.indices.indexOf(ship.getPosition().getNumber())]]=states.ship;
          break;
        case Orientation.East:
          this.fleetGrid
          [this.letters[this.letters.indexOf(ship.getPosition().getLetter()) + i]]
          [this.indices[this.indices.indexOf(ship.getPosition().getNumber())]]=states.ship;
          break;
      }
    }

    switch(ship.getOrientation()){
      case Orientation.North:
        this.fleetGrid
        [this.letters[this.letters.indexOf(ship.getPosition().getLetter())]]
        [this.indices[this.indices.indexOf(ship.getPosition().getNumber()) - length]]=states.shipEnd;
        break;
      case Orientation.South:
        this.fleetGrid
        [this.letters[this.letters.indexOf(ship.getPosition().getLetter())]]
        [this.indices[this.indices.indexOf(ship.getPosition().getNumber()) + length]]=states.shipEnd;
        break;
      case Orientation.West:
        this.fleetGrid
        [this.letters[this.letters.indexOf(ship.getPosition().getLetter()) - length]]
        [this.indices[this.indices.indexOf(ship.getPosition().getNumber())]]=states.shipEnd;
        break;
      case Orientation.East:
        this.fleetGrid
        [this.letters[this.letters.indexOf(ship.getPosition().getLetter()) + length]]
        [this.indices[this.indices.indexOf(ship.getPosition().getNumber())]]=states.shipEnd;
        break;
    }
  }

  drawShips(){
    var ships:Ship[] = this.gameService.getShips();
    ships.forEach(element => {
      this.drawShip(element);
    });
  }

  place(event){

    var target = event.target.id.split("-",3);
    var letter = target[1];
    var number:string = target[2];
    var targetPosition = new Position(letter,Number(number));

    if(this.origin==null && this.fleetGrid[targetPosition.getLetter()][targetPosition.getNumber()]==states.empty){

      this.origin=targetPosition;

      this.highlightPlacement(this.origin,states.valid);

      this.highlightProjection(event,states.projection);

    } else if(this.fleetGrid[targetPosition.getLetter()][targetPosition.getNumber()]==states.projection) {

      // this.highlightProjection(event,states.ship);
      
      this.putShip(event);
      
      this.highlightPlacement(this.origin,states.empty);

      this.drawShips();

      this.origin=null;
      
    } else if(this.origin!=null){

      this.highlightPlacement(this.origin,states.empty);
      this.origin=null;
    }
  }

}
