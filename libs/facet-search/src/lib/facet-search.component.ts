import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  FacetContext,
  FacetFreeText,
  FacetGroup,
  FacetOption,
  FacetSelect,
  FacetStackItem
} from './facet';

@Component({
  selector: 'poc-facet-search',
  template: `
    <poc-facet-brick
      [facet]="facet"
      (delete)="remove($event)"
      *ngFor="let facet of context.facetStack"
    ></poc-facet-brick>
    <input
      type="text"
      [formControl]="inputSearch"
      (keydown.enter)="setValue($event.target.value)"
      (keydown.backspace)="removeLastIfEmpty($event.target.value)"
    />
    <hr />
    <strong>Facets</strong>
    <button
      *ngFor="let facet of context.facets$ | async"
      (click)="scope(facet)"
    >
      {{ facet.label }}
    </button>
    <hr />

    <strong>Options</strong>
    <button
      *ngFor="let option of context.facetOptions$ | async"
      (click)="setValue(option)"
    >
      {{ option.label }}
    </button>

    <hr />
    <button (click)="unscope()">Reset</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacetSearchComponent implements OnInit {
  readonly inputSearch = new FormControl();
  context = new FacetContext();

  @Input() facetGroup: FacetGroup = tempFacetGroup();

  ngOnInit(): void {
    this.context.configure(this.facetGroup);
  }

  scope(option: FacetGroup | FacetFreeText | FacetSelect<unknown>): void {
    this.context.scope(option);
  }

  setValue(option: FacetOption<unknown>) {
    this.context.setValue(option);
    this.inputSearch.reset();
  }

  remove(facet: FacetStackItem<unknown>) {
    this.context.remove(facet);
    this.unscope();
  }

  removeLastIfEmpty(text: string) {
    if (text) {
      return;
    }
    this.context.removeLast();
  }

  unscope() {
    this.context.unscope();
  }
}

function tempFacetGroup(): FacetGroup {
  return {
    label: '',
    children: [
      { label: 'Project' },
      {
        label: 'Assignee',
        options: [
          { label: 'Peter', value: 'Peter' },
          { label: 'Markus', value: 'Markus' }
        ]
      },
      {
        label: 'Company',
        children: [
          { label: 'Type', options: [{ label: 'AG', value: 'AG' }] },
          { label: 'Name' },
          {
            label: 'Projects shown',
            children: [
              { label: 'Name' },
              { label: 'Type', options: [{ label: 'Active', value: 'Active' }] }
            ]
          }
        ]
      }
    ]
  };
}
