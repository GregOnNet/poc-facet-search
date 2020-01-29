import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import * as Keycode from '@angular/cdk/keycodes';
import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren
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
import { FacetOptionListItemComponent } from './facet-option-list-item.component';

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
      (keydown)="focusOverlay($event)"
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
      <div
        class="facet-options"
        style="display:flex; flex-direction:column;background-color:#fff; padding:16px; padding-left: 0; min-width: 200px;"
      >
        <poc-facet-option-list-item
          [value]="facet"
          tag="facet"
          *ngFor="let facet of context.options$ | async"
          (click)="scope(facet)"
        ></poc-facet-option-list-item>
        <poc-facet-option-list-item
          [value]="valueOption"
          tag="valueOption"
          *ngFor="let valueOption of context.valueOptions$ | async"
          (click)="setValue(valueOption)"
        ></poc-facet-option-list-item>
      </div>
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

      poc-facet-option-list-item {
        padding: 4px;
      }

      poc-facet-option-list-item.active {
        background-color: lightblue;
        color: #fff;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacetSearchComponent implements OnInit, AfterViewInit {
  private keyManager: ActiveDescendantKeyManager<FacetOptionListItemComponent>;

  readonly inputSearch = new FormControl();
  readonly inputAutocomplete = new FormControl();

  isOpen = false;
  context = new FacetContext();

  @ViewChild(CdkConnectedOverlay, { static: true })
  cdkConnectedOverlay: CdkConnectedOverlay;

  @ViewChild(FacetBricksComponent, { static: true })
  facetBricks: FacetBricksComponent;

  @ViewChildren(FacetOptionListItemComponent)
  facetOptions: QueryList<FacetOptionListItemComponent>;

  @ViewChild('brickAfterFocusable', { static: true })
  inputSearchElement: ElementRef<HTMLInputElement>;

  @Input() facetGroup: FacetConfiguration = tempFacetGroup();
  @Output() update = new EventEmitter<Facet<unknown>[]>();

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.context.configure(this.facetGroup);
  }

  ngAfterViewInit(): void {
    this.keyManager = new ActiveDescendantKeyManager(this.facetOptions)
      .withWrap()
      .withTypeAhead();
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

    this.closeOverlay();
    this.facetBricks.focus();
  }

  openOverlay() {
    this.isOpen = true;
  }

  closeOverlay() {
    this.isOpen = false;
  }

  focusOverlay(keyboardEvent: KeyboardEvent) {
    switch (keyboardEvent.keyCode) {
      case Keycode.UP_ARROW:
      case Keycode.DOWN_ARROW:
        this.keyManager.onKeydown(keyboardEvent);
        break;
      case Keycode.LEFT_ARROW:
      case Keycode.BACKSPACE:
        this.tryFocusFacetBrick(keyboardEvent);
        break;
      case Keycode.ENTER:
        if (!this.keyManager.activeItem) {
          this.setValue(this.inputSearch.value);
        } else if (this.keyManager.activeItem.tag === 'facet') {
          this.scope(this.keyManager.activeItem.value);
        } else {
          this.setValue(this.keyManager.activeItem.value as any);
        }

        this.keyManager.updateActiveItem(-1);
        break;
    }
  }

  updateOverlayPosition() {
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
