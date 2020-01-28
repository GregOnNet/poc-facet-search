import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import {
  FacetContext,
  FacetFreeText,
  FacetGroup,
  FacetOption,
  FacetSelect
} from './facet';

@Component({
  selector: 'poc-facet-search',
  template: `
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
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacetSearchComponent implements OnInit {
  context = new FacetContext();
  @Input() facetGroup: FacetGroup = tempFacetGroup();

  ngOnInit(): void {
    this.context.configure(this.facetGroup);
    this.context.facetOptions$.subscribe(console.log);
  }

  scope(option: FacetGroup | FacetFreeText | FacetSelect<unknown>): void {
    this.context.scope(option);
  }

  setValue(option: FacetOption<unknown>) {
    this.context.setValue(option);
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
