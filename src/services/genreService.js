import http from './httpService';


export function getItems() {
    return http.get('/products');
}
