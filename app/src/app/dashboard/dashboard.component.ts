import { Component, OnInit ,ViewChild, ElementRef } from '@angular/core';
import { AuthService } from "../auth-service";
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument}from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Todo {
  content: string;
  id?: string;
  datemodified?: Date;
  isDone?: boolean;
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  pic= "assets/user.png";
  todoArray = Array();
  todo: any;

  addTodo(value:string) {
    if (value !== "") {
      this.todoArray.push(value);
      //console.log(this.todos)
    } else {
      alert("Field required **");
    }
  }

  // delete item
  deleteItem(todo: any) {
      for (let i = 0; i <= this.todoArray.length; i++) {
        if (todo == this.todoArray[i]) {
          this.todoArray.splice(i, 1);
        }
      }
    }

  
  @ViewChild('mySidebar', { static: false })
  mySidebar!: ElementRef;
  @ViewChild('overlayBg', { static: false })
  overlayBg!: ElementRef;

  // Observable which will hold an array of todo
  todoList$: Observable<Todo[]>;


  constructor(private db: AngularFirestore,public AuthService:AuthService) {
 
  // The code below will query all the todo
  // and return id + data (e.g. title, description)
    this.todoList$ = this.db.collection<Todo>('items')
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Todo;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }
 
  ngOnInit() {
    this.todoList$.subscribe(data => console.log(data));
  }

  
 



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
