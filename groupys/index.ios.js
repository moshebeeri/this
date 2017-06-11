/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import { AppRegistry } from "react-native";
import App from "./js/startApp";
import codePush from "react-native-code-push";


let app = codePush(App);

AppRegistry.registerComponent('groupys', () => App);
