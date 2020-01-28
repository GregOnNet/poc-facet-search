import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FacetStackItem } from './facet';

@Component({
  selector: 'poc-facet-brick',
  template: `
    <span *ngFor="let label of facet | facetLabels" class="brick-label">{{
      label
    }}</span>
    <span>{{ facet.value }}</span>
    <button (click)="delete.emit(facet)">X</button>
  `,
  styles: [
    `
      :host {
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
  @Output() delete = new EventEmitter<FacetStackItem<unknown>>();
}
