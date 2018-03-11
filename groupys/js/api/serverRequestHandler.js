import * as errors from './Errors'
import Timer from "./LogTimer";

let timer = new Timer();

class ServerRequestHandler {
    handleServerRequest(status) {
        if (status < 400) {
            return '';
        } else if (status === 401 || status === 403) {
            return errors.UN_AUTHOTIZED_ACCESS;
        } else if (status === 402) {
            return errors.PAYMENT_REQUIRED;
        } else {
            return errors.UNHANDLED_ERROR;
        }
    }

    fetch_handler(url, options, entity, api, type = 'JSON') {
        return new Promise(async (resolve, reject) => {
            const start = new Date();
            fetch(url, options)
                .then(
                    response => {
                        const status = parseInt(response.status);
                        let statusValidate = this.handleServerRequest(status);
                        if (statusValidate) {
                            return reject(statusValidate);
                        }
                        if(status === 204){
                           return resolve({
                                message: 'No Content',
                            });
                        }
                        timer.logTime(start, new Date(), entity, api);
                        switch (type) {
                            case 'JSON':
                                try {
                                    response.json().then(responseData => {
                                        return resolve(responseData);
                                    });
                                }catch (e){
                                    console.log(entity + api +' failed');
                                }
                                break;
                            case 'TEXT':
                                return response._bodyText
                                break;
                            case 'BOOLEAN':
                                return resolve(true);
                                break;
                        }
                    }
                ).catch(
                err => {
                    let ret;
                    if (err.message === 'Network request failed')
                        ret = errors.NETWORK_ERROR;
                    else
                        ret = errors.UNHANDLED_ERROR;
                    timer.logTime(start, new Date(), entity, api);
                    return reject(ret)
                }
            );
        })
    }
}

let serverRequestHandler = new ServerRequestHandler();
export default serverRequestHandler;