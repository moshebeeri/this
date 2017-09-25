import React from 'react';
import cssmodules from 'react-css-modules';
import styles from './style/card.cssmodule.css';

class Card extends React.Component {

  render() {
    return (
      <div className="card-component" styleName="card-component">
        Please edit src/components/Card.js to update this component!
      </div>
    );
  }
}

Card.displayName = 'Card';
Card.propTypes = {};
Card.defaultProps = {};

export default cssmodules(Card, styles);
