import { BehaviorSubject, isObservable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { getLast, setLast } from './collection.helper';
import {
  generateId,
  isFacetFreeText,
  isFacetGroup,
  isFacetSelect
} from './facet.helper';
import {
  Facet,
  FacetConfiguration,
  FacetGroupMember,
  FacetValueOptions
} from './typings';

export class FacetContext {
  private searchConfiguration: FacetConfiguration;

  private facets$$ = new BehaviorSubject<Facet<unknown>[]>([]);
  private options$$ = new BehaviorSubject<FacetGroupMember[]>([]);
  private valueOptions$$ = new BehaviorSubject<FacetValueOptions<unknown>>([]);

  facets$ = this.facets$$.asObservable();
  options$ = this.options$$.asObservable();
  valueOptions$ = this.valueOptions$$.pipe(
    switchMap(options => (isObservable(options) ? options : of(options)))
  );

  lastScope: FacetGroupMember;

  get snapshots() {
    return {
      facets: this.facets$$.getValue()
    };
  }

  configure(configuration: FacetConfiguration) {
    this.options$$.next(configuration);
    this.searchConfiguration = configuration;
  }

  scope(facet: FacetGroupMember): void {
    this.lastScope = facet;
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

  restoreOptionsScope() {
    if (isFacetSelect(this.lastScope)) {
      this.options$$.next([]);
      this.valueOptions$$.next(this.lastScope.options);
    }
  }

  setValue(value: any): void {
    if (
      this.snapshots.facets.length < 1 ||
      !!getLast(this.snapshots.facets).value
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

    this.unscope();
  }

  appendValue(value: any) {
    const last = getLast(this.snapshots.facets);
    const valuePatched = Array.isArray(last.value)
      ? [...last.value, value]
      : [last.value, value];

    last.value = valuePatched;
    this.facets$$.next(setLast(this.snapshots.facets, last));
    this.unscope();
  }

  remove(facet: Facet<unknown>): void {
    this.facets$$.next(
      this.facets$$.getValue().filter(stackItem => stackItem.id !== facet.id)
    );

    this.unscope();
  }

  unscope(): void {
    this.options$$.next(this.searchConfiguration);
    this.valueOptions$$.next([]);
  }
}
