import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild
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
import { FacetBricksComponent } from './facet-bricks.component';

@Component({
  selector: 'poc-facet-search',
  template: `
    <poc-facet-bricks
      [bricks]="context.facetStack$ | async"
      [focusable]="brickAfterFocusable"
      (delete)="remove($event)"
    ></poc-facet-bricks>
    <input
      type="text"
      #brickAfterFocusable
      [formControl]="inputSearch"
      (keydown.ArrowLeft)="tryFocusFacetBrick($event)"
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
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacetSearchComponent implements OnInit {
  @ViewChild(FacetBricksComponent, { static: true })
  facetBricks: FacetBricksComponent;

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
  }

  removeLastIfEmpty(text: string) {
    if (text) {
      return;
    }

    this.context.removeLast();
  }

  tryFocusFacetBrick(some: any) {
    if (some.target.selectionStart > 1) {
      return;
    }

    this.facetBricks.focus();
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
