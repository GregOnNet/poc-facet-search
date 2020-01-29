import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { FacetBricksComponent } from './facet-bricks.component';
import {
  Facet,
  FacetConfiguration,
  FacetContext,
  FacetGroupMember,
  FacetOption
} from './facet-context';

@Component({
  selector: 'poc-facet-search',
  template: `
    <poc-facet-bricks
      [bricks]="context.facets$ | async"
      [focusable]="brickAfterFocusable"
      (delete)="remove($event)"
    ></poc-facet-bricks>
    <input
      type="text"
      placeholder="Search..."
      #brickAfterFocusable
      [formControl]="inputSearch"
      (keydown.enter)="setValue($event.target.value)"
      (keydown.ArrowLeft)="tryFocusFacetBrick($event)"
      (keydown.backspace)="tryFocusFacetBrick($event)"
    />
    <div class="search-additions">
      <strong>Facets</strong>
      <button
        *ngFor="let facet of context.options$ | async"
        (click)="scope(facet)"
      >
        {{ facet.label }}
      </button>

      <strong>Options</strong>
      <button
        *ngFor="let option of context.valueOptions$ | async"
        (click)="setValue(option)"
      >
        {{ option.label }}
      </button>
      <hr />
    </div>
  `,
  styles: [
    `
      input[type='text'] {
        font-size: 16px;
        padding: 8px;
      }

      .search-additions {
        margin-top: 16px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacetSearchComponent implements OnInit {
  readonly inputSearch = new FormControl();
  readonly inputAutocomplete = new FormControl();

  context = new FacetContext();

  @ViewChild(FacetBricksComponent, { static: true })
  facetBricks: FacetBricksComponent;

  @ViewChild('brickAfterFocusable', { static: true })
  inputSearchElement: ElementRef<HTMLInputElement>;

  @Input() facetGroup: FacetConfiguration = tempFacetGroup();
  @Output() update = new EventEmitter<Facet<unknown>[]>();

  ngOnInit(): void {
    this.context.configure(this.facetGroup);
  }

  scope(option: FacetGroupMember): void {
    this.context.scope(option);
  }

  setValue(option: FacetOption<unknown>) {
    this.context.setValue(option);
    this.inputSearch.reset();
    this.inputSearchElement.nativeElement.focus();
    this.update.emit(this.context.snapshots.facets);
  }

  remove(facet: Facet<unknown>) {
    this.context.remove(facet);
    this.update.emit(this.context.snapshots.facets);
  }

  tryFocusFacetBrick(some: any) {
    if (some.target.selectionStart >= 1) {
      return;
    }

    this.facetBricks.focus();
  }
}

function tempFacetGroup(): FacetConfiguration {
  return [
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
  ];
}
