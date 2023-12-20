import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HomePageRoutingModule } from './home-routing.module';
import { SqliteService } from '../services/employee-mobile.service';
import { EmployeFormModalComponent } from '../employe-form-modal/employe-form-modal.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormateNumberDirective } from '../services/formate-number.directive';
import { FilterEmployeModalComponent } from '../filter-employe-modal/filter-employe-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    MatPaginatorModule,
    MatTableModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatMomentDateModule,
  ],
  declarations: [
    HomePage,
    FilterEmployeModalComponent,
    EmployeFormModalComponent,
    FormateNumberDirective,
  ],
})
export class HomePageModule {}
