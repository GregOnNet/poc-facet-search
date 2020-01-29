import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export class FacetContext {
  private facetSearchConfiguration: FacetSearchConfiguration;

  private readonly facets$$ = new BehaviorSubject<
    Array<FacetGroup | FacetFreeText | FacetSelect<unknown>>
  >([]);
  private facetOptions$$ = new BehaviorSubject<
    FacetOption<unknown>[] | Observable<FacetOption<unknown>[]>
  >([]);

  private readonly facetStack$$ = new BehaviorSubject<Facet<unknown>[]>([]);

  facets$ = this.facetStack$$.asObservable();
  facetOptions$ = this.facets$$.asObservable();
  facetValueOptions$ = this.facetOptions$$.pipe(
    switchMap(options => of(options))
  );

  get snapshots() {
    return {
      facets: this.facetStack$$.getValue()
    };
  }

  configure(configuration: FacetSearchConfiguration) {
    this.facets$$.next(configuration);
    this.facetSearchConfiguration = configuration;
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

    let itemWithoutValue = this.snapshots.facets.find(item => !item.value);

    if (!itemWithoutValue) {
      itemWithoutValue = { label: facet.label, id: generateId() };
      this.facetStack$$.next([...this.snapshots.facets, itemWithoutValue]);

      this.snapshots.facets = this.facetStack$$.getValue();
    } else {
      itemWithoutValue.labelAdditions = itemWithoutValue.labelAdditions
        ? [...itemWithoutValue.labelAdditions, facet.label]
        : [facet.label];

      this.snapshots.facets[
        this.snapshots.facets.length - 1
      ] = itemWithoutValue;
    }

    this.facetStack$$.next([...this.snapshots.facets]);
  }

  unscope(): void {
    this.facets$$.next(this.facetSearchConfiguration);
    this.facetOptions$$.next([]);
  }

  setValue(value: any): void {
    this.unscope();
    if (
      this.snapshots.facets.length < 1 ||
      lastFacetAlreadyHasAValue(this.snapshots.facets)
    ) {
      this.snapshots.facets.push({ label: 'Term', value, id: generateId() });
    } else {
      const last = {
        ...this.snapshots.facets[this.snapshots.facets.length - 1]
      };

      last.id = generateId();
      last.value = value;

      this.snapshots.facets[this.snapshots.facets.length - 1] = last;
    }

    this.facetStack$$.next(this.snapshots.facets);

    function lastFacetAlreadyHasAValue(facetStack: Facet<unknown>[]): boolean {
      if (!Array.isArray(facetStack) || facetStack.length < 1) {
        return false;
      } else if (facetStack[facetStack.length - 1].value) {
        return true;
      } else {
        return false;
      }
    }
  }

  remove(facet: Facet<unknown>): void {
    this.facetStack$$.next(
      this.facetStack$$
        .getValue()
        .filter(stackItem => stackItem.id !== facet.id)
    );
    this.unscope();
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

function generateId(): string {
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

export type FacetSearchConfiguration = Array<
  FacetGroup | FacetFreeText | FacetSelect<unknown>
>;

export interface FacetGroup {
  label: string;
  children: Array<FacetGroup | FacetFreeText | FacetSelect<unknown>>;
}

export interface Facet<T> {
  id: string;
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
