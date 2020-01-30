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
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { of, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
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
      (keyup)="focusOverlay($event)"
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
      <div class="card card-1">
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

      .card {
        background: #fff;
        border-radius: 2px;
        display: inline-block;
        position: relative;
        width: 300px;
      }

      .card-1 {
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      }

      ::ng-deep.mat-pseudo-checkbox {
        display: none !important;
      }

      poc-facet-option-list-item {
        padding: 8px;
      }

      poc-facet-option-list-item.active {
        background-color: #0074d9;
        color: #fff;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacetSearchComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly sink = new Subscription();
  private isInAppendMode = false;
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
  @Input() debounce = 250;

  @Output() update = new EventEmitter<Facet<unknown>[]>();

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.context.configure(this.facetGroup);
    this.handleInputSearch();
  }

  ngAfterViewInit(): void {
    this.keyManager = new ActiveDescendantKeyManager(this.facetOptions)
      .withWrap()
      .withTypeAhead();
  }

  ngOnDestroy(): void {
    this.sink.unsubscribe();
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

  appendValue(value: Facet<unknown>) {
    this.context.appendValue(value);
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
        const activeItemIndex = this.keyManager.activeItemIndex;
        this.keyManager.onKeydown(keyboardEvent);

        if (activeItemIndex === 0) {
          this.isOpen = false;
          this.keyManager.updateActiveItem(-1);
        }
        break;
      case Keycode.DOWN_ARROW:
        this.isOpen = true;
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
        } else if (
          this.keyManager.activeItem.tag === 'valueOption' &&
          this.isInAppendMode
        ) {
          this.appendValue(this.keyManager.activeItem.value);
        } else {
          this.setValue(this.keyManager.activeItem.value as any);
        }
        this.keyManager.updateActiveItem(-1);
        break;
    }
  }

  private handleInputSearch() {
    this.sink.add(
      this.inputSearch.valueChanges.subscribe(value => {
        if (value === ',') {
          this.isInAppendMode = true;
          this.context.restoreOptionsScope();
          this.updateOverlayPosition();
        } else {
          this.isInAppendMode = false;
        }
      })
    );

    this.sink.add(
      this.inputSearch.valueChanges
        .pipe(debounceTime(this.debounce))
        .subscribe(value => {
          if (this.context.snapshots.facets.length !== 0) {
            return;
          }

          if (value) {
            this.update.emit([{ id: '0', label: 'Term', value }]);
          } else {
            this.update.emit([]);
          }
        })
    );
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
        { label: 'Peter', value: { name: 'Peter', id: 'some' } },
        { label: 'Markus', value: 'Markus' }
      ]
    },
    {
      label: 'Company',
      children: [
        { label: 'Type', options: of([{ label: 'AG', value: 'AG' }]) },
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
