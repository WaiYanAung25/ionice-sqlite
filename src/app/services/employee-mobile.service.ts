import { Injectable, WritableSignal, signal } from '@angular/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
const DB_USERS = 'myusersdb';
export interface User {
  id: number;
  name: string;
  department: string;
  position: string;
  phone_number: string;
  nric: string;
}
@Injectable({
  providedIn: 'root',
})
export class SqliteService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private usersSubject: any = new BehaviorSubject<User[]>([]);
  users$: Observable<User[]> = this.usersSubject.asObservable();

  constructor() {}

  async initializePlugin(): Promise<boolean> {
    console.warn('initApplication');
    this.db = await this.sqlite.createConnection(
      DB_USERS,
      false,
      'no encryption',
      1,
      false
    );
    await this.db.open();
    // this.dropTable();
    const schema = `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      department TEXT NOT NULL,
      position TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      dob TEXT NOT NULL,
      nric TEXT NOT NULL,
      salary TEXT NOT NULL
    );`;

    await this.db.execute(schema);

    await this.loadUsers();

    return true;
  }
  // dropTable(): Promise<void> {
  //   const query = 'DROP TABLE IF EXISTS users;';
  //   return this.db.execute(query).then(() => this.loadUsers());
  // }

  loadUsers(): Promise<void> {
    console.warn('==>>>>>>>>>>>>>> getUsers');

    return this.db.query('SELECT * FROM users;').then((result) => {
      console.warn(result, '===>result');
      const users = result.values || [];
      this.usersSubject.next(users);
    });
  }

  addUser({
    name,
    department,
    position,
    phone_number,
    nric,
    dob,
    salary,
  }: any): Promise<any> {
    console.warn(name, '==>>>>>>>> addUser');

    // const query = `
    //   INSERT INTO users
    //   (name, department, position, phone_number, nric, dob, salary)
    //   VALUES (?, ?, ?, ?, ?, ?, ?);
    // `;
    const formattedDob = this.formattedDate(dob);
    // const values = [
    //   name,
    //   department,
    //   position,
    //   phone_number,
    //   nric,
    //   dob,
    //   salary,
    // ];
    // if (!this.db || !this.db.query) {
    //   console.error('Database connection is not properly initialized.');
    //   return Promise.reject(new Error('Database connection issue.'));
    // }
    // return this.db
    //   .query(query, values)
    //   .then(() => this.loadUsers())
    //   .catch((error) => {
    //     console.error('Error inserting user:', error);
    //     throw error; // Propagate the error further if needed
    //   });
    const query = `INSERT INTO users(name, department, position, phone_number,nric,dob,salary) VALUES ('${name}','${department}','${position}','${phone_number}','${nric}','${dob}','${salary}');`;
    return this.db.query(query).then(() => this.loadUsers());
  }

  formattedDate(date: any) {
    if (date instanceof Date) {
      // If date is a JavaScript Date object, convert it to 'YYYY-MM-DD' string
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } else {
      // If date is already a string, assume it's in a valid format
      return date;
    }
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
  }: any): Promise<any> {
    const formattedDob = this.formattedDate(dob);
    console.warn(name, '==>>>>>>>> updateUser');

    const query = `
  UPDATE users
  SET name='${name}',
      department='${department}',
      position='${position}',
      phone_number='${phone_number}',
      nric='${nric}',
      dob='${dob}',
      salary='${salary}'
  WHERE id=${id};
`;
    return this.db.query(query).then(() => this.loadUsers());
  }

  async removeUser(id: string): Promise<any> {
    console.warn(id + 'id must be deleted');
    const query = `DELETE FROM users WHERE id=${id}`;
    await this.db.query(query);
    return await this.loadUsers();
  }

  // // CRUD operations
  // async loadUsers() {
  //   const users = await this.db.query('SELECT * FROM users;');
  //   console.log(users, '=>>>>>>>>>>>>>>>> load user from database');
  //   return users.values;
  //   // this.users.set(users.values || []);
  // }

  // async addUser({ name, department, position, phone_number }: any) {
  //   const query = `INSERT INTO users ( name, department, position, phone_number) VALUES ('${name}','${department}','${position}','${phone_number}');`;
  //   const result = await this.db.query(query);
  //   await this.loadUsers();
  //   return result;
  // }
  // async updateUser({ id, name, department, position, phone_number }: any) {
  //   const query = `UPDATE users SET name=${name}, department=${department}, position=${position}, phone_number=${phone_number} WHERE id=${id}`;
  //   const result = await this.db.query(query);
  //   await this.loadUsers();
  //   return result;
  // }
  // async removeUser({ id, name, department, position, phone_number }: any) {
  //   const query = `DELETE FROM users WHERE id=${id}`;
  //   const result = await this.db.query(query);
  //   await this.loadUsers();
  //   return result;
  // }
}
