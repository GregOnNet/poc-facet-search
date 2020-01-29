import { Pipe, PipeTransform } from '@angular/core';
import { Facet } from './facet-context';

@Pipe({
  name: 'facetValueLabel'
})
export class FacetValueLabelPipe implements PipeTransform {
  transform(facet: Facet<unknown>, labelField: string): string {
    if (!facet || !facet.value) {
      return '';
    }

    if (typeof facet.value === 'string') {
      return facet.value;
    }

    return facet.value[labelField] ? facet.value[labelField] : '--/--';
  }
}
