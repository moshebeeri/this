import React from 'react';
import cssmodules from 'react-css-modules';
import styles from './style/instance.cssmodule.css';

class Instance extends React.Component {

  render() {
    return (
      <div className="instance-component" styleName="instance-component">
        Please edit src/components/Instance.js to update this component!
      </div>
    );
  }
}

Instance.displayName = 'Instance';
Instance.propTypes = {};
Instance.defaultProps = {};

export default cssmodules(Instance, styles);
