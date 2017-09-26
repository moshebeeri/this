import React from 'react';
import { shallow } from 'enzyme';
import Brand from 'components/Brand.js';

describe('<Brand />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<Brand />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "brand-component"', function () {
      expect(component.hasClass('brand-component')).to.equal(true);
    });
  });
});
