import React from 'react';
import cssmodules from 'react-css-modules';
import styles from './style/group.cssmodule.css';

class Group extends React.Component {

  render() {
    return (
      <div className="group-component" styleName="group-component">
        Please edit src/components/Group.js to update this component!
      </div>
    );
  }
}

Group.displayName = 'Group';
Group.propTypes = {};
Group.defaultProps = {};

export default cssmodules(Group, styles);
