import React from 'react';
import cssmodules from 'react-css-modules';
import styles from './style/brand.cssmodule.css';

class Brand extends React.Component {

  render() {
    return (
      <div className="brand-component" styleName="brand-component">
        Please edit src/components/Brand.js to update this component!
      </div>
    );
  }
}

Brand.displayName = 'Brand';
Brand.propTypes = {};
Brand.defaultProps = {};

export default cssmodules(Brand, styles);
