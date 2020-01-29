import { Pipe, PipeTransform } from '@angular/core';
import { FacetStackItem } from './facet';

@Pipe({
  name: 'facetLabels'
})
export class FacetLabelsPipe implements PipeTransform {
  transform(facet: FacetStackItem<unknown>): string[] {
    if (!facet) {
      return [];
    }
    console.log(facet);

    const additions = Array.isArray(facet.labelAdditions)
      ? facet.labelAdditions
      : [];

    return [facet.label, ...additions];
  }
}
