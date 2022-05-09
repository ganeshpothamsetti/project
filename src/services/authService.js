import http from './httpService';

import jwtDecode from 'jwt-decode';


const apiEndPoint = '/auth/login';
const tokenKey = "access_token";
const userKey = 'userName';

http.setJwt(getJwt());

export async function login(email, password) {
    const { data: { access_token, userName }} = await http.post(apiEndPoint, { email, password });
    localStorage.setItem(tokenKey, access_token);
    localStorage.setItem(userKey, userName)
}

export function loginWithJwt(jwt) {
    localStorage.setItem(tokenKey, jwt);
}

export function logout() {
    localStorage.removeItem(tokenKey)
    localStorage.removeItem(userKey)
}
export function getCurrentUser() {
    try {
        const jwt = localStorage.getItem(tokenKey);
        return jwtDecode(jwt);

    } catch (ex) {
        return null;
    }
}

export function getJwt() {
    return localStorage.getItem(tokenKey);
}

export default {
    login,
    logout,
    getCurrentUser,
    loginWithJwt,
    getJwt
}