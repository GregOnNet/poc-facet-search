import { Facet, FacetContext } from './facet';

describe('FacetContext', () => {
  describe('When an option is selected', () => {
    it('assigns the next value to it', () => {
      const facet = new Facet();
      const context = new FacetContext([facet]);

      context.scope(facet);

      context.setValue('');
      const value = context.popValue();

      context.unscope();
    });
  });
});

/*
   { label: 'Project' }                                 // => FacetFreeText
   { label: 'Assignee', options: ['Peter', 'Markus'] }  // => FacetOption
   { label: 'Company', children: [                      // => FacetGroup
       { label: 'Type', option: ['AG', 'GmbH'] },
       { label: 'Name' }                                // name = 'foo' && type = ['AG' || 'GmbH']
     ]
   }
*/

/*

  { label: 'Company', children: [ { label: 'Type', value: 'AG' } ] }

*/
