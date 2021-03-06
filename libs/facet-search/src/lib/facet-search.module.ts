import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { FacetBrickComponent } from './facet-brick.component';
import { FacetBricksComponent } from './facet-bricks.component';
import { FacetLabelsPipe } from './facet-labels.pipe';
import { FacetOptionListItemComponent } from './facet-option-list-item.component';
import { FacetSearchComponent } from './facet-search.component';
import { FacetValueLabelPipe } from './facet-value-label.pipe';
import { FacetValueOptionFilterPipe } from './facet-value-option-filter.pipe';

@NgModule({
  imports: [CommonModule, OverlayModule, MatListModule, ReactiveFormsModule],
  declarations: [
    FacetBrickComponent,
    FacetBricksComponent,
    FacetOptionListItemComponent,
    FacetSearchComponent,
    FacetLabelsPipe,
    FacetValueLabelPipe,
    FacetValueOptionFilterPipe
  ],
  exports: [FacetSearchComponent]
})
export class FacetSearchModule {}
