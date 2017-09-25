import React from 'react';
import cssmodules from 'react-css-modules';
import styles from './style/business.cssmodule.css';

class Business extends React.Component {

  render() {
    return (
      <div className="business-component" styleName="business-component">
        Please edit src/components/Business.js to update this component!
      </div>
    );
  }
}

Business.displayName = 'Business';
Business.propTypes = {};
Business.defaultProps = {};

export default cssmodules(Business, styles);
