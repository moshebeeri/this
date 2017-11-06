import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {Button, Icon, Input, Item, Picker,Spinner} from 'native-base';
import styles from './styles';
import * as categoriesAction from "../../actions/categories";
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";

class CategoryPicker extends Component {
    constructor(props) {
        super(props);
        this.state ={
            invalid :false,
            selectedCategories:[""]
        }
    }

    focus() {
        const {refNext} = this.props;
        this.refs[refNext].focus()
    }

    componentWillMount() {
        const{selectedCategories} = this.props;
        if(selectedCategories) {
            let setCategoryFunc = this.setCategory.bind(this);
            let index = 0;
            selectedCategories.forEach(category => {
                setCategoryFunc(index,category)
                index = index +1;
            });

        }
    }

    setCategory(index, category) {
        const {setFormCategories, categories,setCategoriesApi} = this.props;
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
        if(!categories['en']){
            return;
        }
        let reduxxCategories = categories['en'][category];
        if (!reduxxCategories) {
            this.props.actions.fetchCategories(category,setCategoriesApi);
        }
        setFormCategories(this.state.selectedCategories);

    }
    isValid() {
        const {isMandatory, validateContent} = this.props;
        this.setState({
            invalid: false
        })
        if (isMandatory) {
            if (!this.state.selectedCategories || this.state.selectedCategories.length < 2) {
                this.setState({
                    invalid: true
                })
                return false
            }
        }
        if (validateContent) {
            if(!validateContent(value)){
                this.setState({
                    invalid: true
                })
                return false
            }
        }
        return true;
    }


    render() {
        const {categories, isMandatory,categoriesForm} = this.props;
        if (!categories['en']) {
            return <View/>
        }
        let pickerStyle = styles.picker;
        if(this.state.invalid){
            pickerStyle = styles.pickerInvalid;
        }
        let root = categories['en']['root'];
        let rootOicker = undefined;
        if (root) {
            let categoriesWIthBlank = new Array();

            root.forEach(function (cat) {
                categoriesWIthBlank.push(cat);
            })
            categoriesWIthBlank.unshift({
                gid: "",
                translations: {
                    en: "Select Category"
                }
            })
            rootOicker = <Picker

                mode="dropdown"
                placeholder="Select Category"
                style={pickerStyle}
                selectedValue={this.state.selectedCategories[0]}
                onValueChange={(category) => this.setCategory(0, category)}>

                {
                    categoriesWIthBlank.map((s, i) => {
                        return <Item
                            key={i}
                            value={s.gid}
                            label={s.translations.en}/>
                    })}
            </Picker>
        }
        let selectCategoryFunction = this.setCategory.bind(this);
        let stateCategories = this.state.selectedCategories
        let pickers = this.state.selectedCategories.map(function (gid, i) {
            let subCategories = categories['en'][gid];
            if (subCategories && subCategories.length > 0) {
                let categoriesWIthBlank = new Array();
                subCategories.forEach(function (cat) {
                    categoriesWIthBlank.push(cat);
                })
                categoriesWIthBlank.unshift({
                    gid: "",
                    translations: {
                        en: "Select Sub Category"
                    }
                })
                return <Picker
                    key={i}

                    placeholder="Select Category"
                    mode="dropdown"
                    style={pickerStyle}
                    selectedValue={stateCategories[i + 1]}
                    onValueChange={(category) => selectCategoryFunction(i + 1, category)}>

                    {
                        categoriesWIthBlank.map((s, j) => {
                            return <Item
                                key={j}
                                value={s.gid}
                                label={s.translations.en}/>
                        })}
                </Picker>
            }
            return undefined;
        })

        let spinner = undefined
        if(categoriesForm.categoriesFetching){
            spinner =  <Spinner/>;
        }


        return <View>
            <View style={styles.pickerTitleContainer}>
                <Text style={styles.pickerTextStyle}>Category</Text>
                {isMandatory && <Icon style={{margin: 5, color: 'red', fontSize: 12}} name='star'/>}
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


