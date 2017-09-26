import React from 'react';
import { shallow } from 'enzyme';
import Promotion from 'components/Promotion.js';

describe('<Promotion />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<Promotion />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "promotion-component"', function () {
      expect(component.hasClass('promotion-component')).to.equal(true);
    });
  });
});
