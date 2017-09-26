import React from 'react';
import cssmodules from 'react-css-modules';
import styles from './style/activity.cssmodule.css';

class Activity extends React.Component {

  render() {
    return (
      <div className="activity-component" styleName="activity-component">
        Please edit src/components/Activity.js to update this component!
      </div>
    );
  }
}

Activity.displayName = 'Activity';
Activity.propTypes = {};
Activity.defaultProps = {};

export default cssmodules(Activity, styles);
