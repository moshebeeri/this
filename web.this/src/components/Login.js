import React from 'react';
import cssmodules from 'react-css-modules';
import styles from './style/login.cssmodule.css';

class Login extends React.Component {

  render() {
    return (
      <div className="login-component" styleName="login-component">
        Please edit src/components/Login.js to update this component!
      </div>
    );
  }
}

Login.displayName = 'Login';
Login.propTypes = {};
Login.defaultProps = {};

export default cssmodules(Login, styles);
