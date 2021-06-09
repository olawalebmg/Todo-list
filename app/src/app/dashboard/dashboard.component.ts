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



  // getting dom element in html 
  @ViewChild('mySidebar', { static: false })
  mySidebar!: ElementRef;
  @ViewChild('overlayBg', { static: false })
  overlayBg!: ElementRef;

  // Observable which will hold an array of todo
  todoList$: Observable<Todo[]>;


  constructor(private db: AngularFirestore, public AuthService: AuthService) {


    this.todoCollection = this.db.collection('Todolist');

    // The code below will query all the todo
    // and return id + data (e.g. title, description)
    this.todoList$ = this.db.collection<Todo>('Todolist')
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






  open() {
    if (this.mySidebar.nativeElement.style.display === 'block') {
      this.mySidebar.nativeElement.style.display = 'none';
      this.overlayBg.nativeElement.style.display = "none";
    } else {
      this.mySidebar.nativeElement.style.display = 'block';
      this.overlayBg.nativeElement.style.display = "block";
    }
  }


  close() {
    this.mySidebar.nativeElement.style.display = 'none';
    this.overlayBg.nativeElement.style.display = "none";
  }

  // add to do and store in database 
  addNewItem() {
    if (this.inputValue.content != "") {
      this.inputValue.datemodified = new Date();
      this.inputValue.isDone = false;
      this.todoCollection.add(this.inputValue);
      this.inputValue.content = "";
      console.log("Added Successfuly!");
    }
  }

  deleteItem(i: any) {
    this.todoDoc = this.db.doc(`Todolist/${i}`);
    this.todoDoc.delete();
    console.log("Item Deleted!");
  }

  saveNewItem() {
    if (this.inputValue.content != "") {
      this.inputValue.isDone = false;
      this.inputValue.datemodified = new Date();
      this.todoDoc = this.db.doc(`Todolist/${this.inputId}`);
      this.todoDoc.update(this.inputValue);
      this.editValue = false;
      this.inputValue.content = "";
      console.log("Updated Successfuly!", "Dismiss");
    }
  }

  markItemAsDone(item:any) {
    this.inputValue.content = item.content;
    this.inputValue.isDone = true;
    this.todoDoc = this.db.doc(`Todolist/${item.id}`);
    this.todoDoc.update(this.inputValue);
    this.inputValue.content = "";
    console.log("Item Done!");
  }
  markItemAsNotDone(item:any) {
    this.inputValue.content = item.content;
    this.inputValue.isDone = false;
    this.todoDoc = this.db.doc(`Todolist/${item.id}`);
    this.todoDoc.update(this.inputValue);
    this.inputValue.content = "";
    console.log("Item Not Done!");
  }

  editItem(i:any) {
    this.inputValue.content = i.content;
    this.editValue = true;
    this.inputId = i.id;
  }


}
