import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {Button, Input,Picker,Item} from 'native-base';
import styles from './styles';

export default class CategoryPicker extends Component {
    constructor(props) {
        super(props);
    }

    focus() {
        const {refNext} = this.props;
        this.refs[refNext].focus()
    }

    render() {
        const{categories,selectedCategories,setCategory} = this.props;
        let root = categories['categoriesenroot'];
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
                style={styles.picker}
                selectedValue={this.state.categories[0]}
                onValueChange={this.setCategory.bind(this, 0)}>

                {
                    categoriesWIthBlank.map((s, i) => {
                        return <Item
                            key={i}
                            value={s.gid}
                            label={s.translations.en}/>
                    })}
            </Picker>
        }

        let pickers = selectedCategories.map(function (gid, i) {
            let subCategories = categories['categoriesen' + gid];
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
                    style={styles.picker}
                    selectedValue={selectedCategories[i + 1]}
                    onValueChange={setCategory.bind(this, i + 1)}>

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
        return <View>{rootOicker}{pickers}</View>
    }


}

