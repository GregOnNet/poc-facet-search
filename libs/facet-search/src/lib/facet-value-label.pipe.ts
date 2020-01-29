import { Pipe, PipeTransform } from '@angular/core';
import { Facet } from './facet-context';

@Pipe({ name: 'facetValueLabel' })
export class FacetValueLabelPipe implements PipeTransform {
  transform(facet: Facet<unknown>, labelField: string): string {
    if (!facet || !facet.value) {
      return '';
    }

    if (typeof facet.value === 'string') {
      return facet.value;
    }

    if (Array.isArray(facet.value)) {
      try {
        return facet.value.reduce(
          (caption, v) => (!caption ? v.label : `${caption}, ${v.label}`),
          ''
        );
      } catch {
        return '--/--';
      }
    }

    return facet.value[labelField] ? facet.value[labelField] : '--/--';
  }
}
