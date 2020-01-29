import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FacetBrickComponent } from './facet-brick.component';
import { FacetBricksComponent } from './facet-bricks.component';
import { FacetLabelsPipe } from './facet-labels.pipe';
import { FacetSearchComponent } from './facet-search.component';
import { FacetValueLabelPipe } from './facet-value-label.pipe';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [
    FacetBrickComponent,
    FacetBricksComponent,
    FacetSearchComponent,
    FacetLabelsPipe,
    FacetValueLabelPipe
  ],
  exports: [FacetSearchComponent]
})
export class FacetSearchModule {}
