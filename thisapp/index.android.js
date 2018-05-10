/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import { AppRegistry } from "react-native";
import App from "./js/startApp";
import codePush from "react-native-code-push";

let codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };

let app = codePush(codePushOptions)(App);

AppRegistry.registerComponent('groupys', () => App);
