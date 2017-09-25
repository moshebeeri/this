import React from 'react';
import { shallow } from 'enzyme';
import Notification from 'components/Notification.js';

describe('<Notification />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<Notification />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "notification-component"', function () {
      expect(component.hasClass('notification-component')).to.equal(true);
    });
  });
});
