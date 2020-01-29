import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
      cdkOverlayOrigin
      #brickAfterFocusable
      #facetSearchOverlayTrigger="cdkOverlayOrigin"
      [formControl]="inputSearch"
      (focus)="openOverlay()"
      (keydown.enter)="setValue($event.target.value)"
      (keydown.ArrowLeft)="tryFocusFacetBrick($event)"
      (keydown.backspace)="tryFocusFacetBrick($event)"
      type="text"
      placeholder="Search..."
    />

    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayHasBackdrop]="true"
      [cdkConnectedOverlayOpen]="isOpen"
      [cdkConnectedOverlayOrigin]="facetSearchOverlayTrigger"
      (backdropClick)="closeOverlay()"
      (detach)="closeOverlay()"
      cdkConnectedOverlayBackdropClass="cdk-overlay-transparent-backdrop"
    >
      <mat-selection-list style="background-color:#ffffff">
        <mat-list-option
          *ngFor="let facet of context.options$ | async"
          (keydown.enter)="scope(facet)"
          (click)="scope(facet)"
        >
          {{ facet.label }}
        </mat-list-option>
        <mat-list-option
          *ngFor="let valueOption of context.valueOptions$ | async"
          (keydown.enter)="setValue(valueOption)"
          (click)="setValue(valueOption)"
        >
          {{ valueOption.label }}
        </mat-list-option>
      </mat-selection-list>
    </ng-template>
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

      ::ng-deep.mat-pseudo-checkbox {
        display: none !important;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacetSearchComponent implements OnInit {
  readonly inputSearch = new FormControl();
  readonly inputAutocomplete = new FormControl();

  isOpen = false;
  context = new FacetContext();

  @ViewChild(CdkConnectedOverlay, { static: true })
  cdkConnectedOverlay: CdkConnectedOverlay;

  @ViewChild(FacetBricksComponent, { static: true })
  facetBricks: FacetBricksComponent;

  @ViewChild('brickAfterFocusable', { static: true })
  inputSearchElement: ElementRef<HTMLInputElement>;

  @Input() facetGroup: FacetConfiguration = tempFacetGroup();
  @Output() update = new EventEmitter<Facet<unknown>[]>();

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.context.configure(this.facetGroup);
  }

  scope(option: FacetGroupMember): void {
    this.context.scope(option);
    this.updateOverlayPosition();
  }

  setValue(option: FacetOption<unknown>) {
    this.context.setValue(option);
    this.inputSearch.reset();
    this.inputSearchElement.nativeElement.focus();
    this.update.emit(this.context.snapshots.facets);
    this.updateOverlayPosition();
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

  openOverlay() {
    this.isOpen = true;
  }

  closeOverlay() {
    this.isOpen = false;
  }

  private updateOverlayPosition() {
    this.changeDetector.detectChanges();
    this.cdkConnectedOverlay.overlayRef.updatePosition();
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
