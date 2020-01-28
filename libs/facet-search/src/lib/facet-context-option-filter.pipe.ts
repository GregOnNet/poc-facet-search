import { Pipe, PipeTransform } from '@angular/core';
import { FacetMenuItem } from './facet';

@Pipe({
  name: 'facetContextOptionFilter'
})
export class FacetContextOptionFilterPipe implements PipeTransform {
  transform(facetMenuItems: FacetMenuItem[], query: string): FacetMenuItem[] {
    if (!query) {
      return facetMenuItems;
    }

    if (!Array.isArray(facetMenuItems)) {
      return [];
    }

    return facetMenuItems.filter(facetMenuItem =>
      facetMenuItem.label.toLowerCase().includes(query.toLowerCase())
    );
  }
}
