// 基础配置
const BASE_URL = 'http://localhost:3000/api'; // 替换为你的实际 API 地址
const TIME_OUT = 10000; // 超时时间 10s

// 请求拦截器
const requestInterceptor = (config) => {
  // 获取 token
  const token = uni.getStorageSync('token');
  if (token) {
    config.header = {
      ...config.header,
      'Authorization': `Bearer ${token}`
    };
  }
  return config;
};

// 响应拦截器
const responseInterceptor = (response) => {
  const { statusCode, data } = response;
  
  // 请求成功
  if (statusCode >= 200 && statusCode < 300) {
    return data;
  }
  
  // 处理特定错误码
  switch (statusCode) {
    case 401:
      // token 过期或未登录
      uni.showToast({
        title: '请先登录',
        icon: 'none'
      });
      // 可以在这里处理登录跳转
      break;
    case 403:
      uni.showToast({
        title: '没有权限',
        icon: 'none'
      });
      break;
    case 404:
      uni.showToast({
        title: '请求的资源不存在',
        icon: 'none'
      });
      break;
    case 500:
      uni.showToast({
        title: '服��器错误',
        icon: 'none'
      });
      break;
    default:
      uni.showToast({
        title: data.message || '请求失败',
        icon: 'none'
      });
  }
  
  return Promise.reject(data);
};

// 错误处理
const errorHandler = (error) => {
  uni.showToast({
    title: '网络错误，请稍后重试',
    icon: 'none'
  });
  return Promise.reject(error);
};

// 请求函数
const request = (options) => {
  const { url, method = 'GET', data, header = {} } = options;
  
  // 处理请求配置
  const config = requestInterceptor({
    url: `${BASE_URL}${url}`,
    method,
    data,
    header,
    timeout: TIME_OUT
  });
  
  // 发起请求
  return new Promise((resolve, reject) => {
    uni.request({
      ...config,
      success: (response) => {
        resolve(responseInterceptor(response));
      },
      fail: (error) => {
        reject(errorHandler(error));
      }
    });
  });
};

// GET 请求
export const get = (url, params = {}) => {
  // 将参数转换为查询字符串
  const query = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
  
  const requestUrl = query ? `${url}?${query}` : url;
  
  return request({
    url: requestUrl,
    method: 'GET'
  });
};

// POST 请求
export const post = (url, data = {}) => {
  return request({
    url,
    method: 'POST',
    data
  });
};

export default {
  get,
  post
}; 