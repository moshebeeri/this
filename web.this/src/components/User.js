import React from 'react';
import cssmodules from 'react-css-modules';
import styles from './style/user.cssmodule.css';

class User extends React.Component {

  render() {
    return (
      <div className="user-component" styleName="user-component">
        Please edit src/components/User.js to update this component!
      </div>
    );
  }
}

User.displayName = 'User';
User.propTypes = {};
User.defaultProps = {};

export default cssmodules(User, styles);
