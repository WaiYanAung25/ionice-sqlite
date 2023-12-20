import { Component, OnInit } from '@angular/core';
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
import { FilterListService } from '../services/filter-list.service';

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
  selector: 'app-filter-employe-modal',
  templateUrl: './filter-employe-modal.component.html',
  styleUrls: ['./filter-employe-modal.component.scss'],
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
export class FilterEmployeModalComponent implements OnInit {
  searchForm: FormGroup;
  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private platform: Platform,
    private filterService: FilterListService
  ) {
    this.searchForm = new FormGroup({
      name: new FormControl('', Validators.required),
      department: new FormControl('', Validators.required),
      position: new FormControl('', Validators.required),
      nric: new FormControl(''),
      dob: new FormControl(''),
      salary: new FormControl(''),
    });
  }

  ngOnInit() {
    console.warn('oninit');
  }
  dissmissModal() {
    const modal = this.modalController.dismiss();
  }
  onSubmit() {
    console.warn(this.searchForm.value);
    this.applyFilter(this.searchForm.value);
    this.dissmissModal();
  }
  applyFilter(filterCriteria: {}): void {
    this.filterService.setFilter(filterCriteria);
  }
}
