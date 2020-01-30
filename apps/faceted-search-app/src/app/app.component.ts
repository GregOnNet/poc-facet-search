import { Component } from '@angular/core';
import { FacetConfiguration } from '@faceted-search/facet-search';
import { of } from 'rxjs';

@Component({
  selector: 'faceted-search-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  facets = null;
  facetConfiguration: FacetConfiguration = [
    { label: 'Project' },
    {
      label: 'Assignee',
      options: [
        { label: 'Peter', value: { name: 'Peter', id: 'some' } },
        { label: 'Markus', value: 'Markus' }
      ]
    },
    {
      label: 'Company',
      children: [
        { label: 'Type', options: of([{ label: 'AG', value: 'AG' }]) },
        { label: 'Name' },
        {
          label: 'Projects shown',
          children: [
            { label: 'Name' },
            { label: 'Type', options: [{ label: 'Active', value: 'Active' }] }
          ]
        }
      ]
    }
  ];
  printFacets(facets: any) {
    this.facets = facets;
  }
}
