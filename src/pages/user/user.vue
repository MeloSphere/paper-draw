<template>
  <view class="container">
    <!-- 顶部用户信息卡片 -->
    <view class="user-card">
      <view class="user-info">
        <image class="avatar" src="/static/default-avatar.png" mode="aspectFill" />
        <view class="info-content">
          <text class="nickname">昵称昵称</text>
          <view class="points-info">
            <text class="points">当前积分: 28</text>
            <view class="recharge-btn" @click="showRechargePopup">
              <text class="btn-text">充值</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 纸条内容区域 -->
    <view class="notes-section">
      <view class="tab-header">
        <view 
          class="tab-item" 
          :class="{ active: activeTab === 'publish' }"
          @click="activeTab = 'publish'"
        >
          <text class="tab-text">我的发布</text>
          <text class="tab-count">{{ publishHistory.length }}</text>
        </view>
        <view 
          class="tab-item" 
          :class="{ active: activeTab === 'draw' }"
          @click="activeTab = 'draw'"
        >
          <text class="tab-text">我的抽取</text>
          <text class="tab-count">{{ drawHistory.length }}</text>
        </view>
      </view>

      <!-- 发布列表 -->
      <scroll-view 
        scroll-y 
        class="notes-list"
        v-if="activeTab === 'publish'"
      >
        <view class="note-item" v-for="(item, index) in publishHistory" :key="index">
          <view class="note-header">
            <text class="time">{{ item.time }}</text>
            <text class="draw-count">已被抽 {{ item.drawCount }} 次</text>
          </view>
          <view class="note-content">
            <text class="text">{{ item.content }}</text>
            <scroll-view 
              scroll-x 
              class="images-scroll" 
              v-if="item.images.length > 0"
            >
              <view class="images-list">
                <image 
                  v-for="(img, imgIndex) in item.images" 
                  :key="imgIndex" 
                  :src="img" 
                  mode="aspectFill"
                  class="image"
                  @click="previewImage(item.images, imgIndex)"
                />
              </view>
            </scroll-view>
          </view>
        </view>
      </scroll-view>

      <!-- 抽取���表 -->
      <scroll-view 
        scroll-y 
        class="notes-list"
        v-if="activeTab === 'draw'"
      >
        <view class="note-item" v-for="(item, index) in drawHistory" :key="index">
          <view class="note-header">
            <text class="time">{{ item.time }}</text>
            <view class="note-tags">
              <text class="tag">{{ item.school }}</text>
              <text class="tag" :data-icon="item.gender === 'male' ? '👦' : '👧'">
                {{ item.gender === 'male' ? '男生' : '女生' }}
              </text>
            </view>
          </view>
          <view class="note-content">
            <text class="text">{{ item.content }}</text>
            <scroll-view 
              scroll-x 
              class="images-scroll" 
              v-if="item.images.length > 0"
            >
              <view class="images-list">
                <image 
                  v-for="(img, imgIndex) in item.images" 
                  :key="imgIndex" 
                  :src="img" 
                  mode="aspectFill"
                  class="image"
                  @click="previewImage(item.images, imgIndex)"
                />
              </view>
            </scroll-view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 充值弹窗 -->
    <view class="popup-mask" v-if="showPopup" @click="showPopup = false">
      <view class="popup-content" @click.stop>
        <view class="popup-header">
          <text class="popup-title">充值积分</text>
          <text class="close-btn" @click="showPopup = false">×</text>
        </view>
        <view class="packages-grid">
          <view 
            class="package-item" 
            :class="{ active: selectedPackage === index }"
            v-for="(pkg, index) in packages" 
            :key="index"
            @click="selectPackage(index)"
          >
            <text class="points">{{ pkg.points }}积分</text>
            <text class="price">¥{{ pkg.price }}</text>
            <text class="bonus" v-if="pkg.bonus">送{{ pkg.bonus }}积分</text>
          </view>
        </view>
        <button class="confirm-btn" @click="handleRecharge">确认充值</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeTab = ref('publish');
const selectedPackage = ref(-1);
const showPopup = ref(false);

// 充值套餐数据
const packages = [
  { price: 10, points: 10, bonus: 2 },
  { price: 30, points: 30, bonus: 8 },
  { price: 50, points: 50, bonus: 15 },
  { price: 100, points: 100, bonus: 35 },
  { price: 200, points: 200, bonus: 80 }
];

