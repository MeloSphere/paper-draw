import { request, uploadFile } from '../utils/request';

export interface Note {
  id: string;
  content: string;
  images: string[];
  school: string;
  gender: 'male' | 'female';
  createTime: string;
  status: string;
}

export interface UserInfo {
  id: string;
  nickname: string;
  avatar: string;
  points: number;
}

// 发布纸条
export const publishNote = (data: {
  content: string;
  images: string[];
  school: string;
  gender: 'male' | 'female';
}) => {
  return request<Note>({
    url: '/notes',
    method: 'POST',
    data
  });
};

// 抽取纸条
export const drawNotes = (data: {
  gender?: 'male' | 'female' | 'all';
  count: number;
}) => {
  return request<Note[]>({
    url: '/notes/draw',
    method: 'POST',
    data
  });
};

// 获取用户信息
export const getUserInfo = () => {
  return request<UserInfo>({
    url: '/user/info'
  });
};

// 获取发布历史
export const getPublishedNotes = () => {
  return request<Note[]>({
    url: '/notes/published'
  });
};

// 获取抽取历史
export const getDrawnNotes = () => {
  return request<Note[]>({
    url: '/notes/drawn'
  });
};

// 上传图片
export const upload = async (filePath: string) => {
  return uploadFile(filePath);
}; 