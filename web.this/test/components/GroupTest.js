import React from 'react';
import { shallow } from 'enzyme';
import Group from 'components/Group.js';

describe('<Group />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<Group />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "group-component"', function () {
      expect(component.hasClass('group-component')).to.equal(true);
    });
  });
});
