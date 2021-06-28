import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from "../auth-service";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
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
  pic = "assets/user.png";
  todoCollection!: AngularFirestoreCollection<Todo>;
  todoList: Observable<Todo[]> | undefined;
  todoDoc!: AngularFirestoreDocument<Todo>;
  inputId!: string;
  inputValue: Todo = {
    content: "",
  }
  editValue: boolean = false;

  //getting the number of completed task
  completed!: number;

  //getting the number of task not completed
  not_completed!: number;

  // getting the number of tasks 
  task!: number

  user=""

  // getting dom element in html 
  @ViewChild('mySidebar', { static: false })
  mySidebar!: ElementRef;
  @ViewChild('myOverlay', { static: false })
  myOverlay!: ElementRef;

  // Observable which will hold an array of todo
  todoList$: Observable<Todo[]>;


  constructor(private db: AngularFirestore, public AuthService: AuthService ) {

    
    this.user = AuthService.userState.email
    const user= AuthService.userState.email






    this.todoCollection = this.db.collection("Todolist")

  


  

    // The code below will query all the todo
    this.todoList$ = this.db.collection<Todo>("Todolist")
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Todo;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );


  }

  ngOnInit() {


    this.todoList$.subscribe(data => {
      this.task = data.length
      this.completed = data.filter(o => o.isDone === true).length;
      this.not_completed = data.filter(o => o.isDone === false).length
    })

    console.log(this.user)


  }


  // when the window size change 
  open() {
    if (this.mySidebar.nativeElement.style.display === 'block') {
      this.mySidebar.nativeElement.style.display = 'none';
      this.myOverlay.nativeElement.style.display = "none";
    } else {
      this.mySidebar.nativeElement.style.display = 'block';
      this.myOverlay.nativeElement.style.display = "block";
    }
  }


  close() {
    this.mySidebar.nativeElement.style.display = 'none';
    this.myOverlay.nativeElement.style.display = "none";
  }

  // add to do and store in database 
  addNewItem() {
    if (this.inputValue.content != "") {
      this.inputValue.datemodified = new Date();
      this.inputValue.isDone = false;
      this.todoCollection.add(this.inputValue);
      this.inputValue.content = "";

    }
  }

  //delete task from firestore

  deleteItem(i: any) {
    this.todoDoc = this.db.doc(`${this.user}/${i}`);
    this.todoDoc.delete();
  }

  

  saveNewItem() {
    if (this.inputValue.content != "") {
      this.inputValue.isDone = false;
      this.inputValue.datemodified = new Date();
      this.todoDoc = this.db.doc(`${this.user}/${this.inputId}`);
      this.todoDoc.update(this.inputValue);
      this.editValue = false;
      this.inputValue.content = "";
    }
  }
  //mark item as done
  markItemAsDone(item: any) {
    this.inputValue.content = item.content;
    this.inputValue.isDone = true;
    this.todoDoc = this.db.doc(`${this.user}/${item.id}`);
    this.todoDoc.update(this.inputValue);
    this.inputValue.content = "";
  }

  //mark item as not done 
  markItemAsNotDone(item: any) {
    this.inputValue.content = item.content;
    this.inputValue.isDone = false;
    this.todoDoc = this.db.doc(`${this.user}/${item.id}`);
    this.todoDoc.update(this.inputValue);
    this.inputValue.content = "";

  }

  // edit item
  editItem(i: any) {
    this.inputValue.content = i.content;
    this.editValue = true;
    this.inputId = i.id;
  }


}


