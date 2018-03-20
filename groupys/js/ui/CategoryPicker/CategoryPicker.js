import React, {Component} from 'react';
import {View} from 'react-native';
import {Button, Icon, Input, Item, Picker, Spinner} from 'native-base';
import styles from './styles';
import * as categoriesAction from "../../actions/categories";
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import FormUtils from "../../utils/fromUtils";
import {ThisText} from '../index';
import strings from "../../i18n/i18n"
import StyleUtils from "../../utils/styleUtils";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

class CategoryPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            invalid: false,
            selectedCategories: [""]
        }
    }

    focus() {
        const {refNext} = this.props;
        this.refs[refNext].focus()
    }

    componentWillMount() {
        const {selectedCategories} = this.props;
        if (selectedCategories) {
            let setCategoryFunc = this.setCategory.bind(this);
            let index = 0;
            selectedCategories.forEach(category => {
                setCategoryFunc(index, category)
                index = index + 1;
            });
        }
    }

    setCategory(index, category) {
        const {setFormCategories, categories, setCategoriesApi} = this.props;
        const locale = FormUtils.getLocale();
        this.setState({
            invalid: false
        })
        if (!category) {
            return;
        }
        if (this.state.selectedCategories.length <= index) {
            this.state.selectedCategories.push(category);
            this.state.selectedCategories.push("");
        } else {
            let newCategories = new Array();
            for (i = 0; i + 1 <= index; i++) {
                newCategories.push(this.state.selectedCategories[i]);
            }
            this.state.selectedCategories = newCategories
            this.state.selectedCategories.push(category);
            this.state.selectedCategories.push("");
        }
        if (!categories[locale]) {
            return;
        }
        let reduxxCategories = categories[locale][category];
        if (!reduxxCategories) {
            this.props.actions.fetchCategories(category, setCategoriesApi);
        }
        setFormCategories(this.state.selectedCategories);
    }

    isValid() {
        const {isMandatory, validateContent} = this.props;
        this.setState({
            invalid: false
        })
        if (isMandatory) {
            if (!this.state.selectedCategories || this.state.selectedCategories.length < 3) {
                this.setState({
                    invalid: true
                })
                return false
            }
        }
        if (validateContent) {
            if (!validateContent(value)) {
                this.setState({
                    invalid: true
                })
                return false
            }
        }
        return true;
    }

    render() {
        const {categories, isMandatory, categoriesForm} = this.props;
        const locale = FormUtils.getLocale();
        if (!categories[locale]) {
            return <View/>
        }
        let pickerStyle = styles.picker;
        if (this.state.invalid) {
            pickerStyle = styles.pickerInvalid;
        }
        let root = categories[locale]['root'];
        let rootOicker = undefined;
        if (root) {
            let categoriesWIthBlank = new Array();
            root.forEach(function (cat) {
                categoriesWIthBlank.push(cat);
            })
            categoriesWIthBlank.unshift({
                gid: "",
                translations: {
                    en: strings.SelectCategory,
                    iw: strings.SelectCategory,
                }
            })
            rootOicker = <Picker

                mode="dropdown"
                placeholder={strings.SelectCategory}
                style={[pickerStyle, {width: StyleUtils.getWidth() - 25}]}

                selectedValue={this.state.selectedCategories[0]}
                onValueChange={(category) => this.setCategory(0, category)}>

                {
                    categoriesWIthBlank.map((s, i) => {
                        return <Item
                            key={i}
                            value={s.gid}
                            label={s.translations[locale]}/>
                    })}
            </Picker>
        }
        let selectCategoryFunction = this.setCategory.bind(this);
        let stateCategories = this.state.selectedCategories
        let pickers = this.state.selectedCategories.map(function (gid, i) {
            let subCategories = categories[locale][gid];
            if (subCategories && subCategories.length > 0) {
                let categoriesWIthBlank = new Array();
                subCategories.forEach(function (cat) {
                    categoriesWIthBlank.push(cat);
                })
                categoriesWIthBlank.unshift({
                    gid: "",
                    translations: {
                        en: strings.SelectSubCategory,
                        iw: strings.SelectSubCategory,
                    }
                })
                return <Picker
                    key={i}

                    placeholder={strings.SelectCategory}
                    mode="dropdown"
                    style={[pickerStyle, {width: StyleUtils.getWidth() - 25}]}
                    selectedValue={stateCategories[i + 1]}
                    onValueChange={(category) => selectCategoryFunction(i + 1, category)}>

                    {
                        categoriesWIthBlank.map((s, j) => {
                            return <Item
                                key={j}
                                value={s.gid}
                                label={s.translations[locale]}/>
                        })}
                </Picker>
            }
            return undefined;
        })
        let spinner = undefined
        if (categoriesForm.categoriesFetching) {
            spinner = <Spinner/>;
        }
        return <View>
            <View style={styles.pickerTitleContainer}>

                <ThisText style={styles.pickerTextStyle}>{strings.Category}</ThisText>
                {isMandatory &&
                <MaterialCommunityIcons style={{marginLeft: 3, marginTop: 4, color: 'red', fontSize: 8}}
                                        name='asterisk'/>}

            </View>

            {rootOicker}{pickers}
            {spinner}
        </View>
    }
}

export default connect(
    state => ({
        categoriesForm: state.categoriesForm
    }),
    (dispatch) => ({
        actions: bindActionCreators(categoriesAction, dispatch),
    }), null, {withRef: true}
)(CategoryPicker);


