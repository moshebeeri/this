import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {Button, Icon, Input, Item, Picker} from 'native-base';
import styles from './styles';

export default class CategoryPicker extends Component {
    constructor(props) {
        super(props);
        this.state ={
            invalid :false,
        }
    }

    focus() {
        const {refNext} = this.props;
        this.refs[refNext].focus()
    }

    isValid() {
        const {isMandatory, selectedCategories, validateContent} = this.props;
        this.setState({
            invalid: false
        })
        if (isMandatory) {
            if (!selectedCategories || selectedCategories.length === 0) {
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

    setCategory(index,category){
        const { setCategory} = this.props;
        this.setState({
            invalid: false
        })
        setCategory(index, category)
    }

    render() {
        const {categories, selectedCategories, isMandatory} = this.props;
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
                selectedValue={selectedCategories[0]}
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

        let pickers = selectedCategories.map(function (gid, i) {
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
                    selectedValue={selectedCategories[i + 1]}
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


        return <View>
            <View style={styles.pickerTitleContainer}>
                <Text style={styles.pickerTextStyle}>Category</Text>
                {isMandatory && <Icon style={{margin: 5, color: 'red', fontSize: 12}} name='star'/>}
            </View>

            {rootOicker}{pickers}
        </View>
    }
}

