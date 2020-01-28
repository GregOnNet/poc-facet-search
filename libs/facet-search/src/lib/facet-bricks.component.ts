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
import { FacetStackItem } from './facet';
import { FacetBrickComponent } from './facet-brick.component';

@Component({
  selector: 'poc-facet-bricks',
  template: `
    <poc-facet-brick
      [facet]="brick"
      *ngFor="let brick of bricks"
      (delete)="delete.emit($event)"
    ></poc-facet-brick>
  `,
  styles: [``]
})
export class FacetBricksComponent {
  @ViewChildren(FacetBrickComponent, { read: ElementRef })
  brickChildren: QueryList<ElementRef<HTMLElement>>;

  @Input() focusable: HTMLElement;
  @Input() bricks: FacetStackItem<unknown>[];
  @Output() delete = new EventEmitter<FacetStackItem<unknown>>();

  constructor(@Inject(DOCUMENT) private document: Document) {}

  @HostListener('keydown.ArrowLeft')
  focusLeft() {
    let leftElementIndex = -1;
    const brickCollection = this.brickChildren.toArray();

    for (let index = 0; index <= brickCollection.length - 1; index++) {
      if (
        this.document.activeElement === brickCollection[index].nativeElement
      ) {
        leftElementIndex = index - 1;
        break;
      }
    }

    if (!brickCollection[leftElementIndex]) {
      return;
    }

    brickCollection[leftElementIndex].nativeElement.focus();
  }

  @HostListener('keydown.ArrowRight')
  focusRight() {
    let rightElementIndex = -1;
    const brickCollection = this.brickChildren.toArray();
    for (let index = 0; index <= brickCollection.length - 1; index++) {
      if (
        this.document.activeElement === brickCollection[index].nativeElement
      ) {
        rightElementIndex = index + 1;
        break;
      }
    }

    if (brickCollection[rightElementIndex]) {
      brickCollection[rightElementIndex].nativeElement.focus();
    } else if (this.focusable && this.focusable) {
      this.focusable.focus();
    }
  }

  focus() {
    this.brickChildren.last.nativeElement.focus();
  }
}
