/**
 * Created by roilandshut on 26/03/2017.
 */
/**
 * Created by roilandshut on 26/03/2017.
 */
import store from 'react-native-simple-store';

class PromotionApi
{
    createPromotion(promotion) {
        return new Promise(async(resolve, reject) => {

            try {
                let token = await store.get('token');
                const response = await fetch(`${server_host}/api/promotions/campaign`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token

                    },
                    body: JSON.stringify(promotion)

                })
                if (response.status == '401') {
                    reject(response);
                    return;
                }

                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {

                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
            }
        })


    }
}

export default PromotionApi;