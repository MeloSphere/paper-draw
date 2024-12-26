<template>
  <view class="container">
    <view class="form-card">
      <view class="form-group">
        <text class="label">选择抽取性别</text>
        <view class="gender-options">
          <view
            class="gender-option"
            :class="{ active: gender === 'male' }"
            @click="handleGenderSelect('male')"
          >
            <text class="gender-icon">👦</text>
            <text class="gender-text">男生纸条</text>
          </view>
          <view
            class="gender-option"
            :class="{ active: gender === 'female' }"
            @click="handleGenderSelect('female')"
          >
            <text class="gender-icon">👧</text>
            <text class="gender-text">女生纸条</text>
          </view>
          <view
            class="gender-option"
            :class="{ active: gender === 'all' }"
            @click="handleGenderSelect('all')"
          >
            <text class="gender-icon">🎲</text>
            <text class="gender-text">随机抽取</text>
          </view>
        </view>
      </view>

      <view class="form-group">
        <text class="label">选择抽取数量</text>
        <view class="count-selector">
          <view class="count-display">
            <text class="count-value">{{ count }}</text>
            <text class="count-unit">张</text>
          </view>
          <view class="count-controls">
            <view class="count-btn minus" @click="decreaseCount">-</view>
            <view class="count-btn plus" @click="increaseCount">+</view>
          </view>
        </view>
        <text class="price-info">费用：{{ count * 2 }}积分</text>
      </view>
    </view>

    <!-- 引导内容 -->
    <view class="guide-section">
      <text class="guide-title">抽取指南</text>
      <view class="guide-cards">
        <view class="guide-card">
          <text class="card-title">🎯 如何选择</text>
          <text class="card-content">可以选择指定性别的纸条，或随机抽取任意性别的纸条。每次最多可抽取10张纸条。</text>
        </view>
        <view class="guide-card">
          <text class="card-title">💫 抽取规则</text>
          <text class="card-content">每张纸条消耗2积分，抽取到的纸条将保存在个人中心，可随时查看。</text>
        </view>
        <view class="guide-card">
          <text class="card-title">🌟 温馨提示</text>
          <text class="card-content">纸条内容均由同学们发布，请注意保护个人隐私，文明交友。</text>
        </view>
      </view>
      
      <view class="stats">
        <view class="stat-item">
          <text class="stat-value">{{ stats.todayDrawCount }}</text>
          <text class="stat-label">今日抽取</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ stats.totalPapers }}</text>
          <text class="stat-label">纸条总数</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ stats.satisfactionRate }}%</text>
          <text class="stat-label">好评率</text>
        </view>
      </view>
    </view>

    <!-- 抽取结果弹窗 -->
    <view class="result-popup" v-if="showResults" @click.stop="closeResults">
      <view class="popup-content" @click.stop>
        <view class="popup-header">
          <view class="title-left">抽取结果</view>
          <text class="result-count">共 {{ drawnPapers.length }} 条</text>
          <text class="close-btn" @click="closeResults">×</text>
        </view>
        <swiper
          class="note-swiper"
          :indicator-dots="true"
          :duration="300"
          :current="currentCard"
          :circular="true"
          :indicator-color="'rgba(0, 0, 0, .3)'"
          :indicator-active-color="'#339af0'"
          @change="handleSwiperChange"
        >
          <swiper-item
            v-for="(paper, index) in drawnPapers"
            :key="index"
            class="swiper-item"
          >
            <view class="note-card">
              <view class="note-header">
                <text class="school">{{ paper.school }}</text>
                <text class="gender-tag" :class="paper.gender">
                  {{ paper.gender === 'male' ? '男生' : '女生' }}
                </text>
              </view>
              <view class="note-content">{{ paper.content }}</view>
              <view 
                class="note-images" 
                :class="{ 'has-more': paper.images && paper.images.length > 3 }"
                v-if="paper.images && paper.images.length"
              >
                <image
                  v-for="(img, imgIndex) in paper.images.slice(0, 3)"
                  :key="imgIndex" 
                  :src="img" 
                  mode="aspectFill"
                  @click="previewImage(paper.images, imgIndex)"
                />
              </view>
            </view>
          </swiper-item>
        </swiper>
      </view>
    </view>

    <view class="bottom-section">
      <view class="price-info">
        <text class="price-label">抽取费用</text>
        <text class="price-value">{{ count * 2 }}积分</text>
      </view>
      <button class="draw-btn" :disabled="isDrawing" @click="handleDraw">
        {{ isDrawing ? '抽取中...' : '开始抽取' }}
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue';
import { drawPapers, getStats } from '../../api/paper';

