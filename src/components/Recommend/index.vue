<template>
  <div class="recommend">
    <div class="wrapper" ref="wrapper">
      <div class="content">
        <Banner :banners="list"></Banner>
        <div class="title">热门歌单推荐</div>
        <ul class="list">
          <li v-for="(item,index) in recommendList" :key="index" @click="goDetail(item.dissid,item.imgurl,item.dissname)">
            <div class="left">
              <!-- <img :src="item.imgurl" alt /> -->
              <img v-lazy="item.imgurl" alt />
            </div>
            <div class="right">
              <p class="name">{{item.creator.name}}</p>
              <p class="desc">{{item.dissname}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 路由嵌套  热门歌单详情页 -->
    <transition
      enter-active-class="animated slideInRight"
      leave-active-class="animated slideOutRight"
    >
      <router-view
        :detailImgSrc="detailImgSrc"
        :detailName="detailName"
      ></router-view>
    </transition>
  </div>
</template>
<script>
import Banner from "../Banner";
import { getBannerData, getRecommendListData } from "../../api/api.js";
import BetterScroll from "better-scroll";
import { Indicator } from "mint-ui";
export default {
  components: { Banner },
  data() {
    return {
      list: [],
      recommendList: [],
      detailImgSrc: null,
      detailName: ""
    };
  },
  methods: {
    // 跳转到详情页
    goDetail(id,imgUrl,name){
      this.$router.push(`/recommend/${id}`) // 编程时导航
      this.detailImgSrc = imgUrl
      this.detailName = name
    },
    initBs() {
      let wrapper = this.$refs.wrapper;
      new BetterScroll(wrapper, {click:true});
    }
  },
  mounted() {
    Indicator.open()
    getBannerData().then(res => {
      this.list = res.data.slider;
    });
    getRecommendListData().then(res => {
      this.recommendList = res.data.list;
      Indicator.close();
    });
    this.$nextTick(() => {
      this.initBs();
    });
  }
};
</script>
<style lang="less" scoped>
@import "../../style/index.less";
.recommend {
  .wrapper {
    position: fixed;
    top: 88px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    overflow: hidden;
    .content {
      .w(375);
      .title {
        .w(375);
        height: 65px;
        text-align: center;
        line-height: 65px;
        font-size: @fs-s;
        color: @yellow;
      }
      .list {
        li {
          .w(375);
          height: 82px;
          padding: 0px 20px 20px;
          display: flex;
          .left {
            width: 82px;
            height: 60px;
            img {
              float: left;
              width: 60px;
              height: 60px;
            }
          }
          .right {
            color: white;
            font-size: @fs-s;
            .name {
              margin: 5px 0 10px 0;
            }
            .desc {
              color: rgba(255, 255, 255, 0.3);
            }
          }
        }
      }
    }
  }
}
</style>