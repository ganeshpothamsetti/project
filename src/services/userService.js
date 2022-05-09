import http from './httpService';


const apiEndPoint = '/auth/register';

export function register(user) {
    return http.post(apiEndPoint, {
        email: user.email,
        name: user.name,
        password: user.password
    });
}