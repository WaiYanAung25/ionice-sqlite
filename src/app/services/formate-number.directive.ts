import {
  Directive,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
@Directive({
  selector: '[appFormateNumber]',
})
export class FormateNumberDirective implements OnInit, OnDestroy {
  private subscription!: Subscription;

  constructor(private ngControl: NgControl) {}

  ngOnInit() {
    const control = this.ngControl.control;
    if (control) {
      this.subscription = control.valueChanges
        .pipe(
          map((value) => {
            const removeOther = value.replace(/[^\d.]/g, '');

            // Format with 2 decimal points and thousand separator
            const formattedVal = this.formatNumber(removeOther);
            return formattedVal;
          })
        )
        .subscribe((v) => control.setValue(v, { emitEvent: false }));
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private formatNumber(value: string): string {
    const numericValue = parseFloat(value);
    return numericValue.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }
}
