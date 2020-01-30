import { Pipe, PipeTransform } from '@angular/core';
import { FacetGroupMember } from './facet-context';

@Pipe({ name: 'facetOptionValueFilter' })
export class FacetValueOptionFilterPipe implements PipeTransform {
  transform(facets: FacetGroupMember[], term: string): FacetGroupMember[] {
    const facetOptionRestoreIndicator = ',';
    if (!term || term === facetOptionRestoreIndicator) {
      return facets;
    }

    return facets.filter(facet =>
      facet.label
        .toLocaleLowerCase()
        .includes(
          term.replace(facetOptionRestoreIndicator, '').toLocaleLowerCase()
        )
    );
  }
}
