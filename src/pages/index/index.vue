<template>
  <view class="container">
    <view class="header">
      <text class="title">纸条抽取</text>
      <text class="subtitle">遇见美好，分享快乐</text>
      <view class="stats">
        <view class="stat-item">
          <text class="stat-num">1.2w+</text>
          <text class="stat-label">活跃用户</text>
        </view>
        <view class="stat-item">
          <text class="stat-num">5.8w+</text>
          <text class="stat-label">纸条数量</text>
        </view>
        <view class="stat-item">
          <text class="stat-num">98%</text>
          <text class="stat-label">好评率</text>
        </view>
      </view>
    </view>
    
    <view class="action-cards">
      <view class="card publish" hover-class="card-hover" @click="switchTab('/pages/publish/publish')">
        <view class="card-icon">✏️</view>
        <view class="card-content">
          <text class="card-title">发布纸条</text>
          <text class="card-desc">写下你的故事，分享你的心情</text>
          <view class="card-tags">
            <text class="tag">2积分/条</text>
            <text class="tag">可多图</text>
          </view>
        </view>
        <view class="card-arrow">→</view>
      </view>
      
      <view class="card draw" hover-class="card-hover" @click="switchTab('/pages/draw/draw')">
        <view class="card-icon">🎲</view>
        <view class="card-content">
          <text class="card-title">抽取纸条</text>
          <text class="card-desc">发现惊喜，遇见缘分</text>
          <view class="card-tags">
            <text class="tag">1积分/条</text>
            <text class="tag">可选性别</text>
          </view>
        </view>
        <view class="card-arrow">→</view>
      </view>
    </view>

    <view class="info-section">
      <view class="info-card">
        <text class="info-title">使用说明</text>
        <view class="info-items">
          <view class="info-item">
            <view class="info-num">1</view>
            <view class="info-content">
              <text class="info-text">选择功能</text>
              <text class="info-subtext">发布或抽取纸条</text>
            </view>
          </view>
          <view class="info-item">
            <view class="info-num">2</view>
            <view class="info-content">
              <text class="info-text">填写内容</text>
              <text class="info-subtext">分享故事或设置条件</text>
            </view>
          </view>
          <view class="info-item">
            <view class="info-num">3</view>
            <view class="info-content">
              <text class="info-text">支付积分</text>
              <text class="info-subtext">完成操作获得惊喜</text>
            </view>
          </view>
        </view>
      </view>
      
      <view class="tips-card">
        <text class="tips-title">温馨提示</text>
        <view class="tips-content">
          <text class="tip">• 新用户注册即送10积分</text>
          <text class="tip">• 每日签到可得1-3积分</text>
          <text class="tip">• 请文明发言，共建和谐社区</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
declare const uni: any;

const switchTab = (url: string) => {
  uni.switchTab({ url });
};
</script>

<style lang="scss">
.container {
  min-height: 100vh;
  height: 100vh;
  background: linear-gradient(to bottom, #f8f9fa, #e9ecef);
  padding: 20px;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow-y: auto;
  
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: none;
  
  .header {
    text-align: center;
    padding: 20px 0;
    animation: fadeInDown 0.6s ease-out;
    
    .title {
      font-size: 32px;
      font-weight: bold;
      color: #2c3e50;
      display: block;
      margin-bottom: 8px;
      letter-spacing: 2px;
    }
    
    .subtitle {
      font-size: 14px;
      color: #6c757d;
      letter-spacing: 1px;
      margin-bottom: 20px;
    }

    .stats {
      display: flex;
      justify-content: center;
      gap: 32px;
      margin-top: 20px;

      .stat-item {
        text-align: center;

        .stat-num {
          font-size: 20px;
          font-weight: bold;
          color: #339af0;
          display: block;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 12px;
          color: #6c757d;
        }
      }
    }
  }
  
  .action-cards {
    margin: 24px 0;
    animation: fadeInUp 0.6s ease-out;
    
    .card {
      background: #fff;
      border-radius: 16px;
      padding: 24px;
      display: flex;
      align-items: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      margin-bottom: 16px;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 100%);
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      &.card-hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
        
        &::before {
          opacity: 1;
        }
        
        .card-arrow {
          transform: translateX(4px);
          opacity: 1;
        }
      }
      
      .card-icon {
        font-size: 32px;
        margin-right: 20px;
        transition: transform 0.3s ease;
      }
      
      .card-content {
        flex: 1;
        
        .card-title {
          font-size: 20px;
          font-weight: bold;
          color: #2c3e50;
          display: block;
          margin-bottom: 4px;
        }
        
        .card-desc {
          font-size: 14px;
          color: #6c757d;
          margin-bottom: 8px;
        }

        .card-tags {
          display: flex;
          gap: 8px;

          .tag {
            font-size: 12px;
            color: #495057;
            background: #e9ecef;
            padding: 2px 8px;
            border-radius: 4px;
          }
        }
      }
      
      .card-arrow {
        font-size: 24px;
        color: #6c757d;
        opacity: 0.5;
        transition: all 0.3s ease;
      }
      
      &.publish {
        background: linear-gradient(135deg, #fff5f5 0%, #fff 100%);
        border-left: 4px solid #ff6b6b;
        
        .card-icon {
          color: #ff6b6b;
        }
      }
      
      &.draw {
        background: linear-gradient(135deg, #f8f9ff 0%, #fff 100%);
        border-left: 4px solid #339af0;
        
        .card-icon {
          color: #339af0;
        }
      }
    }
  }
  
  .info-section {
    animation: fadeInUp 0.8s ease-out;
    
    .info-card {
      background: #fff;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      margin-bottom: 16px;
      
      .info-title {
        font-size: 18px;
        font-weight: bold;
        color: #2c3e50;
        display: block;
        margin-bottom: 20px;
        text-align: center;
      }
      
      .info-items {
        display: flex;
        justify-content: space-around;
        align-items: flex-start;
      }
      
      .info-item {
        text-align: center;
        flex: 1;
        
        .info-num {
          width: 32px;
          height: 32px;
          background: #e9ecef;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: bold;
          color: #495057;
          margin: 0 auto 12px;
        }
        
        .info-content {
          .info-text {
            font-size: 14px;
            color: #495057;
            font-weight: 500;
            display: block;
            margin-bottom: 4px;
          }
          
          .info-subtext {
            font-size: 12px;
            color: #6c757d;
          }
        }
      }
    }

    .tips-card {
      background: #fff;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      
      .tips-title {
        font-size: 18px;
        font-weight: bold;
        color: #2c3e50;
        display: block;
        margin-bottom: 16px;
        text-align: center;
      }
      
      .tips-content {
        display: flex;
        flex-direction: column;
        gap: 8px;
        
        .tip {
          font-size: 14px;
          color: #495057;
          line-height: 1.4;
        }
      }
    }
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
