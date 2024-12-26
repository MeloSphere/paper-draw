<template>
  <view class="container">
    <view class="form-card">
      <view class="form-group">
        <view class="label-row">
          <text class="label">写下你的故事</text>
          <text class="word-count" :class="{ 'near-limit': content.length > 400 }">
            {{ content.length }}/500
          </text>
        </view>
        <textarea
          v-model="content"
          class="content-input"
          placeholder="分享你的心情、故事或者想说的话..."
          maxlength="500"
        />
      </view>
      
      <view class="form-group">
        <text class="label">选择性别</text>
        <view class="gender-options">
          <view
            class="gender-option"
            :class="{ active: gender === 'male' }"
            @click="handleGenderSelect('male')"
          >
            <text class="gender-icon">👦</text>
            <text class="gender-text">男生</text>
          </view>
          <view
            class="gender-option"
            :class="{ active: gender === 'female' }"
            @click="handleGenderSelect('female')"
          >
            <text class="gender-icon">👧</text>
            <text class="gender-text">女生</text>
          </view>
        </view>
      </view>
      
      <view class="form-group">
        <text class="label">选择学校</text>
        <view class="school-input">
          <input
            v-model="searchText"
            class="search-input"
            placeholder="请输入学校名称"
            @input="onSearchInput"
            @focus="showDropdown = true"
          />
          <text class="search-icon">🔍</text>
          <view v-if="showDropdown" class="school-dropdown">
            <scroll-view scroll-y class="dropdown-content">
              <view 
                v-for="(school, index) in filteredSchools" 
                :key="index"
                class="dropdown-item"
                :class="{ active: selectedSchool === school }"
                @click="selectSchool(school)"
              >
                {{ school }}
              </view>
              <view v-if="filteredSchools.length === 0" class="no-result">
                未找到相关学校
              </view>
            </scroll-view>
          </view>
        </view>
      </view>
      
      <view class="form-group">
        <text class="label">添加图片</text>
        <view class="image-list">
          <view
            v-for="(image, index) in images"
            :key="index"
            class="image-item"
          >
            <image :src="image" mode="aspectFill" />
            <view class="delete-btn" @click="deleteImage(index)">
              <text class="delete-icon">×</text>
            </view>
          </view>
          <view
            v-if="images.length < 9"
            class="upload-btn"
            @click="chooseImage"
          >
            <text class="plus">+</text>
            <text class="upload-text">添加图片</text>
          </view>
        </view>
        <text class="tip-text">最多可上传9张图片</text>
      </view>
    </view>
    
    <view class="bottom-section">
      <view class="price-info">
        <text class="price-label">发布费用</text>
        <text class="price-value">2积分</text>
      </view>
      <button class="submit-btn" :disabled="isPublishing" @click="handlePublish">
        {{ isPublishing ? '发布中...' : '发布纸条' }}
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { publishPaper } from '@/api/paper';

declare const uni: {
  chooseImage: (options: { count: number; success: (res: { tempFilePaths: string[] }) => void }) => void;
  showToast: (options: { title: string; icon?: 'none' | 'success' }) => void;
  navigateBack: () => void;
  switchTab: (options: { url: string }) => void;
};

const content = ref('');
const gender = ref('male');
const searchText = ref('');
const showDropdown = ref(false);
const selectedSchool = ref('');
const images = ref<string[]>([]);
const isPublishing = ref(false);

// 学校列表数据
const schools = [
  '浙江大学',
  '复旦大学',
  '上海交通大学',
  '南京大学',
  '武汉大学',
  '中山大学',
  '北京大学',
  '清华大学',
  '同济大学',
  '华东师范大学',
  '南开大学',
  '天津大学'
];

// 根据搜索文本过滤学校列表
const filteredSchools = computed(() => {
  if (!searchText.value) return schools;
  return schools.filter(school => 
    school.toLowerCase().includes(searchText.value.toLowerCase())
  );
});

// 处理搜索输入
const onSearchInput = () => {
  showDropdown.value = true;
};

// 选择学校
const selectSchool = (school: string) => {
  selectedSchool.value = school;
  searchText.value = school;
  showDropdown.value = false;
};

// 点击其他地方关闭下拉框
onMounted(() => {
  document.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.school-input')) {
      showDropdown.value = false;
    }
  });
});

const handleGenderSelect = (value: 'male' | 'female') => {
  gender.value = value;
};

const chooseImage = () => {
  uni.chooseImage({
    count: 9 - images.value.length,
    success: (res) => {
      images.value = [...images.value, ...res.tempFilePaths];
    }
  });
};

const deleteImage = (index: number) => {
  images.value.splice(index, 1);
};

