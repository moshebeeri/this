import React from 'react';
import { shallow } from 'enzyme';
import Business from 'components/Business.js';

describe('<Business />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<Business />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "business-component"', function () {
      expect(component.hasClass('business-component')).to.equal(true);
    });
  });
});
