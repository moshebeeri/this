import React from 'react';
import cssmodules from 'react-css-modules';
import styles from './style/comment.cssmodule.css';

class Comment extends React.Component {

  render() {
    return (
      <div className="comment-component" styleName="comment-component">
        Please edit src/components/Comment.js to update this component!
      </div>
    );
  }
}

Comment.displayName = 'Comment';
Comment.propTypes = {};
Comment.defaultProps = {};

export default cssmodules(Comment, styles);
