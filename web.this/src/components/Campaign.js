import React from 'react';
import cssmodules from 'react-css-modules';
import styles from './style/campaign.cssmodule.css';

class Campaign extends React.Component {

  render() {
    return (
      <div className="campaign-component" styleName="campaign-component">
        Please edit src/components/Campaign.js to update this component!
      </div>
    );
  }
}

Campaign.displayName = 'Campaign';
Campaign.propTypes = {};
Campaign.defaultProps = {};

export default cssmodules(Campaign, styles);
