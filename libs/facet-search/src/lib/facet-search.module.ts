import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FacetBrickComponent } from './facet-brick.component';
import { FacetBricksComponent } from './facet-bricks.component';
import { FacetLabelsPipe } from './facet-labels.pipe';
import { FacetSearchComponent } from './facet-search.component';
import { FacetValueLabelPipe } from './facet-value-label.pipe';

@NgModule({
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ],
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
