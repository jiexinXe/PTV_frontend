import axios from '../utils/axios.js'
let token = localStorage.getItem("token")

// 设置axios的baseURL
axios.defaults.baseURL = 'http://localhost:20000';
axios.defaults.withCredentials = false;// Cookie跨域

import Qs from 'qs'




// 用户登录
export function userLogin (data) {
  axios.defaults.baseURL = 'http://localhost:8082';
  axios.defaults.withCredentials = false;// Cookie跨域
  return axios.post('/login?'+ Qs.stringify(data), {
   
  })  
}



//用户注册
export function userRegister(data){
  axios.defaults.baseURL = 'http://localhost:8082';
  axios.defaults.withCredentials = false;// Cookie跨域

  return axios.post(' /register?'+ Qs.stringify(data) )
}


