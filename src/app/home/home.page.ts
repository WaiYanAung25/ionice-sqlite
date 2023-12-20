import {
  Component,
  ViewChild,
  OnInit,
  OnDestroy,
  AfterViewInit,
  WritableSignal,
  computed,
} from '@angular/core';
import { SqliteService, User } from '../services/employee-mobile.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PeriodicElement } from './employee';
import { Subscription } from 'rxjs';
import { ModalController, Platform } from '@ionic/angular';
import { EmployeFormModalComponent } from '../employe-form-modal/employe-form-modal.component';
import { EmployeeWebService } from '../services/employee-web.service';
import { FilterListService } from '../services/filter-list.service';
import { FilterEmployeModalComponent } from '../filter-employe-modal/filter-employe-modal.component';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {
  isWarningModalOpen = false;
  isSuccessModalOpen = false;
  private filterSubscription: Subscription;
  isFilter: boolean = false;
  userId!: string;

  displayedColumns: string[] = [
    'name',
    'department',
    'position',
    'phone_number',
    'nric',
    'delete',
    'update',
  ];
  // dataSource: any;
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  paginator!: MatPaginator;
  totalRecords: number = 0;
  pageSize: number = 5;
  userList: any;
  @ViewChild(MatPaginator)
  usersSubscription: Subscription | undefined;
  // paginator!: MatPaginator;

  constructor(
    private sqliteService: SqliteService,
    private modalController: ModalController,
    private platform: Platform,
    private employeeWebService: EmployeeWebService,
    private filterService: FilterListService
  ) {
    this.dataSource = new MatTableDataSource<PeriodicElement>([]);
    this.filterSubscription = this.filterService.filter$.subscribe((filter) => {
      // Call a getUerlist to apply the filter criteria to the data service
      this.getUerlist(filter);
    });
  }
  ngOnInit() {
    this.getUerlist({});
  }
  ngAfterViewInit() {
    console.warn('=====> AfterViewInit', this.paginator);
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }
  getUerlist(filters: any = {}) {
    this.isFilter = Object.keys(filters).length !== 0;
    if (this.platform.is('mobile')) {
      this.usersSubscription = this.sqliteService.users$.subscribe(
        (users: any) => {
          console.warn('user subscribe successfully users', users);
          // this.dataSource.data = users;
          const filteredUsers = this.filterUsers(users, filters);

          this.dataSource = new MatTableDataSource<PeriodicElement>(
            filteredUsers
          );
          this.totalRecords = this.dataSource.data.length;

          this.userList = filteredUsers;
          return users || [];
          // this.dataSource.data = this.dummy;
        }
      );
    } else {
      this.usersSubscription = this.employeeWebService.users$.subscribe(
        (users: any) => {
          console.warn('User subscribe successfully:', users);

          // Apply filtering based on the provided filters
          const filteredUsers = this.filterUsers(users, filters);

          this.dataSource = new MatTableDataSource<PeriodicElement>(
            filteredUsers
          );
          this.totalRecords = this.dataSource.data.length;

          this.userList = filteredUsers;
        }
      );
    }
  }

  filterUsers(users: any[], filters: any): any[] {
    if (!filters || Object.keys(filters).length === 0) {
      // If filters are empty, return the original array
      return users;
    }

    return users.filter((user) => {
      // Check each filter criterion
      return Object.entries(filters).every(([key, value]: any) => {
        if (key === 'dob') {
          // Special handling for date filtering
          return this.dateFilter(user[key], value);
        } else if (key === 'salary') {
          return this.salaryFilter(user[key], value);
        } else {
          return this.standardFilter(user[key], value, key);
        }
      });
    });
  }
  dateFilter(userValue: any, filterValue: any): boolean {
    console.warn(filterValue);
    if (!filterValue) return true;
    const filterDate = filterValue?.toDate();
    const userDate = new Date(userValue);
    // const filterDate = new Date(filterValue);
    console.warn(filterDate);
    console.warn(userDate);
    // Check if both dates are valid
    if (isNaN(userDate.getTime()) || isNaN(filterDate.getTime())) {
      return false;
    }
    const isSameDay = moment(filterDate).isSame(userDate);
    return isSameDay;
  }
  salaryFilter(userValue: any, filterValue: any): boolean {
    if (!filterValue) return true;
    const userValueInt = parseFloat(userValue.replace(/,/g, ''));
    const filterInt = parseFloat(filterValue.replace(/,/g, ''));
    return userValueInt === filterInt;
  }
  standardFilter(userValue: any, filterValue: any, key: any): boolean {
    const userValueLower = String(userValue).toLowerCase();
    const filterValueLower = String(filterValue).toLowerCase();

    return userValueLower.includes(filterValueLower);
  }
  onPaginateChange(event: any) {
    console.log(event);
    console.log(Math.ceil(this.totalRecords / this.pageSize) - 1);
    if (event.pageIndex == Math.ceil(this.totalRecords / this.pageSize) - 1) {
      console.log('API call');
      let apiRes = this.userList;
      let oldRes = this.dataSource.data;
      let newRes = [...oldRes, ...apiRes];

      this.dataSource = new MatTableDataSource(newRes);
      this.totalRecords = this.dataSource.data.length;
      this.dataSource.paginator = this.paginator;
    }
  }
  dummyUser = {
    name: 'JJ',
    department: 'entertainment',
    position: 'singer',
    phone_number: '09123123213',
    nric: '12/sad12292',
  };
  ngOnDestroy() {
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
  }

  async deleteUser(userID: string) {
    console.warn(userID + ' deleted userID');
    this.isWarningModalOpen = false;
    this.isSuccessModalOpen = false;
    if (this.platform.is('mobile')) {
      await this.sqliteService.removeUser(userID).then(() => {});
    } else {
      return this.employeeWebService.removeUser(userID);
    }
  }

  async openNewEmploye(employe: any) {
    const modal = await this.modalController.create({
      component: EmployeFormModalComponent,
      componentProps: { employe },
      id: 'employee-modal',
    });
    await modal.present();
  }

  async filterModal() {
    const modal = await this.modalController.create({
      component: FilterEmployeModalComponent,
    });
    await modal.present();
  }
  setWarningOpen(isOpen: boolean, id: string) {
    this.isWarningModalOpen = isOpen;
    this.userId = id;
  }

  setSuccessModalOpen(isOpen: boolean) {
    this.isWarningModalOpen = false;
    this.isSuccessModalOpen = isOpen;
  }
}