// 模拟的发布历史数据
const publishHistory = [
  {
    content: '今天天气真好，心情也很好！希望能遇到有趣的人。',
    images: ['/static/demo/img1.jpg'],
    time: '2024-01-20 14:30',
    drawCount: 5
  },
  {
    content: '期末考试终于结束了，好想认识新朋友一起去放松一下~',
    images: [],
    time: '2024-01-19 18:20',
    drawCount: 3
  }
];

// 模拟的抽取历史数据
const drawHistory = [
  {
    content: '有人一起去图书馆学习吗？我在新图三楼。',
    images: ['/static/demo/img2.jpg'],
    time: '2024-01-20 10:00',
    school: '浙江大学',
    gender: 'female'
  },
  {
    content: '周末有人要一起去看电影吗？',
    images: [],
    time: '2024-01-18 20:15',
    school: '复旦大学',
    gender: 'male'
  }
];

const showRechargePopup = () => {
  showPopup.value = true;
};

const selectPackage = (index: number) => {
  selectedPackage.value = index;
};

const handleRecharge = () => {
  if (selectedPackage.value === -1) {
    uni.showToast({
      title: '请选择充值套餐',
      icon: 'none'
    });
    return;
  }
  
  const pkg = packages[selectedPackage.value];
  uni.showModal({
    title: '确认充值',
    content: `确定充值${pkg.price}元购买${pkg.points}积分${pkg.bonus ? '（额外赠送' + pkg.bonus + '积分）' : ''}吗？`,
    success: (res) => {
      if (res.confirm) {
        // TODO: 调用支付接口
        uni.showToast({
          title: '充值成功',
          icon: 'success'
        });
        showPopup.value = false;
      }
    }
  });
};

const previewImage = (images: string[], current: number) => {
  uni.previewImage({
    urls: images,
    current: images[current]
  });
};
</script>

