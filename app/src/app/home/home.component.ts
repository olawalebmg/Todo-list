import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router:Router) { }

  ngOnInit(): void {
  }
 
  login_page(){
    this.router.navigate(["login"])



  }

}
