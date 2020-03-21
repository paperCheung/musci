import axios from 'axios'

//请求拦截器 
axios.interceptors.request.use(function (config) {
  return config;
}, function (error) {
  return Promise.reject(error);
});

//响应拦截器  接受到数据的时候对数据进行处理
axios.interceptors.response.use(function (response) {
  return response.data;
}, function (error) {
  return Promise.reject(error);
});

export default axios
