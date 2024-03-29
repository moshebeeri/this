// https://github.com/yamill/react-native-inviewport/
import React from 'react'
import { View, Dimensions } from 'react-native'
import PropTypes from 'prop-types'

const window = Dimensions.get('window');

class InViewPort extends React.PureComponent {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        active: PropTypes.bool,
        delay: PropTypes.number
    };

    static defaultProps = {
        active: true,
        delay: 400,
        partialVisibility: false
    };

    constructor(props) {
        super(props);
        this.state = {
            rectTop: 0,
            rectBottom: 0
        }
    }

    onLayout() {
        if (this.props.active) {
            this.startWatching()
        }
    }

    componentWillUnmount() {
        this.stopWatching()
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.active !== this.props.active){
            if (nextProps.active) {
                this.lastValue = null;
                this.startWatching()
            } else {
                this.stopWatching()
            }
        }
    }

    startWatching() {
        if (this.interval) { return }
        this.interval = setInterval(this.check, this.props.delay)
    }

    stopWatching() {
        this.interval = clearInterval(this.interval)
    }

    check = () => {
        const el = this.myview;
        if (!el) { return }
        el.measure((ox, oy, width, height, pageX, pageY) => {
            this.setState({
                rectTop: pageY,
                rectBottom: pageY + height,
                rectWidth: pageX + width,
                //added for partial support
                rectLeft: pageX,
                rectRight: pageX + width,
            })
        });
        const containmentRect = {
            top: 0,
            left: 0,
            bottom: window.height,
            right: window.width
        };

        let isVisible = this.props.partialVisibility? (
            this.state.rectTop <= containmentRect.bottom && this.state.rectBottom >= containmentRect.top &&
            this.state.left <= containmentRect.right && this.state.right >= containmentRect.left
            ) : (
            this.state.rectBottom !== 0 && this.state.rectTop >= 0 && this.state.rectBottom <= window.height &&
            this.state.rectWidth > 0 && this.state.rectWidth <= window.width
        );

        // notify the parent when the value changes
        if (this.lastValue !== isVisible) {
            this.lastValue = isVisible;
            this.props.onChange(isVisible)
        }
    };

    check_orig = () => {
        const el = this.refs.myview;
        el.measure((ox, oy, width, height, pageX, pageY) => {
            this.setState({
                rectTop: pageY,
                rectBottom: pageY + height,
                rectWidth: pageX + width,
            })
        });
        const isVisible = (
            this.state.rectBottom !== 0 && this.state.rectTop >= 0 && this.state.rectBottom <= window.height &&
            this.state.rectWidth > 0 && this.state.rectWidth <= window.width
        );

        // notify the parent when the value changes
        if (this.lastValue !== isVisible) {
            this.lastValue = isVisible;
            this.props.onChange(isVisible);
        }
    };
    render() {
        return (
            <View ref={component => this.myview = component} {...this.props} onLayout={() => this.onLayout()}>
                {this.props.children}
            </View>
        )
    }

}

export default InViewPort