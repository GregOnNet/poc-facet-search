import { async, TestBed } from '@angular/core/testing';
import { FacetSearchModule } from './facet-search.module';

describe('FacetSearchModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FacetSearchModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(FacetSearchModule).toBeDefined();
  });
});
