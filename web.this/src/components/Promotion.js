import React from 'react';
import cssmodules from 'react-css-modules';
import styles from './style/promotion.cssmodule.css';

class Promotion extends React.Component {

  render() {
    return (
      <div className="promotion-component" styleName="promotion-component">
        Please edit src/components/Promotion.js to update this component!
      </div>
    );
  }
}

Promotion.displayName = 'Promotion';
Promotion.propTypes = {};
Promotion.defaultProps = {};

export default cssmodules(Promotion, styles);
