import { Component } from '@angular/core';

@Component({
  selector: 'faceted-search-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  facets = null;

  printFacets(facets: any) {
    this.facets = facets;
  }
}
