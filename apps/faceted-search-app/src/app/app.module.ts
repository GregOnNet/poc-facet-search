import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FacetSearchModule } from '@faceted-search/facet-search';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FacetSearchModule, BrowserAnimationsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
