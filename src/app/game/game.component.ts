import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms'
import { Carrier, Battleship, Cruiser, Destroyer, Submarine, Ship } from '../models/ships.model'
import { Position } from '../models/position.model'
import { empty } from 'rxjs';

export enum states {
  empty,
  valid,
  projection,
  ship
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

  targetGrid:{[key:string]:{[key:number]:boolean}};
  fleetGrid:{[key:string]:{[key:number]:states}};

  states;

  //For ship placement  
  shipForm: FormGroup;

  //to put in another file
  shipsKeys;
  ships:{[key:string]:number} = {
    ['carriers']:1,
    ['battleships']:1,
    ['cruisers']:1,
    ['destroyers']:2,
    ['submarines']:2}

  origin:Position=null;

  constructor(private fb: FormBuilder) {  }

  ngOnInit(){
    this.shipsKeys = Object.keys(this.ships)
    this.states=states;


    this.indices = Position.indices;
    this.letters = Position.letters;

    this.initGrid();

    this.placement = true;

    this.shipForm = this.fb.group({
      shipSelect: ['5']
    });
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
        this.targetGrid[letter][number]=false;
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
    if(!this.targetGrid[letter][number]){
      this.targetGrid[letter][number]=true;
    }
  }

  //toggle highlight for possible placement
  highlightPlacement(pos:Position, state:states){
  
    var letterIndex = this.letters.indexOf(pos.getLetter());
    var numberIndex = this.indices.indexOf(pos.getNumber());

    var i:number;
    let maxRange=5;

    if(this.fleetGrid[this.letters[letterIndex]][this.indices[numberIndex]]!=states.ship){
      this.fleetGrid[this.letters[letterIndex]][this.indices[numberIndex]]=state;
    }
    

    for(i=1;i<maxRange;i++){
      if(this.fleetGrid[this.letters[letterIndex]][this.indices[numberIndex + i]]==states.ship){
        if(state==states.valid){
          break;
        } else {
          continue;
        }
      }
      if(this.ships[this.shipsKeys[maxRange-i]]>0){
        this.fleetGrid[this.letters[letterIndex]][this.indices[numberIndex + i]]=state;
      }
    }
    for(i=1;i<maxRange;i++){
      if(this.fleetGrid[this.letters[letterIndex]][this.indices[numberIndex - i]]==states.ship){
        if(state==states.valid){
          break;
        } else {
          continue;
        }
      }
      if(this.ships[this.shipsKeys[maxRange-i]]>0){
        this.fleetGrid[this.letters[letterIndex]][this.indices[numberIndex - i]]=state;
      }
    }
    for(i=1;i<maxRange;i++){
      if((this.fleetGrid[this.letters[letterIndex + i]]==null)
      ||(this.fleetGrid[this.letters[letterIndex + i]][this.indices[numberIndex]]==states.ship)){
        if(state==states.valid){
          break;
        } else {
          continue;
        }      
      }
      if(this.ships[this.shipsKeys[maxRange-i]]>0){
        this.fleetGrid[this.letters[letterIndex + i]][this.indices[numberIndex]]=state;
      }
    }
    for(i=1;i<maxRange;i++){
      if((this.fleetGrid[this.letters[letterIndex - i]]==null)
      ||(this.fleetGrid[this.letters[letterIndex - i]][this.indices[numberIndex]]==states.ship)){
        if(state==states.valid){
          break;
        } else {
          continue;
        }
      }
      if(this.ships[this.shipsKeys[maxRange-i]]>0){
        this.fleetGrid[this.letters[letterIndex - i]][this.indices[numberIndex]]=state;
      }
    }
  }

  highlightProjection(event,state:states){
    var target = event.target.id.split("-",3);
    var letter = target[1];
    var number:string = target[2];
    var pos = new Position(letter,Number(number));
    if(this.fleetGrid[pos.getLetter()][pos.getNumber()]==states.valid
    ||this.fleetGrid[pos.getLetter()][pos.getNumber()]==states.projection){

      var letterDiff =  this.letters.indexOf(pos.getLetter()) - this.letters.indexOf(this.origin.getLetter());
      var numberDiff = this.indices.indexOf(pos.getNumber()) - this.indices.indexOf(this.origin.getNumber());

      this.fleetGrid
      [this.letters[this.letters.indexOf(this.origin.getLetter())]]
      [this.indices[this.indices.indexOf(this.origin.getNumber())]]=state;

      var i:number = 0;
      if (letterDiff < 0){
        for(i=0;i>=letterDiff;i--){
          this.fleetGrid
          [this.letters[this.letters.indexOf(this.origin.getLetter()) + i]]
          [this.indices[this.indices.indexOf(this.origin.getNumber())]]=state;
        } 
      } else {
        for(i=0;i<=letterDiff;i++){
          this.fleetGrid
          [this.letters[this.letters.indexOf(this.origin.getLetter()) + i]]
          [this.indices[this.indices.indexOf(this.origin.getNumber())]]=state;
        }
      }
    
      if (numberDiff < 0){
        for(i=0;i>=numberDiff;i--){
          this.fleetGrid
          [this.letters[this.letters.indexOf(this.origin.getLetter())]]
          [this.indices[this.indices.indexOf(this.origin.getNumber()) + i]]=state;
        } 
      } else {
        for(i=0;i<=numberDiff;i++){
          this.fleetGrid
          [this.letters[this.letters.indexOf(this.origin.getLetter())]]
          [this.indices[this.indices.indexOf(this.origin.getNumber()) + i]]=state;
        }
      }
    }
  }

  place(event){

    var target = event.target.id.split("-",3);
    var letter = target[1];
    var number:string = target[2];

    if(this.origin==null){

      this.origin=new Position(letter,Number(number));

      this.highlightPlacement(this.origin,states.valid);

      this.highlightProjection(event,states.projection);
    } else {

      this.highlightProjection(event,states.ship);
      
      this.highlightPlacement(this.origin,states.empty);

      this.origin=null;
    }
  }

}
