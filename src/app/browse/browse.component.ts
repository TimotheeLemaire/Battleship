import { Component, OnInit } from '@angular/core';
import { game } from '../models/game.model';
import { GameService } from '../game.service'

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit {

  gameService:GameService;

  constructor(gameService: GameService) { 
    this.gameService=gameService;
  }
  games:game[] = [];

  ngOnInit() {
    this.gameService.existingGames.subscribe(newValues => {
      this.games = newValues;
      console.log(this.games);
    })
    this.gameService.getGames();
  }

  joinGame(game:game){
    this.gameService.user = {"name":"Luigi"};
    this.gameService.putP2(game);
  }

}
