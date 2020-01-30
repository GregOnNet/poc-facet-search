import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output
} from '@angular/core';
import { Facet } from './facet-context';

@Component({
  selector: 'poc-facet-brick',
  template: `
    <span *ngFor="let label of facet | facetLabels" class="brick-label">{{
      label
    }}</span>
    <span class="brick-value">{{ facet | facetValueLabel: labelField }}</span>
  `,
  styles: [
    `
      :host {
        display: inline-block;
        padding: 8px;
        background-color: #f8f8f8;
        color: rgba(0, 0, 0, 0.55);
        border-radius: 2px 0 0 2px;
        margin-right: 4px;
        text-transform: capitalize;
      }

      .brick-label {
        color: #3c3c3c;
        padding-left: 4px;
      }

      .brick-value {
        color: #0074d9;
        padding-left: 4px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacetBrickComponent {
  @Input() facet: Facet<unknown>;
  @Input() labelField = 'label';
  @Output() delete = new EventEmitter<Facet<unknown>>();

  @HostBinding('tabindex') tabindex = 0;

  @HostListener('keydown.backspace')
  @HostListener('keydown.delete')
  emitDelete() {
    this.delete.emit(this.facet);
  }
}
