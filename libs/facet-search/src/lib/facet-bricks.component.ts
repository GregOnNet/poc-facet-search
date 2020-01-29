import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import { FacetBrickComponent } from './facet-brick.component';
import { Facet } from './facet-context';

@Component({
  selector: 'poc-facet-bricks',
  template: `
    <poc-facet-brick
      [facet]="brick"
      *ngFor="let brick of bricks"
      (delete)="emitDelete($event)"
      [labelField]="labelField"
    ></poc-facet-brick>
  `
})
export class FacetBricksComponent {
  @ViewChildren(FacetBrickComponent, { read: ElementRef })
  brickChildren: QueryList<ElementRef<HTMLElement>>;

  @Input() focusable: HTMLElement;
  @Input() bricks: Facet<unknown>[];
  @Output() delete = new EventEmitter<Facet<unknown>>();
  @Input() labelField = 'label';
  constructor(@Inject(DOCUMENT) private document: Document) {}

  @HostListener('keydown.ArrowLeft')
  focusLeft() {
    this.focusNeighbour(index => index - 1);
  }

  @HostListener('keydown.ArrowRight')
  focusRight() {
    this.focusNeighbour(index => index + 1);
  }

  emitDelete(facet: Facet<unknown>) {
    this.delete.emit(facet);
    this.focusRight();
  }

  focus() {
    this.brickChildren.last.nativeElement.focus();
  }

  private focusNeighbour(getNeighbourIndex: (index: number) => number): void {
    let neighbourIndex = -1;
    const brickCollection = this.brickChildren.toArray();
    for (let index = 0; index <= brickCollection.length - 1; index++) {
      if (
        this.document.activeElement === brickCollection[index].nativeElement
      ) {
        neighbourIndex = getNeighbourIndex(index);
        break;
      }
    }

    if (brickCollection[neighbourIndex]) {
      brickCollection[neighbourIndex].nativeElement.focus();
    } else if (this.focusable && this.focusable) {
      this.focusable.focus();
    }
  }
}
