import Config from 'react-native-config'

module.exports = {
    server_host:Config.API_URL,
    help_url:Config.HELP_URL,
    debug:true
};
global.server_host = Config.API_URL;
global.help_url = Config.HELP_URL;
global.codepush = Config.CODE_PUSH_IOS;
global.versionClient = '1.0.17';
global.debug = true;
global.appBackgroundColor= '#E6E6E6';