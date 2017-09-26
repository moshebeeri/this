import React from 'react';
import { shallow } from 'enzyme';
import Card from 'components/Card.js';

describe('<Card />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<Card />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "card-component"', function () {
      expect(component.hasClass('card-component')).to.equal(true);
    });
  });
});