const handlePublish = async () => {
  // 表单验证
  if (!content.value.trim()) {
    uni.showToast({
      title: '请输入纸条内容',
      icon: 'none'
    });
    return;
  }
  
  if (!selectedSchool.value) {
    uni.showToast({
      title: '请选择学校',
      icon: 'none'
    });
    return;
  }

  try {
    isPublishing.value = true;
    
    // 调用发布接口
    const result = await publishPaper({
      content: content.value,
      gender: gender.value,
      school: selectedSchool.value,
      images: images.value
    });

    // 发布成功
    uni.showToast({
      title: '发布成功',
      icon: 'success'
    });

    // 重置表单
    content.value = '';
    gender.value = 'male';
    selectedSchool.value = '';
    images.value = [];

    // 可以选择跳转到其他页面
    setTimeout(() => {
      uni.switchTab({
        url: '/pages/index/index'
      });
    }, 1500);

  } catch (error) {
    // 错误已在请求工具中统一处理
    console.error('发布失败:', error);
  } finally {
    isPublishing.value = false;
  }
};
</script>

<style lang="scss">
.container {
  min-height: 100vh;
  background: #f8f9fa;
  padding-bottom: 150px;
  
  .form-card {
    background: #fff;
    border-radius: 16px;
    margin: 20px auto;
    padding: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    max-width: 800px;
    width: calc(100% - 40px);
    
    .form-group {
      margin-bottom: 24px;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .label-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }
      
      .label {
        font-size: 16px;
        font-weight: 500;
        color: #2c3e50;
      }
      
      .word-count {
        font-size: 12px;
        color: #6c757d;
        
        &.near-limit {
          color: #ff6b6b;
        }
      }
      
      .content-input {
        width: 100%;
        height: 150px;
        padding: 12px;
        background: #f8f9fa;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        line-height: 1.6;
        color: #495057;
        
        &::placeholder {
          color: #adb5bd;
        }
      }
      
      .gender-options {
        display: flex;
        gap: 16px;
        margin-top: 12px;
        
        .gender-option {
          flex: 1;
          height: 80px;
          background: #f8f9fa;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          
          &.active {
            background: #e3f2fd;
            border: 2px solid #339af0;
            
            .gender-text {
              color: #339af0;
            }
          }
          
          .gender-icon {
            font-size: 24px;
            margin-bottom: 8px;
          }
          
          .gender-text {
            font-size: 14px;
            color: #495057;
          }
        }
      }
      
      .school-input {
        width: 100%;
        margin-top: 12px;
        position: relative;
        
        .search-input {
          width: 100%;
          height: 44px;
          padding: 0 40px 0 12px;
          background: #f8f9fa;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          color: #495057;
          
          &::placeholder {
            color: #adb5bd;
          }
        }
        
        .search-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
          color: #adb5bd;
        }
        
        .school-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          margin-top: 4px;
          z-index: 100;
          
          .dropdown-content {
            max-height: 200px;
          }
          
          .dropdown-item {
            padding: 12px;
            font-size: 14px;
            color: #495057;
            transition: all 0.2s ease;
            
            &:hover {
              background: #f8f9fa;
            }
            
            &.active {
              color: #339af0;
              background: #e3f2fd;
            }
          }
          
          .no-result {
            padding: 12px;
            font-size: 14px;
            color: #adb5bd;
            text-align: center;
          }
        }
      }
      
      .image-list {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 12px;
        
        .image-item {
          position: relative;
          width: 100px;
          height: 100px;
          
          image {
            width: 100%;
            height: 100%;
            border-radius: 8px;
          }
          
          .delete-btn {
            position: absolute;
            top: -8px;
            right: -8px;
            width: 24px;
            height: 24px;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            
            .delete-icon {
              color: #fff;
              font-size: 16px;
            }
          }
        }
        
        .upload-btn {
          width: 100px;
          height: 100px;
          background: #f8f9fa;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          
          .plus {
            font-size: 24px;
            color: #adb5bd;
            margin-bottom: 4px;
          }
          
          .upload-text {
            font-size: 12px;
            color: #adb5bd;
          }
        }
      }
      
      .tip-text {
        font-size: 12px;
        color: #adb5bd;
        margin-top: 8px;
        display: block;
      }
    }
  }
  
  .bottom-section {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 70px;
    background: #fff;
    padding: 16px 20px;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
    border-radius: 16px;
    width: calc(100% - 40px);
    max-width: 600px;
    z-index: 99;
    
    .price-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      
      .price-label {
        font-size: 14px;
        color: #495057;
      }
      
      .price-value {
        font-size: 16px;
        font-weight: bold;
        color: #ff6b6b;
      }
    }
    
    .submit-btn {
      width: 100%;
      height: 44px;
      line-height: 44px;
      background: linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%);
      color: #fff;
      border-radius: 22px;
      font-size: 16px;
      font-weight: 500;
      border: none;
      
      &:disabled {
        opacity: 0.6;
      }
      
      &:hover {
        opacity: 0.9;
      }
    }
  }
}
</style> 