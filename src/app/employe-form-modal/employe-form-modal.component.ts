import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SqliteService } from '../services/employee-mobile.service';
import { ModalController, Platform } from '@ionic/angular';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DatePipe } from '@angular/common';
import { EmployeeWebService } from '../services/employee-web.service';

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD HH:mm:ss',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'DD/MM/YYYY',
    dateA11yLabel: 'DD-MM-YYYY HH:mm:ss',
    monthYearA11yLabel: 'DD/MM/YYYY',
  },
};

@Component({
  selector: 'app-employe-form-modal',
  templateUrl: './employe-form-modal.component.html',
  styleUrls: ['./employe-form-modal.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    DatePipe,
  ],
})
export class EmployeFormModalComponent implements OnInit, OnDestroy {
  employeeForm!: FormGroup;
  isSuccessModalOpen = false;
  serviceName!: string;
  constructor(
    private sqliteService: SqliteService,
    private employeeWebService: EmployeeWebService,
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private platform: Platform
  ) {
    this.platform.ready().then(() => {
      if (this.platform.is('mobile')) {
        this.serviceName = 'sqliteService';
      } else {
        this.serviceName = 'employeeWebService';
      }
    });
    this.employeeForm = new FormGroup({
      name: new FormControl('', Validators.required),
      department: new FormControl('', Validators.required),
      position: new FormControl('', Validators.required),
      nric: new FormControl(''),
      dob: new FormControl(''),
      salary: new FormControl(''),
    });
  }
  @Input() employe: any;
  ngOnInit() {
    console.warn('object');
    if (this.employe) {
      console.warn(this.employe.dob, '==========> employee exist');
      this.employeeForm.patchValue({
        name: this.employe.name,
        department: this.employe.department,
        position: this.employe.position,
        nric: this.employe.nric,
        dob: new Date(this.employe.dob),
        salary: this.employe.salary,
      });
      // this.employeeForm.controls['dob'].setValue(this.employe.dob);
    }
  }

  async addUser(employee: any) {
    if (this.platform.is('mobile')) {
      await this.sqliteService.addUser(this.employeeForm?.value).then(() => {});
    } else {
      return this.employeeWebService.addUser(this.employeeForm?.value);
    }
    // await this.sqliteService.addUser(this.employeeForm?.value).then(() => {});
  }
  async updateUser(employee: any) {
    const data = {
      ...employee,
      id: this.employe.id,
    };
    if (this.platform.is('mobile')) {
      await this.sqliteService.updateUser(data).then(() => {});
    } else {
      return this.employeeWebService.updateUser(data);
    }
    await this.sqliteService.updateUser(data).then(() => {});
  }

  setSuccessModalOpen(isOpen: boolean) {
    this.isSuccessModalOpen = isOpen;
  }

  dissmissModal() {
    const modal = this.modalController.dismiss();
  }
  closeDialog() {
    this.isSuccessModalOpen = false;
    console.warn('dismissModal');
    const modal = this.modalController.dismiss(
      undefined,
      undefined,
      'employee-modal'
    );
  }
  onSubmit() {
    console.warn(this.employeeForm.value);
    if (this.employe) {
      this.updateUser(this.employeeForm?.value).then(() => {
        this.setSuccessModalOpen(true);
      });
    } else {
      this.addUser(this.employeeForm?.value).then(() => {
        this.setSuccessModalOpen(true);
      });
    }
  }

  ngOnDestroy(): void {
    this.employe = null;
  }
}
