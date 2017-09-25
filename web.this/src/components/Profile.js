import React from 'react';
import cssmodules from 'react-css-modules';
import styles from './style/profile.cssmodule.css';

class Profile extends React.Component {

  render() {
    return (
      <div className="profile-component" styleName="profile-component">
        Please edit src/components/Profile.js to update this component!
      </div>
    );
  }
}

Profile.displayName = 'Profile';
Profile.propTypes = {};
Profile.defaultProps = {};

export default cssmodules(Profile, styles);
