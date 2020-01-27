import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FacetContextOptionFilterPipe } from './facet-context-option-filter.pipe';
import { FacetSearchComponent } from './facet-search.component';

@NgModule({
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ],
  declarations: [FacetSearchComponent, FacetContextOptionFilterPipe],
  exports: [FacetSearchComponent]
})
export class FacetSearchModule {}
