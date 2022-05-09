import http from './httpService';


const apiEndPoint = '/products';

function productUrl(id) {
    return `${apiEndPoint}/${id}`;
}

export function getProducts() {
    return http.get(apiEndPoint);
}

export function getProduct(productId) {
    return http.get(productUrl(productId));
}

export function saveProduct(product) {
    if (product.id) {
        const body = { ...product };
        delete body.id;
        return http.put(productUrl(product.id), body);
    }

    return http.post(apiEndPoint, product);
}

export function deleteProduct(productId) {
    return http.delete(productUrl(productId));
}