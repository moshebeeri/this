import React from 'react';
import { shallow } from 'enzyme';
import Instance from 'components/Instance.js';

describe('<Instance />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<Instance />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "instance-component"', function () {
      expect(component.hasClass('instance-component')).to.equal(true);
    });
  });
});
