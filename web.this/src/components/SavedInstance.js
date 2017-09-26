import React from 'react';
import cssmodules from 'react-css-modules';
import styles from './style/savedinstance.cssmodule.css';

class SavedInstance extends React.Component {

  render() {
    return (
      <div className="savedinstance-component" styleName="savedinstance-component">
        Please edit src/components/SavedInstance.js to update this component!
      </div>
    );
  }
}

SavedInstance.displayName = 'SavedInstance';
SavedInstance.propTypes = {};
SavedInstance.defaultProps = {};

export default cssmodules(SavedInstance, styles);
