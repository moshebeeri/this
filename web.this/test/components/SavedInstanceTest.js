import React from 'react';
import { shallow } from 'enzyme';
import SavedInstance from 'components/SavedInstance.js';

describe('<SavedInstance />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<SavedInstance />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "savedinstance-component"', function () {
      expect(component.hasClass('savedinstance-component')).to.equal(true);
    });
  });
});
