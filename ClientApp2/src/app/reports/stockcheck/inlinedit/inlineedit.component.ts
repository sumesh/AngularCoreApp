import { Component, Input, Optional, Host } from '@angular/core';
import { SatPopover } from '@ncstate/sat-popover';
import { filter } from 'rxjs/operators/filter';

@Component({
  selector: 'inline-edit',
  styleUrls: ['inlineedit.component.scss'],
  templateUrl: 'inlineedit.component.html',
})
export class InlineEditComponent {

  @Input('itemcode') public itemcode: string;
  /** Overrides the comment and provides a reset value when changes are cancelled. */
  @Input()
  get value(): number { return this._value; }
  set value(x: number) {
    this.curqty = this._value = x;
  }
  private _value = 0;

  /** Form model for the input. */
  curqty = 0;

  constructor(@Optional() @Host() public popover: SatPopover) { }

  ngOnInit() {
    // subscribe to cancellations and reset form value
    if (this.popover) {
      this.popover.closed.pipe(filter(val => val == null))
        .subscribe(() => this.curqty = this.value || 0);
    }
  }

  onSubmit() {
    if (this.popover) {
      this.popover.close(this.curqty);
    }
  }

  onCancel() {
    if (this.popover) {
      this.popover.close();
    }
  }
}