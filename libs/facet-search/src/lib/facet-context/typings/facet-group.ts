import { Observable } from 'rxjs';

export type FacetConfiguration = FacetGroupMember[];

export type FacetGroupMember =
  | FacetGroup
  | FacetFreeText
  | FacetSelect<unknown>;

export interface FacetGroup {
  label: string;
  children: FacetGroupMember[];
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
