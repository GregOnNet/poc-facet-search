import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export class FacetContext {
  private facetGroup: FacetGroup;
  private facets$$ = new BehaviorSubject<
    Array<FacetGroup | FacetFreeText | FacetSelect<unknown>>
  >([]);
  private facetOptions$$ = new BehaviorSubject<
    FacetOption<unknown>[] | Observable<FacetOption<unknown>[]>
  >([]);

  facetStack: FacetStackItem<unknown>[] = [];
  facetOptionsSnapshot:
    | FacetOption<unknown>[]
    | Observable<FacetOption<unknown>[]>;

  facets$ = this.facets$$.asObservable();
  facetOptions$ = this.facetOptions$$.pipe(switchMap(options => of(options)));

  configure(facetGroup: FacetGroup) {
    this.facets$$.next(facetGroup.children);
    this.facetGroup = facetGroup;
  }

  scope(facet: FacetGroup | FacetFreeText | FacetSelect<unknown>): void {
    if (isFacetSelect(facet)) {
      this.facets$$.next([]);
      this.facetOptions$$.next(facet.options);
    } else if (isFacetGroup(facet)) {
      this.facets$$.next(facet.children);
      this.facetOptions$$.next([]);
    } else if (isFacetFreeText(facet)) {
      this.facets$$.next([]);
      this.facetOptions$$.next([]);
    }

    // get most recent value, without value
    // add label to it
    let itemWithoutValue = this.facetStack.find(item => !item.value);

    if (!itemWithoutValue) {
      itemWithoutValue = { label: facet.label, index: 0 };
      this.facetStack = [...this.facetStack, itemWithoutValue];
    } else {
      itemWithoutValue.labelAdditions = itemWithoutValue.labelAdditions
        ? [...itemWithoutValue.labelAdditions, facet.label]
        : [facet.label];
      this.facetStack[this.facetStack.length - 1] = itemWithoutValue;
    }

    this.facetOptionsSnapshot = this.facetOptions$$.getValue();
  }

  unscope(): void {
    this.facets$$.next(this.facetGroup.children);
    this.facetOptions$$.next([]);
  }

  setValue(value: any): void {
    this.unscope();

    if (this.facetStack.length < 1) {
      this.facetStack.push({ label: 'Term', value, index: 0 });
    }

    this.facetStack[this.facetStack.length - 1].index =
      this.facetStack.length - 1;
    this.facetStack[this.facetStack.length - 1].value = value;
  }

  remove(facet: FacetStackItem<unknown>): void {
    this.facetStack.splice(facet.index, 1);
    this.unscope();
  }

  removeLast() {
    this.remove(this.facetStack[this.facetStack.length - 1]);
  }
}

function isFacetFreeText(value: any): value is FacetFreeText {
  return !value.children && !value.options;
}
function isFacetSelect(value: any): value is FacetSelect<unknown> {
  return Array.isArray(value.options);
}

function isFacetGroup(value: any): value is FacetGroup {
  return Array.isArray(value.children);
}

export interface Facet {
  label: string;
  value?: any | any[];
}

export interface FacetMenuItem {
  label: string;
}

export interface FacetGroup {
  label: string;
  children: Array<FacetGroup | FacetFreeText | FacetSelect<unknown>>;
}

export interface FacetStackItem<T> {
  index: number;
  label: string;
  labelAdditions?: string[];
  value?: T;
}

export interface FacetFreeText {
  label: string;
}

export interface FacetSelect<T> {
  label: string;
  options: FacetOption<T>[] | Observable<FacetOption<T>[]>;
}

export interface FacetOption<T> {
  label: string;
  value: T;
}
