import getStore from "../store";

const reduxStore = getStore();

class ProductComperator {
    //in case some data is missing we should filter the feed
    filterProduct(product) {
        if (product.pictures && product.pictures.length === 0) {
            return false
        }
        return true;
    }

}

export default ProductComperator;