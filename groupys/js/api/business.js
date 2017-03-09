

module.exports = function(token,callback) {


        fetch(`${server_host}/api/businesses/list/mine`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token

            }

        }).then(function (response) {
            if (response.status == '401') {

                return;
            }


            response.json().then((responseData) => {

                callback(responseData);
            })

        }).catch(function (error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
        });



}

