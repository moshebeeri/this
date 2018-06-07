import React, {Component} from 'react';
import {Keyboard, View} from 'react-native'
import styles from '../styles'
import {TextInput, ThisText} from '../../../../ui/index';
import strings from "../../../../i18n/i18n";
import StyleUtils from '../../../../utils/styleUtils';
import FormUtils from "../../../../utils/fromUtils";

import {Thumbnail} from 'native-base';

export default class PointsComponent extends Component {
    constructor(props) {
        super(props);
    }

    focusNextField(nextField) {
        if (this.refs[nextField].wrappedInstance) {
            this.refs[nextField].wrappedInstance.focus()
        }
        if (this.refs[nextField]) {
            this.refs[nextField].focus()
        }
    }


    isValid() {
        let result = true;
        Object.keys(this.refs).forEach(key => {
            let item = this.refs[key];
            if (this.refs[key].wrappedInstance) {
                item = this.refs[key].wrappedInstance;
            }
            if (!item.isValid()) {
                result = false;
            }
        });
        return result
    }

    setMinPoints(value) {
        let points_ratio = this.props.state.points.points_ratio;
        let accumulate_ratio = this.props.state.points.accumulate_ratio;

        this.props.setState(
            {
                points: {
                    min_points: value,
                    points_ratio: points_ratio,
                    accumulate_ratio: accumulate_ratio
                },
            }
        )
    }

    setPointsRatio(value) {
        let min_points = this.props.state.points.min_points;
        let accumulate_ratio = this.props.state.points.accumulate_ratio;

        this.props.setState(
            {
                points: {
                    min_points: min_points,
                    points_ratio: value,
                    accumulate_ratio:accumulate_ratio
                },
            }
        )
    }


    setAccumulateRatio(value) {
        let min_points = this.props.state.points.min_points;
        let points_ratio = this.props.state.points.points_ratio;

        this.props.setState(
            {
                points: {
                    min_points: min_points,
                    points_ratio: points_ratio,
                    accumulate_ratio: value
                },
            }
        )
    }

    done() {
        Keyboard.dismiss();
    }

    render() {
        return <View>
            <View style={[styles.textLayout, {width: StyleUtils.getWidth() - 15}]}>

                <ThisText style={{color: '#FA8559', marginLeft: 8, marginRight: 8}}>{strings.PointsDiscount}</ThisText>
            </View>
            <View>
                <View style={styles.inputTextLayout}>

                    <TextInput field={strings.MinPointsTerm} value={this.props.state.points.min_points}
                               returnKeyType='next' ref="retail" refNext="retail"
                               keyboardType='numeric'
                               validateContent={FormUtils.validateNumberic}
                               onChangeText={(value) => this.setMinPoints(value)} isMandatory={true}/>
                </View>
                <View style={[styles.inputTextLayout, {flexDirection: 'column', width: StyleUtils.getWidth() - 15}]}>

                    <TextInput field={strings.PointsRatio} value={this.props.state.points.points_ratio}
                               returnKeyType='next' ref="retail" refNext="retail"
                               keyboardType='numeric'
                               validateContent={FormUtils.validateNumberic}
                               placeholder={strings.PointsRatioExample}
                               onChangeText={(value) => this.setPointsRatio(value)} isMandatory={true}/>

                </View>
                <View style={[styles.inputTextLayout, {flexDirection: 'column', width: StyleUtils.getWidth() - 15}]}>

                    <TextInput field={strings.PointsAccumulationRatio} value={this.props.state.points.accumulate_ratio}
                               returnKeyType='next' ref="retail" refNext="retail"
                               keyboardType='numeric'
                               validateContent={FormUtils.validatePercent}
                               placeholder={strings.PointsAccumulationExample}
                               onChangeText={(value) => this.setAccumulateRatio(value)} isMandatory={true}/>

                </View>
            </View>
        </View>
    }
}

