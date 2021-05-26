import { Injectable, NgZone } from '@angular/core';
import firebase from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";


export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    emailVerified: boolean;
 }

@Injectable({
  providedIn: 'root'
})



export class AuthService {
    userState: any;

    constructor(
      public afs: AngularFirestore,
      public afAuth: AngularFireAuth,
      public router: Router,
      public ngZone: NgZone,
    
    ) {
      this.afAuth.authState.subscribe(user => {
        if (user) {
          this.userState = user;
          localStorage.setItem('user', JSON.stringify(this.userState));
          JSON.parse(localStorage.getItem('user')||"");
        } else {
          localStorage.setItem('user', "null");
          JSON.parse(localStorage.getItem('user')||"");
        }
      })
    }
  
    async SignIn(email:string, password:string) {
      try {
            const result = await this.afAuth.signInWithEmailAndPassword(email, password);
            console.log("djdjdjdj")
            this.ngZone.run(() => {
                this.router.navigate(['dashboard']);
            });
            this.SetUserData(result.user);
        } catch (error) {
            window.alert(error.message);
        }
    }
  
    async SignUp(email:string, password:string) {
      try {
            const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
            this.SetUserData(result.user);
        } catch (error) {
            window.alert(error.message);
        }
    }

  
    async ForgotPassword(passwordResetEmail:string) {
      try {
            await this.afAuth.sendPasswordResetEmail(passwordResetEmail);
            window.alert('Password reset email sent, check your inbox.');
        } catch (error) {
            window.alert(error);
        }
    }
  
    get isLoggedIn(): boolean {
      const user = JSON.parse(localStorage.getItem('user')||"");
      return (user !== null && user.emailVerified == false) ? true : false;
    }
  
    GoogleAuth() {
      return this.AuthLogin(new firebase.auth.GoogleAuthProvider());
    }
  
    async AuthLogin(provider:any) {
      try {
            const result = await this.afAuth.signInWithPopup(provider);
            this.ngZone.run(() => {
                this.router.navigate(['dashboard']);
            });
            this.SetUserData(result.user);
        } catch (error) {
            window.alert(error);
        }
    }
  
    SetUserData(user:any) {
      const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
      const userState: User = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified
      }
      return userRef.set(userState, {
        merge: true
      })
    }
   
    async SignOut() {
      await this.afAuth.signOut();
        localStorage.removeItem('user');
        this.router.navigate(['login']);
    }  
}

function mail(mail: any) {
    throw new Error('Function not implemented.');
}

