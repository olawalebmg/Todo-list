import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { AuthService } from "../auth-service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{
  user= "assets/user.png";

  
  @ViewChild('mySidebar', { static: false })
  mySidebar!: ElementRef;
  @ViewChild('overlayBg', { static: false })
  overlayBg!: ElementRef;
 

  constructor(public AuthService:AuthService) { }


  ngOnInit(): void {}

    open(){ if (this.mySidebar.nativeElement.style.display === 'block') {
      this.mySidebar.nativeElement.style.display = 'none';
      this.overlayBg.nativeElement.style.display = "none";
    } else {
      this.mySidebar.nativeElement.style.display = 'block';
      this.overlayBg.nativeElement.style.display = "block";
    }}


    close(){
      this.mySidebar.nativeElement.style.display = 'none';
      this.overlayBg.nativeElement.style.display = "none";
    }
  

 




  }



