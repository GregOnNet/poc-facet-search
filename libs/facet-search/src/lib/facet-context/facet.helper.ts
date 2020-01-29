import { isObservable } from 'rxjs';
import { FacetFreeText, FacetGroup, FacetSelect } from './typings';

export function isFacetFreeText(value: any): value is FacetFreeText {
  return !value.children && !value.options;
}
export function isFacetSelect(value: any): value is FacetSelect<unknown> {
  return Array.isArray(value.options) || isObservable(value.options);
}

export function isFacetGroup(value: any): value is FacetGroup {
  return Array.isArray(value.children);
}

export function generateId(): string {
  function chr4() {
    return Math.random()
      .toString(16)
      .slice(-4);
  }

  return (
    chr4() +
    chr4() +
    '-' +
    chr4() +
    '-' +
    chr4() +
    '-' +
    chr4() +
    '-' +
    chr4() +
    chr4() +
    chr4()
  );
}
