import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { FacetBrickComponent } from './facet-brick.component';
import { FacetBricksComponent } from './facet-bricks.component';
import { FacetLabelsPipe } from './facet-labels.pipe';
import { FacetSearchComponent } from './facet-search.component';
import { FacetValueLabelPipe } from './facet-value-label.pipe';

@NgModule({
  imports: [CommonModule, OverlayModule, MatListModule, ReactiveFormsModule],
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
