import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  private menuOppened: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  toggleMenu() {
    this.menuOppened = !this.menuOppened;
    console.log(this.menuOppened);
  }

}
