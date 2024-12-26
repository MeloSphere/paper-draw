// 基础配置
const BASE_URL = 'http://localhost:3000'; // 直接使用后端地址
const TIME_OUT = 10000; // 超时时间 10s

interface RequestConfig {
  url: string;
  method?: 'GET' | 'POST';
  data?: any;
  header?: Record<string, string>;
  timeout?: number;
}

interface RequestResponse<T = any> {
  statusCode: number;
  data: T;
  header: Record<string, string>;
  errMsg?: string;
}

// 请求拦截器
const requestInterceptor = (config: RequestConfig): RequestConfig => {
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
const responseInterceptor = <T>(response: RequestResponse<T>) => {
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
        title: '服务器错误',
        icon: 'none'
      });
      break;
    default:
      uni.showToast({
        title: (data as any).message || '请求失败',
        icon: 'none'
      });
  }
  
  return Promise.reject(data);
};

// 错误处理
const errorHandler = (error: any) => {
  uni.showToast({
    title: '网络错误，请稍后重试',
    icon: 'none'
  });
  return Promise.reject(error);
};

// 请求函数
const request = <T>(options: RequestConfig): Promise<T> => {
  const { url, method = 'GET', data, header = {} } = options;
  
  // 处理请求配置
  const config = requestInterceptor({
    url: `${BASE_URL}${url.startsWith('/') ? url : `/${url}`}`,
    method,
    data,
    header: {
      'Content-Type': 'application/json',
      ...header
    },
    timeout: TIME_OUT
  });

  const timestamp = new Date().toISOString();
  console.group(`🚀 Request [${timestamp}]`);
  console.log('URL:', config.url);
  console.log('Method:', config.method);
  console.log('Headers:', config.header);
  console.log('Data:', config.data);
  console.groupEnd();
  
  // 发起请求
  return new Promise((resolve, reject) => {
    uni.request({
      ...config,
      success: (response: RequestResponse<T>) => {
        const responseTimestamp = new Date().toISOString();
        console.group(`✅ Response [${responseTimestamp}]`);
        console.log('URL:', config.url);
        console.log('Status:', response.statusCode);
        console.log('Headers:', response.header);
        console.log('Data:', response.data);
        console.groupEnd();
        resolve(responseInterceptor(response));
      },
      fail: (error) => {
        const errorTimestamp = new Date().toISOString();
        console.group(`❌ Error [${errorTimestamp}]`);
        console.log('URL:', config.url);
        console.error('Error:', error);
        console.groupEnd();
        reject(errorHandler(error));
      }
    });
  });
};

// GET 请求
export const get = <T>(url: string, params: Record<string, any> = {}) => {
  // 将参数转换为查询字符串
  const query = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
  
  const requestUrl = query ? `${url}?${query}` : url;
  
  return request<T>({
    url: requestUrl,
    method: 'GET'
  });
};

// POST 请求
export const post = <T>(url: string, data: Record<string, any> = {}) => {
  return request<T>({
    url,
    method: 'POST',
    data
  });
};

const requestInstance = {
  get,
  post
};

export default requestInstance; 