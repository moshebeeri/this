import React from 'react';
import { shallow } from 'enzyme';
import Login from 'components/Login.js';

describe('<Login />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<Login />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "login-component"', function () {
      expect(component.hasClass('login-component')).to.equal(true);
    });
  });
});