<style lang="scss">
.container {
  min-height: 100vh;
  background: #f8f9fa;
  
  .user-card {
    background: linear-gradient(135deg, #339af0 0%, #4dabf7 100%);
    padding: 24px 20px;
    
    .user-info {
      display: flex;
      align-items: center;
      
      .avatar {
        width: 64px;
        height: 64px;
        border-radius: 32px;
        border: 2px solid rgba(255, 255, 255, 0.8);
      }
      
      .info-content {
        flex: 1;
        margin-left: 16px;
        
        .nickname {
          font-size: 20px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 8px;
        }
        
        .points-info {
          display: flex;
          align-items: center;
          gap: 12px;
          
          .points {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.9);
          }
          
          .recharge-btn {
            background: rgba(255, 255, 255, 0.2);
            padding: 4px 12px;
            border-radius: 12px;
            
            .btn-text {
              font-size: 12px;
              color: #fff;
            }
          }
        }
      }
    }
  }
  
  .notes-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #f0f2f5;
    
    .tab-header {
      display: flex;
      background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
      padding: 16px 20px;
      border-bottom: 1px solid #e9ecef;
      position: sticky;
      top: 0;
      z-index: 1;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      
      .tab-item {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        height: 44px;
        position: relative;
        transition: all 0.3s ease;
        cursor: pointer;
        
        &::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          width: 1px;
          height: 24px;
          background: #e9ecef;
          transform: translateY(-50%);
        }
        
        &:first-child::before {
          display: none;
        }
        
        .tab-text {
          font-size: 16px;
          color: #495057;
          transition: all 0.3s ease;
          position: relative;
          
          &::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            width: 0;
            height: 2px;
            background: #339af0;
            transition: all 0.3s ease;
          }
        }
        
        .tab-count {
          font-size: 14px;
          color: #868e96;
          background: #f1f3f5;
          padding: 2px 10px;
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        
        &.active {
          .tab-text {
            color: #339af0;
            font-weight: 600;
            
            &::after {
              width: 100%;
            }
          }
          
          .tab-count {
            color: #fff;
            background: #339af0;
            transform: translateY(-2px);
          }
        }
      }
    }
    
    .notes-list {
      flex: 1;
      padding: 16px;
      
      .note-item {
        background: #fff;
        border-radius: 16px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 4px 12px rgba(51, 154, 240, 0.08);
        position: relative;
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid rgba(51, 154, 240, 0.1);
        backdrop-filter: blur(8px);
        
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #339af0, #74c0fc);
          opacity: 0.8;
        }
        
        &::after {
          content: '';
          position: absolute;
          top: 4px;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%);
          pointer-events: none;
        }
        
        &:hover {
          transform: translateY(-4px) scale(1.01);
          box-shadow: 0 8px 24px rgba(51, 154, 240, 0.12);
          border-color: rgba(51, 154, 240, 0.2);
          
          .note-header {
            .time, .draw-count, .tag {
              transform: translateY(-1px);
            }
          }
          
          .note-content {
            .text {
              color: #1c7ed6;
            }
            
            .image {
              transform: scale(1.05);
              border-color: #74c0fc;
            }
          }
        }
        
        .note-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px dashed rgba(51, 154, 240, 0.15);
          
          .time {
            font-size: 13px;
            color: #868e96;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.3s ease;
            
            &::before {
              content: '🕒';
              font-size: 15px;
            }
          }
          
          .draw-count {
            font-size: 13px;
            color: #339af0;
            background: rgba(51, 154, 240, 0.08);
            padding: 6px 16px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.3s ease;
            font-weight: 500;
            
            &::before {
              content: '👀';
              font-size: 15px;
            }
          }
          
          .note-tags {
            display: flex;
            gap: 10px;
            
            .tag {
              font-size: 13px;
              color: #495057;
              background: rgba(51, 154, 240, 0.05);
              padding: 6px 16px;
              border-radius: 20px;
              display: flex;
              align-items: center;
              gap: 6px;
              transition: all 0.3s ease;
              font-weight: 500;
              border: 1px solid rgba(51, 154, 240, 0.1);
              
              &:first-child::before {
                content: '🏫';
                font-size: 15px;
              }
              
              &:last-child::before {
                content: attr(data-icon);
                font-size: 15px;
              }
            }
          }
        }
        
        .note-content {
          .text {
            font-size: 15px;
            color: #495057;
            line-height: 1.8;
            margin-bottom: 16px;
            white-space: pre-wrap;
            transition: all 0.3s ease;
            padding: 0 2px;
          }
          
          .images-scroll {
            width: calc(100% + 8px);
            margin: 0 -4px;
            
            .images-list {
              display: flex;
              gap: 12px;
              padding: 4px;
              
              .image {
                width: 90px;
                height: 90px;
                border-radius: 12px;
                flex-shrink: 0;
                object-fit: cover;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                transition: all 0.3s ease;
                border: 2px solid transparent;
              }
            }
          }
        }
      }
    }
  }
  
  .popup-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    
    .popup-content {
      width: 90%;
      max-width: 320px;
      background: #fff;
      border-radius: 16px;
      padding: 20px;
      
      .popup-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        
        .popup-title {
          font-size: 18px;
          font-weight: 600;
          color: #2c3e50;
        }
        
        .close-btn {
          font-size: 24px;
          color: #adb5bd;
          padding: 4px;
        }
      }
      
      .packages-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        margin-bottom: 20px;
        
        .package-item {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 12px;
          padding: 16px;
          text-align: center;
          transition: all 0.3s ease;
          
          &.active {
            background: #fff5f5;
            border-color: #ff6b6b;
            transform: translateY(-2px);
            
            .points {
              color: #ff6b6b;
            }
          }
          
          .points {
            font-size: 16px;
            font-weight: 500;
            color: #495057;
            display: block;
            margin-bottom: 4px;
          }
          
          .price {
            font-size: 14px;
            color: #868e96;
            display: block;
            margin-bottom: 4px;
          }
          
          .bonus {
            font-size: 12px;
            color: #ff6b6b;
            background: #fff5f5;
            padding: 2px 8px;
            border-radius: 10px;
          }
        }
      }
      
      .confirm-btn {
        width: 100%;
        height: 44px;
        line-height: 44px;
        background: linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%);
        color: #fff;
        border-radius: 22px;
        font-size: 16px;
        font-weight: 500;
        border: none;
        
        &:active {
          opacity: 0.9;
        }
      }
    }
  }

  @keyframes slideIn {
    from {
      transform: translateX(-50%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
}
</style> 