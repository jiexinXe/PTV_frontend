import axios from 'axios';
import store from '../store/index.js';
import { Message } from 'element-ui';

const service = axios.create({
    timeout: 50000,
    headers: {
        'Content-Type': "application/json; charset=utf-8"
    }
});

// 请求拦截
service.interceptors.request.use(
    config => {
        // 如果请求是发送到/login，则清除localStorage中的token
        if (config.url.includes('/login')) {
            localStorage.removeItem("token");
            console.log("Logging in: Token removed from localStorage.");
        } else {
            // 对于其他请求，如果存在token，则添加到请求头
            let token = localStorage.getItem("token");
            if (token) {
                token = token.replace(/^"|"$/g, ''); // 去掉开头和结尾的引号
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);



// 响应拦截
service.interceptors.response.use(
    response => {
        const { status, data } = response;
        if (status !== 200) {
            Message.error('网络异常，请刷新或者重试!');
            return Promise.reject('网络异常!');
        }
        if (data.code === 401) {
            store.commit('login/SET_SHOW_LOGIN', true);
            store.dispatch('login/logout');
            return Promise.resolve({
                code: -1,
                msg: data.msg
            });
        } else {
            return response;
        }
    },
    error => {
        return Promise.reject(error);
    }
);

export default service;
