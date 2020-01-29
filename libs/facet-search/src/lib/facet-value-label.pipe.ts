import { Pipe, PipeTransform } from '@angular/core';
import { FacetStackItem } from './facet-context';

@Pipe({
  name: 'facetValueLabel'
})
export class FacetValueLabelPipe implements PipeTransform {
  transform(facet: FacetStackItem<unknown>, labelField: string): string {
    if (!facet || !facet.value) {
      return '';
    }

    if (typeof facet.value === 'string') {
      return facet.value;
    }

    return facet.value[labelField] ? facet.value[labelField] : '--/--';
  }
}
