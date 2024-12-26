import request from '@/utils/request';

interface PaperData {
  content: string;
  gender: 'male' | 'female';
  school: string;
  images: string[];
}

interface DrawParams {
  gender: 'male' | 'female' | 'all';
  count: number;
}

interface PaperResponse {
  id: string;
  content: string;
  gender: 'male' | 'female';
  school: string;
  images: string[];
  createdAt: string;
  userId: string;
}

interface StatsResponse {
  todayDrawCount: number;
  totalPapers: number;
  satisfactionRate: number;
}

// 获取纸条列表
export const getPaperList = (params: { page?: number; limit?: number; gender?: string }) => {
  return request.get<PaperResponse[]>('/papers', params);
};

// 抽取纸条
export const drawPapers = (data: DrawParams) => {
  return request.post<PaperResponse[]>('/papers/draw', data);
};

// 发布纸条
export const publishPaper = (data: PaperData) => {
  return request.post<PaperResponse>('/papers', data);
};

// 获取我的发布记录
export const getMyPublished = () => {
  return request.get<PaperResponse[]>('/papers/my-published');
};

// 获取我的抽取记录
export const getMyDrawn = () => {
  return request.get<PaperResponse[]>('/papers/my-drawn');
};

// 获取统计数据
export const getStats = () => {
  return request.get<StatsResponse>('/papers/stats');
};