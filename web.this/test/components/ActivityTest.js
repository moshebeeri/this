import React from 'react';
import { shallow } from 'enzyme';
import Activity from 'components/Activity.js';

describe('<Activity />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<Activity />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "activity-component"', function () {
      expect(component.hasClass('activity-component')).to.equal(true);
    });
  });
});