type Gender = 'all' | 'male' | 'female';

interface Paper {
  id: string;
  content: string;
  gender: Gender;
  school: string;
  images: string[];
  createdAt: string;
  userId: string;
}

interface Stats {
  todayDrawCount: number;
  totalPapers: number;
  satisfactionRate: number;
}

const gender = ref<Gender>('all');
const count = ref(1);
const drawnPapers = ref<Paper[]>([]);
const currentCard = ref(0);
const isDrawing = ref(false);
const showResults = ref(false);
const stats = ref<Stats>({
  todayDrawCount: 0,
  totalPapers: 0,
  satisfactionRate: 0
});

const handleGenderSelect = (selectedGender: Gender) => {
  gender.value = selectedGender;
};

const increaseCount = () => {
  if (count.value < 10) {
    count.value++;
  }
};

const decreaseCount = () => {
  if (count.value > 1) {
    count.value--;
  }
};

const handleDraw = async () => {
  isDrawing.value = true;
  try {
    const result = await drawPapers({
      gender: gender.value,
      count: count.value
    });
    drawnPapers.value = result;
    currentCard.value = 0;
    showResults.value = true;
  } catch (error) {
    console.error('抽取失败:', error);
  } finally {
    isDrawing.value = false;
  }
};

const closeResults = () => {
  showResults.value = false;
};

const handleSwiperChange = (e: { detail: { current: number } }) => {
  currentCard.value = e.detail.current;
};

const previewImage = (images: string[], index: number) => {
  uni.previewImage({
    urls: images,
    current: images[index]
  });
};

const fetchStats = async () => {
  try {
    const result = await getStats();
    stats.value = result;
  } catch (error) {
    console.error('获取统计数据失败:', error);
  }
};

