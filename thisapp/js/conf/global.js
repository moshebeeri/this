import Config from 'react-native-config'

module.exports = {
    server_host:Config.API_URL,
    debug:true
};
global.server_host = Config.API_URL;
global.debug = true;
global.appBackgroundColor= '#E6E6E6';