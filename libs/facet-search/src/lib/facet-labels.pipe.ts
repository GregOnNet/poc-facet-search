import { Pipe, PipeTransform } from '@angular/core';
import { Facet } from './facet-context';

@Pipe({
  name: 'facetLabels'
})
export class FacetLabelsPipe implements PipeTransform {
  transform(facet: Facet<unknown>): string[] {
    if (!facet) {
      return [];
    }

    const additions = Array.isArray(facet.labelAdditions)
      ? facet.labelAdditions
      : [];

    return [facet.label, ...additions];
  }
}
