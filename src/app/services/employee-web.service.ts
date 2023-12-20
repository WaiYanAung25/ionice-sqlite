import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';

const STORAGE_KEY = 'usersData';

export interface User {
  id: number;
  name: string;
  department: string;
  position: string;
  phone_number: string;
  nric: string;
  dob: string;
  salary: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeWebService {
  private usersSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>(
    []
  );
  users$: Observable<User[]> = this.usersSubject.asObservable();

  constructor() {
    this.loadUsers();
  }

  initializePlugin(): Promise<boolean> {
    return Promise.resolve(true); // No initialization needed for localStorage
  }

  loadUsers(): void {
    const storedDataString = localStorage.getItem(STORAGE_KEY);

    if (storedDataString) {
      const users = JSON.parse(storedDataString);
      this.usersSubject.next(users);
    }
  }

  addUser({
    name,
    department,
    position,
    phone_number,
    nric,
    dob,
    salary,
  }: any): void {
    const formattedDob = this.formattedDate(dob);

    const newUser: User = {
      id: this.generateUniqueId(), // You need to implement a unique ID generation logic
      name,
      department,
      position,
      phone_number,
      nric,
      dob: formattedDob,
      salary,
    };

    const currentUsers = this.usersSubject.value;
    const updatedUsers = [...currentUsers, newUser];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
    this.usersSubject.next(updatedUsers);
  }

  updateUser({
    id,
    name,
    department,
    position,
    phone_number,
    nric,
    dob,
    salary,
  }: any): void {
    const formattedDob = this.formattedDate(dob);

    const updatedUsers = this.usersSubject.value.map((user) =>
      user.id === id
        ? {
            ...user,
            name,
            department,
            position,
            phone_number,
            nric,
            dob: formattedDob,
            salary,
          }
        : user
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
    this.usersSubject.next(updatedUsers);
  }

  removeUser(id: string): void {
    const updatedUsers = this.usersSubject.value.filter(
      (user) => user.id !== parseInt(id)
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
    this.usersSubject.next(updatedUsers);
  }

  formattedDate(date: any) {
    console.warn(date, 'formattedDate');
    if (date instanceof Date) {
      console.warn('formattedDate work');
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } else {
      return date;
    }
  }

  private generateUniqueId(): number {
    // You need to implement a unique ID generation logic based on your requirements
    return Math.floor(Math.random() * 1000000);
  }
}
