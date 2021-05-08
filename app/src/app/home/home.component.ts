import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  one= "assets/one.jpeg";
  two="assets/two.png"
  three="assets/three.png";
  four="assets/four.jpeg";

  constructor() { }

  ngOnInit(): void {
  }

}
