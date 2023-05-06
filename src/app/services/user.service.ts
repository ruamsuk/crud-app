import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData, deleteDoc, doc,
  Firestore, updateDoc
} from '@angular/fire/firestore';
import { User } from '../models/user.model';
import { from, Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private firestore: Firestore
  ) {
  }

  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    dob: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
    education: new FormControl('', Validators.required),
    company: new FormControl('', Validators.required),
    experience: new FormControl('', Validators.required),
    package: new FormControl('', Validators.required),
  });

  addUser(user: User): Observable<any> {
    const docRef = collection(this.firestore, 'users');
    return from(addDoc(docRef, user));
  }

  getUsers(): Observable<any> {
    const dbInstance = collection(this.firestore, 'users');
    return from(collectionData(dbInstance, {idField: 'id'}));
  }

  updateUser(user: any): Observable<any> {
    const docInstance = doc(this.firestore, `users/${user.id}`);

    return from(updateDoc(docInstance, {...user}));
  }

  deleteUser(id: string): Observable<any> {
    const docInstance = doc(this.firestore, 'users', id);
    return from(deleteDoc(docInstance));
  }
}