// 在组件挂载时获取统计数据
fetchStats();
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
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 95%;
      height: 10px;
      background: #fff;
      border-radius: 0 0 16px 16px;
      opacity: 0.5;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    }

    .form-group {
      margin-bottom: 24px;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .label {
        font-size: 16px;
        font-weight: 500;
        color: #2c3e50;
        margin-bottom: 16px;
        display: block;
      }

      .gender-options {
        display: flex;
        gap: 12px;
        
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

      .count-selector {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f8f9fa;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 12px;
        
        .count-display {
          display: flex;
          align-items: baseline;

          .count-value {
            font-size: 32px;
            font-weight: bold;
            color: #2c3e50;
          }
          
          .count-unit {
            font-size: 14px;
            color: #6c757d;
            margin-left: 4px;
          }
        }

        .count-controls {
          display: flex;
          gap: 12px;
          
          .count-btn {
            width: 36px;
            height: 36px;
            border-radius: 18px;
            background: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            color: #495057;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            transition: all 0.2s ease;
            
            &:active {
              transform: scale(0.95);
            }
            
            &.minus {
              color: #ff6b6b;
            }
            
            &.plus {
              color: #339af0;
            }
          }
        }
      }

      .price-info {
        font-size: 14px;
        color: #ff6b6b;
        text-align: right;
      }
    }
  }

  .result-popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
    
    .popup-content {
      background: #fff;
      border-radius: 16px;
      padding: 20px;
      max-width: 800px;
      width: calc(100% - 40px);
      height: 80vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      animation: slideUp 0.3s ease-out;
      
      .popup-header {
        flex-shrink: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        
        .title-left {
          font-size: 18px;
          font-weight: bold;
          color: #2c3e50;
          display: flex;
          align-items: center;
          gap: 8px;
          
          &::before {
            content: '🎉';
            font-size: 20px;
          }
        }

        .result-count {
          font-size: 14px;
          color: #868e96;
          background: rgba(51, 154, 240, 0.05);
          padding: 4px 12px;
          border-radius: 20px;
          margin-right: auto;
          margin-left: 12px;
        }

        .close-btn {
          font-size: 24px;
          color: #868e96;
          cursor: pointer;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          transition: all 0.2s ease;
          
          &:hover {
            background: rgba(0, 0, 0, 0.05);
            color: #495057;
          }
        }
      }
      
      .note-swiper {
        flex: 1;
        height: calc(100% - 70px);
        
        .swiper-item {
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          
          .note-card {
            width: 100%;
            max-width: 400px;
            background: #fff;
            border-radius: 16px;
            padding: 16px;
            box-shadow: 0 4px 20px rgba(51, 154, 240, 0.1);
            position: relative;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid rgba(51, 154, 240, 0.1);
            display: flex;
            flex-direction: column;
            gap: 12px;
            
            &::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 4px;
              background: linear-gradient(90deg, #339af0, #74c0fc);
              opacity: 0.8;
              border-radius: 16px 16px 0 0;
            }

            .note-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding-bottom: 12px;
              border-bottom: 1px dashed rgba(51, 154, 240, 0.15);
              
              .school {
                font-size: 14px;
                color: #495057;
                background: rgba(51, 154, 240, 0.08);
                padding: 6px 12px;
                border-radius: 16px;
                display: flex;
                align-items: center;
                gap: 4px;
                font-weight: 500;
                border: 1px solid rgba(51, 154, 240, 0.15);
                
                &::before {
                  content: '🏫';
                  font-size: 14px;
                }
              }

              .gender-tag {
                font-size: 14px;
                padding: 6px 12px;
                border-radius: 16px;
                display: flex;
                align-items: center;
                gap: 4px;
                font-weight: 500;
                
                &.male {
                  background: rgba(51, 154, 240, 0.08);
                  color: #339af0;
                  border: 1px solid rgba(51, 154, 240, 0.2);
                  
                  &::before {
                    content: '👦';
                  }
                }
                
                &.female {
                  background: rgba(255, 107, 107, 0.08);
                  color: #ff6b6b;
                  border: 1px solid rgba(255, 107, 107, 0.2);
                  
                  &::before {
                    content: '👧';
                  }
                }
              }
            }

            .note-content {
              font-size: 15px;
              color: #495057;
              line-height: 1.6;
              padding: 0 12px;
              position: relative;
              
              &::before {
                content: '"';
                position: absolute;
                left: -4px;
                top: -8px;
                font-size: 28px;
                color: #339af0;
                opacity: 0.2;
                font-family: serif;
              }
            }

            .note-images {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 8px;
              padding-top: 12px;
              border-top: 1px dashed rgba(51, 154, 240, 0.15);
              
              image {
                width: 100%;
                aspect-ratio: 1;
                border-radius: 8px;
                object-fit: cover;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                transition: all 0.3s ease;
                border: 1px solid rgba(51, 154, 240, 0.1);
                
                &:hover {
                  transform: scale(1.05);
                  border-color: #74c0fc;
                  box-shadow: 0 4px 12px rgba(51, 154, 240, 0.15);
                }
              }
              
              &.has-more {
                position: relative;
                
                &::after {
                  content: '+更多';
                  position: absolute;
                  right: 8px;
                  bottom: 8px;
                  font-size: 12px;
                  color: #fff;
                  background: rgba(0, 0, 0, 0.6);
                  padding: 4px 10px;
                  border-radius: 8px;
                  backdrop-filter: blur(4px);
                }
              }
            }
          }
        }
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

    .draw-btn {
      width: 100%;
      height: 44px;
      line-height: 44px;
      background: linear-gradient(135deg, #339af0 0%, #4dabf7 100%);
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

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.guide-section {
  max-width: 800px;
  width: calc(100% - 40px);
  margin: 32px auto;
  text-align: center;
  
  .guide-title {
    font-size: 18px;
    color: #2c3e50;
    margin-bottom: 16px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    
    &::before {
      content: '💡';
    }
  }
  
  .guide-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
    margin-top: 24px;
    
    .guide-card {
      background: #fff;
      border-radius: 12px;
      padding: 16px;
      text-align: left;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(51, 154, 240, 0.1);

      .card-title {
        font-size: 15px;
        color: #339af0;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 6px;
        font-weight: 500;
      }
      
      .card-content {
        font-size: 13px;
        color: #6c757d;
        line-height: 1.6;
      }
    }
  }

  .stats {
    display: flex;
    justify-content: center;
    gap: 32px;
    margin-top: 24px;

    .stat-item {
      text-align: center;
      
      .stat-value {
        font-size: 24px;
        font-weight: bold;
        color: #339af0;
        margin-bottom: 4px;
      }

      .stat-label {
        font-size: 13px;
        color: #868e96;
      }
    }
  }
}
</style> 