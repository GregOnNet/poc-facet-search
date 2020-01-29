import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export class FacetContext {
  private searchConfiguration: FacetSearchConfiguration;

  private facets$$ = new BehaviorSubject<Facet<unknown>[]>([]);
  private options$$ = new BehaviorSubject<FacetSearchMembers>([]);
  private valueOptions$$ = new BehaviorSubject<FacetValueOptions<unknown>>([]);

  facets$ = this.facets$$.asObservable();
  options$ = this.options$$.asObservable();
  valueOptions$ = this.valueOptions$$.pipe(switchMap(options => of(options)));

  get snapshots() {
    return {
      facets: this.facets$$.getValue()
    };
  }

  configure(configuration: FacetSearchConfiguration) {
    this.options$$.next(configuration);
    this.searchConfiguration = configuration;
  }

  scope(facet: FacetSearchMember): void {
    if (isFacetSelect(facet)) {
      this.options$$.next([]);
      this.valueOptions$$.next(facet.options);
    } else if (isFacetGroup(facet)) {
      this.options$$.next(facet.children);
      this.valueOptions$$.next([]);
    } else if (isFacetFreeText(facet)) {
      this.options$$.next([]);
      this.valueOptions$$.next([]);
    }

    const itemWithoutValue = this.snapshots.facets.find(item => !item.value);

    if (!itemWithoutValue) {
      this.facets$$.next([
        ...this.snapshots.facets,
        { label: facet.label, id: generateId() }
      ]);
    } else {
      itemWithoutValue.labelAdditions = itemWithoutValue.labelAdditions
        ? [...itemWithoutValue.labelAdditions, facet.label]
        : [facet.label];

      this.facets$$.next(setLast(this.snapshots.facets, itemWithoutValue));
    }
  }

  unscope(): void {
    this.options$$.next(this.searchConfiguration);
    this.valueOptions$$.next([]);
  }

  setValue(value: any): void {
    this.unscope();
    if (
      this.snapshots.facets.length < 1 ||
      lastFacetAlreadyHasAValue(this.snapshots.facets)
    ) {
      this.facets$$.next([
        ...this.snapshots.facets,
        { label: 'Term', value, id: generateId() }
      ]);
    } else {
      const last = getLast(this.snapshots.facets);

      last.id = generateId();
      last.value = value;

      this.facets$$.next(setLast(this.snapshots.facets, last));
    }

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
    this.facets$$.next(
      this.facets$$.getValue().filter(stackItem => stackItem.id !== facet.id)
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

function getLast<T>(collection: T[]): T {
  const lastIndex = collection.length - 1;

  return { ...collection[lastIndex] };
}

function setLast<T>(collection: T[], update: T): T[] {
  const lastIndex = collection.length - 1;
  const shallow = [...collection];

  shallow[lastIndex] = update;
  return shallow;
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

export type FacetSearchConfiguration = FacetSearchMember[];
export type FacetSearchMembers = FacetSearchMember[];

export type FacetSearchMember =
  | FacetGroup
  | FacetFreeText
  | FacetSelect<unknown>;

export interface FacetGroup {
  label: string;
  children: FacetSearchMember[];
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

export type FacetValueOptions<T> =
  | FacetOption<T>[]
  | Observable<FacetOption<T>[]>;

export interface FacetSelect<T> {
  label: string;
  options: FacetValueOptions<T>;
}

export interface FacetOption<T> {
  label: string;
  value: T;
}
