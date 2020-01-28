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

  facetValues: Array<FacetGroup | FacetFreeText | FacetSelect<unknown>> = [];

  facets$ = this.facets$$.asObservable();
  facetOptions$ = this.facetOptions$$.pipe(switchMap(options => of(options)));

  configure(facetGroup: FacetGroup) {
    this.facets$$.next(facetGroup.children);
    this.facetGroup = facetGroup;
  }

  scope(facet: unknown): void {
    if (isFacetFreeText(facet)) {
      this.facets$$.next([]);
      this.facetOptions$$.next([]);
    } else if (isFacetSelect(facet)) {
      this.facets$$.next([]);
      this.facetOptions$$.next(facet.options);
    } else if (isFacetGroup(facet)) {
      this.facets$$.next(facet.children);
      this.facetOptions$$.next([]);
    }

    this.facetValues = [...this.facetValues, facet];
  }

  unscope(): void {
    this.facets$$.next(this.facetGroup.children);
    this.facetOptions$$.next([]);
  }

  setValue(value: any): void {}

  popValue(): any {}
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

export interface FacetGroupValue {
  label: string;
  values: Array<FacetValue<unknown>>;
}

export interface FacetGroup {
  label: string;
  children: Array<FacetGroup | FacetFreeText | FacetSelect<unknown>>;
}

export interface FacetValue<T> {
  label: string;
  value: T;
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
