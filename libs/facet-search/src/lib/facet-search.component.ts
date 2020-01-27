import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';

@Component({
  selector: 'poc-facet-search',
  template: `
    <mat-chip-list>
      <mat-chip *ngFor="let facet of facetLabels" [color]="facet.color">{{
        facet.label
      }}</mat-chip>
    </mat-chip-list>
    <div class="section-input">
      <mat-form-field>
        <input
          type="text"
          placeholder="Search..."
          aria-label="Number"
          matInput
          [formControl]="inputSearch"
          [matAutocomplete]="auto"
          [class.facet-search-value]="isModeValueInsert"
          (keydown.backspace)="revertLastFacet($event)"
          (keydown.enter)="commitSearchTerm($event)"
        />
        <mat-autocomplete
          #auto="matAutocomplete"
          (optionSelected)="commitFacet($event)"
        >
          <mat-option
            *ngFor="
              let facet of facetContext
                | facetContextOptionFilter: facetContextFilter
            "
            [value]="facet"
          >
            {{ facet.label }}
          </mat-option>
        </mat-autocomplete>
      </mat-form-field>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
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

  inputSearch = new FormControl();

  isModeValueInsert = false;

  facetContextFilter: string;
  facetContext: FacetMenuItem[];
  facetLabels: FacetLabel[] = [];

  constructor() {}

  ngOnInit() {
    this.facetContext = this.initializeFacetContext(this.facetGroup);
    this.inputSearch.valueChanges.subscribe(
      inputValue => (this.facetContextFilter = inputValue)
    );
  }

  commitFacet(selectedEvent: MatAutocompleteSelectedEvent) {
    const facetSelected: FacetGroup = selectedEvent.option.value;

    this.facetLabels = [...this.facetLabels, facetSelected];
    if (facetSelected.children && facetSelected.children.length > 0) {
      this.facetContext = facetSelected.children;
    } else {
      this.facetContext = [];
      this.isModeValueInsert = true;
    }

    this.inputSearch.reset();
  }

  commitSearchTerm() {
    if (!this.isModeValueInsert) {
      return;
    }

    this.facetLabels = [
      ...this.facetLabels,
      { label: this.inputSearch.value, color: 'accent' }
    ];
    this.inputSearch.reset();
  }

  revertLastFacet(keyPressed: KeyboardEvent & { target: { value: string } }) {
    const inputSearchValue = keyPressed.target.value;

    if (inputSearchValue || this.facetLabels.length === 0) {
      return;
    }

    this.inputSearch.patchValue(this.facetLabels.pop().label);
  }

  private tempFacetGroup(): FacetGroup {
    return {
      label: '',
      children: [
        { label: 'Project' },
        { label: 'Contact' },
        { label: 'Company', children: [{ label: 'Type' }] }
      ]
    };
  }

  private initializeFacetContext(facetGroup: FacetGroup): FacetMenuItem[] {
    return facetGroup.children;
  }
}

export interface FacetMenuItem {
  label: string;
}

export interface FacetLabel {
  label: string;
  color?: string;
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
