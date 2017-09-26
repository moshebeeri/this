import React from 'react';
import { shallow } from 'enzyme';
import Profile from 'components/Profile.js';

describe('<Profile />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<Profile />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "profile-component"', function () {
      expect(component.hasClass('profile-component')).to.equal(true);
    });
  });
});
