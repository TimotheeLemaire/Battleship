import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  
  hoverCol:string = "";
  hoverRow:string = "";

  indices: number[] = [1,2,3,4,5,6,7,8,9,10];
  letters: string[] = ["A","B","C","D","E","F","G","H","I","J"];

  targetGrid:{[key:string]:{[key:number]:boolean}};
  constructor() { }

  ngOnInit(){
    var i:number = 0;
    var j:number = 0;
    this.targetGrid = {};

    this.letters.forEach(letter => {
      this.targetGrid[letter] = {};

      this.indices.forEach(number => {
        this.targetGrid[letter][number]=false;
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

}
