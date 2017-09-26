import React from 'react';
import { shallow } from 'enzyme';
import Product from 'components/Product.js';

describe('<Product />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<Product />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "product-component"', function () {
      expect(component.hasClass('product-component')).to.equal(true);
    });
  });
});
