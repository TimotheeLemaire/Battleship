import { Injectable, OnInit } from '@angular/core';
import { Carrier, Battleship, Cruiser, Destroyer, Submarine, Ship } from './models/ships.model'
import { Position } from './models/position.model'
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { game } from './models/game.model';
import {Router} from '@angular/router';
import { Options } from 'selenium-webdriver/safari';
import { Hit, Results } from './models/hit.model';
import { delay } from 'q';

@Injectable({
  providedIn: 'root'
})
export class GameService implements OnInit{

  user = {"name":"Mario"};

  existingGames: Subject<game[]> = new Subject<game[]>();

  currentGame:game;

  playerTurn: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);

  Hit: Subject<Hit> = new Subject<Hit>();

  opponentHit: Subject<Hit> = new Subject<Hit>();

  // :{[key:string]:number} =
  shipsToPlace:{[key:string]:number} = {
    ['carriers']:1,
    ['battleships']:1,
    ['cruisers']:1,
    ['destroyers']:2,
    ['submarines']:2
  };

  ships:Ship[];
  
  constructor(private http:HttpClient, private router : Router) { 
    this.ships = [];
  }
  
  ngOnInit(){
    this.existingGames.next([]);
  }

  saveShip(ship:Ship){
    this.ships.push(ship);
  }
  
  getShips():Ship[] {
    return this.ships;
  }

  allShipPlaced():Boolean{
    var shipsRemaining = 0;
      Object.keys(this.shipsToPlace).forEach(key => {
        shipsRemaining += this.shipsToPlace[key];
      });
      if (shipsRemaining == 0){
        return true;
      } else {
        return false;
      }
  }

  //network calls
  postNewGame(){
     this.http.post(environment.BASE_URL+"/games",this.user).subscribe((result:game) => {
       this.currentGame = result;
     })
  }

  putP2(game:game){
    this.http.put(environment.BASE_URL+"/games/"+game.id,this.user)
      .subscribe(
        (result:game) => {
          this.currentGame = result;
          console.log(result);
          this.router.navigateByUrl('/game');
        },
        (error) => {
          this.getGames();
        }
      )
  }

  getGames(){
    this.http.get(environment.BASE_URL+"/games").subscribe((result:game[]) => {
      this.existingGames.next(result);
    });
  }

  putFleet(){
    if(this.currentGame!=null){
      this.http.put(
        environment.BASE_URL+"/games/"+this.currentGame.id+"/fleet",
        {"player":this.user,"fleet":this.getShips()}
        ).subscribe((result:game) => {
          this.currentGame=result;
          this.getPlayerTurn();
        })
    }
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
  //actually wait for next turn by long polling;
  getPlayerTurn(){
    this.http.get(environment.BASE_URL+"/games/"+this.currentGame.id+"/turn",
    {
      params:{"player":this.user.name}
    })
    .subscribe(
      (result:Boolean) => {
        this.getLastHit();
        this.playerTurn.next(result);
        console.log(result);
      },
      (error) => {
        console.log(error);
        delay(1000).then(()=>{
          this.getPlayerTurn();
        })
      }
    );
  }

  getLastHit(){
    this.http.get(environment.BASE_URL+"/games/"+this.currentGame.id+"/hit",
      {
        params:{"player":this.user.name}
      })
      .subscribe(
        (result:Hit) => {
          if(result!=null){
            this.opponentHit.next(result);
          }
        },
    );
  }

  postHit(pos:Position){
    this.http.post(environment.BASE_URL+"/games/"+this.currentGame.id+"/hit",
      {position:pos,player:this.user})
    .subscribe(
      (response:Hit) => {
        console.log(response);
        this.Hit.next(response);
        this.playerTurn.next(false);
        this.getPlayerTurn();
      }
    );
  }

  //local testing

  // hits:Position[];

  // saveHit(pos:Position){
  //   this.hits.push(pos);
  //   var result=null;
  //   this.ships.forEach(element => {
  //     if(this.matchShip(pos,element))
  //     result = element;
  //   });
  //   return result;
  // }
  
  // private matchShip(pos:Position,ship:Ship){
  //   var result=false;
  //   ship.toPositionArray().forEach(element => {
  //     if(element.equals(pos))
  //       result=true;
  //   });
  //   return result;
  // }

  // isShipSunk(ship:Ship){
  //   var matched = false;
  //   var result = true;
  //   ship.toPositionArray().forEach(shipPos => {
  //     matched=false;
  //     this.hits.forEach(hit =>{
  //       if(shipPos.equals(hit)){
  //         matched = true;
  //       }
  //     })
  //     if(!matched){
  //       result = false;
  //     }
  //   });
  //   return result;
  // }
}
