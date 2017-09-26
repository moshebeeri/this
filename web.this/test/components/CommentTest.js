import React from 'react';
import { shallow } from 'enzyme';
import Comment from 'components/Comment.js';

describe('<Comment />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<Comment />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "comment-component"', function () {
      expect(component.hasClass('comment-component')).to.equal(true);
    });
  });
});
