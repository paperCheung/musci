<template>
  <div class="banner">
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(item,index) in banners" :key="index">
          <img :src="item.picUrl" alt />
        </div>
      </div>
      <!-- 如果需要分页器 -->
      <div class="swiper-pagination"></div>
    </div>
  </div>
</template>
<script>
import Swiper from "swiper";
export default {
  props: {
    banners: { type: Array, default: [] }
  },
  methods: {
    initBanner() {
      new Swiper(".swiper-container", {
        loop: true, // 循环模式选项
        autoplay: true, // 自动循环
        // 如果需要分页器
        pagination: {
          el: ".swiper-pagination"
        }
      });
    }
  },
  watch: {
    banners() {
      this.$nextTick(() => {
        this.initBanner();
      });
    }
  }
};
</script>
<style lang="less">
@import "../../style/index.less";
@import "~swiper/css/swiper.min.css";
.swiper-container {
  .w(375);
  .h(150);
  img {
    width: 100%;
    height: 100%;
  }
  .swiper-pagination {
    .swiper-pagination-bullet {
      background: rgba(255, 255, 255, 0.5);
    }
    .swiper-pagination-bullet-active {
      width: 20px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.8);
    }
  }
}
</style>