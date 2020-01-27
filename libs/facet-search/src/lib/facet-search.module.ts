import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacetSearchComponent } from './facet-search.component';

@NgModule({
  imports: [CommonModule],
  declarations: [FacetSearchComponent],
  exports: [FacetSearchComponent]
})
export class FacetSearchModule {}
