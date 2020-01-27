import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FacetSearchModule } from '@faceted-search/facet-search';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FacetSearchModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
