import React from 'react';
import cssmodules from 'react-css-modules';
import styles from './style/notification.cssmodule.css';

class Notification extends React.Component {

  render() {
    return (
      <div className="notification-component" styleName="notification-component">
        Please edit src/components/Notification.js to update this component!
      </div>
    );
  }
}

Notification.displayName = 'Notification';
Notification.propTypes = {};
Notification.defaultProps = {};

export default cssmodules(Notification, styles);
