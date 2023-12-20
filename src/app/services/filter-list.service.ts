// filter.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilterListService {
  private filterSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});
  filter$: Observable<any> = this.filterSubject.asObservable();

  setFilter(filter: any): void {
    this.filterSubject.next(filter);
  }
}
