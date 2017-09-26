import React from 'react';
import cssmodules from 'react-css-modules';
import styles from './style/shoppingchain.cssmodule.css';

class ShoppingChain extends React.Component {

  render() {
    return (
      <div className="shoppingchain-component" styleName="shoppingchain-component">
        Please edit src/components/ShoppingChain.js to update this component!
      </div>
    );
  }
}

ShoppingChain.displayName = 'ShoppingChain';
ShoppingChain.propTypes = {};
ShoppingChain.defaultProps = {};

export default cssmodules(ShoppingChain, styles);
