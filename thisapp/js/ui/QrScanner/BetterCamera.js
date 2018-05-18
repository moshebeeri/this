import Camera from "react-native-camera";
import {AppState} from "react-native";


export default class BetterCamera extends Camera {
    constructor(props) {
        super(props)
        this.state = {
            appState: AppState.currentState
        }
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange)
        if (typeof super.componentDidMount === "function") {
            super.componentDidMount()
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount()
        AppState.removeEventListener('change', this._handleAppStateChange)
    }

    _handleAppStateChange = (nextAppState) => {
        this.setState({appState: nextAppState});
    }

    render() {
        if(this.state.appState === 'active') {
            return(
                super.render()
            )
        } else {
            return null
        }
    }
}