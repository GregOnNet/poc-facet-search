import {
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output
} from '@angular/core';
import { FacetStackItem } from './facet';

@Component({
  selector: 'poc-facet-brick',
  template: `
    <span *ngFor="let label of facet | facetLabels" class="brick-label">{{
      label
    }}</span>
    <span>{{ facet | facetValueLabel: labelField }}</span>
    <button (click)="delete.emit(facet)">X</button>
  `,
  styles: [
    `
      :host {
        display: inline-block;
        border: 1px solid #e4e4e4;
        padding: 4px;
      }

      .brick-label {
        color: #3c3c3c;
        padding-right: 4px;
      }
    `
  ]
})
export class FacetBrickComponent {
  @Input() facet: FacetStackItem<unknown>;
  @Input() labelField = 'label';
  @Output() delete = new EventEmitter<FacetStackItem<unknown>>();

  @HostBinding('tabindex') tabindex = 0;

  @HostListener('keydown.backspace')
  onFocus() {
    this.delete.emit(this.facet);
  }
}
