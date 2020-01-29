export interface Facet<T> {
  id: string;
  label: string;
  labelAdditions?: string[];
  value?: T;
}
