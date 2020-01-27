import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'poc-facet-search',
  template: `
    <input
      type="text"
      class="facet-search"
      value="fake search"
      [class.facet-search-value]="modeValueInsert"
    />
    <ul class="facets-available">
      <li *ngFor="let facet of facetContext | async">{{ facet.label }}</li>
    </ul>

    <ul class="facet-labels">
      <li *ngFor="let facet of facetLabels | async"></li>
    </ul>
  `,
  styles: [
    `
      .facet-search {
        font-size: 16px;
        width: 100%;
        padding: 12px 20px;
        margin: 8px 0;
        box-sizing: border-box;
      }

      .facet-search-value {
        color: #2ea0d9;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacetSearchComponent implements OnInit {
  @Input() facetGroup: FacetGroup = this.tempFacetGroup();

  modeValueInsert = false;

  facetContext: Observable<FacetMenuItem[]>;
  facetLabels: Observable<FacetLabel[]>;

  constructor() {}

  ngOnInit() {
    this.facetContext = this.initializeFacetContext(this.facetGroup);
  }

  private tempFacetGroup(): FacetGroup {
    return {
      label: '',
      children: [
        { label: 'Project' },
        { label: 'Contact' },
        { label: 'Company' }
      ]
    };
  }

  private initializeFacetContext(
    facetGroup: FacetGroup
  ): Observable<FacetMenuItem[]> {
    const facetContext = facetGroup.children;
    return of(facetContext);
  }
}

export interface FacetMenuItem {
  label: string;
}

export interface FacetLabel {
  label: string;
}

export interface FacetGroupValue {
  label: string;
  values: Array<FacetValue<unknown>>;
}

export interface FacetGroup {
  label: string;
  children: Array<FacetGroup | FacetFreeText | FacetSelect<unknown>>;
}

export interface FacetValue<T> {
  label: string;
  value: T;
}

export interface FacetFreeText {
  label: string;
}

export interface FacetSelect<T> {
  label: string;
  options: FacetOption<T>[] | Observable<FacetOption<T>[]>;
}

export interface FacetOption<T> {
  label: string;
  value: T;
}
