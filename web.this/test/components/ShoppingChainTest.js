import React from 'react';
import { shallow } from 'enzyme';
import ShoppingChain from 'components/ShoppingChain.js';

describe('<ShoppingChain />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<ShoppingChain />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "shoppingchain-component"', function () {
      expect(component.hasClass('shoppingchain-component')).to.equal(true);
    });
  });
});
