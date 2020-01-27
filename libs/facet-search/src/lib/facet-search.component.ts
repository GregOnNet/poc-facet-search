import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'poc-facet-search',
  template: `
    <input
      type="text"
      class="facet-search"
      value="fake search"
      [class.value-input]="modeValueInsert"
    />
    <ul class="facets-available">
      <li *ngFor="let facet of facets | async"></li>
    </ul>

    <ul class="facet-labels">
      <li *ngFor="let facet of facetLabels | async"></li>
    </ul>
  `,
  styles: [
    `
      .value-input {
        color: #2ea0d9;
        width: 100%;
        padding: 12px 20px;
        margin: 8px 0;
        box-sizing: border-box;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacetSearchComponent implements OnInit {
  modeValueInsert = true;

  facets: Observable<FacetMenuItem>;
  facetLabels: Observable<FacetLabel>;

  constructor() {}

  ngOnInit() {}
}

export interface FacetMenuItem {
  label: string;
}

export interface FacetLabel {
  label: string;
}
