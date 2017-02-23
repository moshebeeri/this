

function transformJson(json){
  return json;
}


module.exports = function(entityApi,entityData,token,callbackFunction,errorCallBack) {
    let entity = transformJson(entityData);

    fetch('http://low.la:9000/api/' + entityApi, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': 'Bearer ' + token,
        },
        body: entity

        }

     ).then((response) => response.json())
        .then((responseData) => {
            callbackFunction(responseData);

        }).catch(function (error) {

        console.log('There has been a problem with your fetch operation: ' + error.message);

        errorCallBack(error);

    });

}

