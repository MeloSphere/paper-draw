import request from '@/utils/request';

// 获取纸条列表
export const getPaperList = (params) => {
  return request.get('/api/papers', params);
};

// 抽取纸条
export const drawPapers = (data) => {
  return request.post('/api/papers/draw', data);
};

// 发布纸条
export const publishPaper = (data) => {
  return request.post('/api/papers', data);
};

// 获取我的发布记录
export const getMyPublished = () => {
  return request.get('/api/papers/my-published');
};

// 获取我的抽取记录
export const getMyDrawn = () => {
  return request.get('/api/papers/my-drawn');
};

// 获取统计数据
export const getStats = () => {
  return request.get('/api/papers/stats');
}; 