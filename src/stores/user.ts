import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getUserInfo } from '../api';
import type { UserInfo } from '../api';

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo | null>(null);
  const isLoading = ref(false);

  const fetchUserInfo = async () => {
    if (isLoading.value) return;
    
    isLoading.value = true;
    try {
      const res = await getUserInfo();
      userInfo.value = res.data;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      uni.showToast({
        title: '获取用户信息失败',
        icon: 'none'
      });
    } finally {
      isLoading.value = false;
    }
  };

  const updatePoints = (points: number) => {
    if (userInfo.value) {
      userInfo.value.points = points;
    }
  };

  return {
    userInfo,
    isLoading,
    fetchUserInfo,
    updatePoints
  };
}); 