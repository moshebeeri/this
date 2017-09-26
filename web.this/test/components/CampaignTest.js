import React from 'react';
import { shallow } from 'enzyme';
import Campaign from 'components/Campaign.js';

describe('<Campaign />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<Campaign />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "campaign-component"', function () {
      expect(component.hasClass('campaign-component')).to.equal(true);
    });
  });
});
