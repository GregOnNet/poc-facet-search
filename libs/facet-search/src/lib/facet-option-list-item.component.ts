import { Highlightable } from '@angular/cdk/a11y';
import { Component, HostBinding, Input } from '@angular/core';
import { Facet } from './facet-context';

@Component({
  selector: 'poc-facet-option-list-item',
  template: `
    {{ value.label }}
  `,
  styles: [
    `
      :host {
        display: block;
        padding: 4px;
      }

      .disabled {
        opacity: 0.3;
      }
    `
  ]
})
export class FacetOptionListItemComponent implements Highlightable {
  @Input() value: Facet<unknown>;
  @Input() tag: string;
  @Input() disabled = false;

  private _isActive = false;

  @HostBinding('class.active') get isActive() {
    return this._isActive;
  }

  setActiveStyles() {
    this._isActive = true;
  }

  setInactiveStyles() {
    this._isActive = false;
  }

  getLabel() {
    return this.facet.label;
  }
}
