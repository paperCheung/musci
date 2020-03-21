<template>
  <div class="singers">
    <!-- 歌手列表 -->
    <div class="wrapper" ref="singerWrapper">
      <div class="content">
        <ul>
          <li v-for="(item,index) in singers" :key="index" :ref="item.Findex">
            <h3>{{item.Findex=='热'?"热门":`${item.Findex}`}}</h3>
            <ol>
              <!-- better-scroll 默认会阻止touch事件。所以在配置中需要加上click: true -->
              <li
                v-for="(item,index) in item.list"
                :key="index"
                @click="goDetail(item.Fsinger_mid,item.avatar,item.Fsinger_name)"
              >
                <img v-lazy="item.avatar" alt />
                <span>{{item.Fsinger_name}}</span>
              </li>
            </ol>
          </li>
        </ul>
      </div>
    </div>
    <!-- 快速入口列表 -->
    <div class="quicklist" ref='quicklist'>
      <ul @touchstart="touchStart" @touchmove="touchMove">
        <li
          v-for="(item,index) in quickData"
          :key="index"
          :class="selFindex==item?'sel':''"
          @click="quickJump(item)"
        >{{item}}</li>
      </ul>
    </div>
    <!-- 路由嵌套  歌手详情页 -->
    <transition
      enter-active-class="animated slideInRight"
      leave-active-class="animated slideOutRight"
    >
      <router-view :detailImgSrc="detailImgSrc" :detailName="detailName"></router-view>
    </transition>
  </div>
</template>
<script>
import Bs from "better-scroll";
import { getSingersData } from "api/api.js";
import { normalData } from "./normal.js";
import { Indicator } from "mint-ui";
export default {
  data() {
    return {
      singers: [],
      selFindex: "热",
      detailImgSrc: null,
      detailName: ""
    };
  },
  methods: {
    goDetail(id, imgUrl, name) {
      this.$router.push(`/singer/${id}`);
      this.detailImgSrc = imgUrl;
      this.detailName = name;
    },
    touchStart(e) {
      let y = e.touches[0].pageY;
      this.touch.y = y;
    },
    touchMove(e) {
      let quicklistTop = this.$refs.quicklist.getBoundingClientRect().top
      let startPos = Math.floor((this.touch.y - quicklistTop) / 18); // 修BUG
      let moveY = e.touches[0].pageY;
      let moveDis = moveY - this.touch.y; // 计算出移动过的距离
      let count = parseInt(moveDis / 18); // 计算出移动过的格子数
      let moveIndex = startPos + count - 1; // 修BUG
      if (count < -startPos + 1 || count > this.quickData.length - startPos) {
        return false;
      } // 修BUG
      let moveFindex = this.quickData[moveIndex];
      this.quickJump(moveFindex);
    },
    quickJump(item) {
      // 点击每一项后，拿到该标签的名字：如 A B  根据字母获取到固定的元素
      let dom = this.$refs[item][0];
      // 用Bs 内部的方法直接跳转到固定元素
      this.Bs.scrollToElement(dom);
    },
    initBs() {
      let wrapper = this.$refs.singerWrapper;
      this.Bs = new Bs(wrapper, { probeType: 3, click: true });
      let distance = [];
      for (const key in this.$refs) {
        if (key != "singerWrapper" && key != 'quicklist') {
          distance.push(this.$refs[key][0].offsetTop);
        }
      }
      this.Bs.on("scroll", pos => {
        let Y = Math.abs(pos.y);
        // 判断每一次滚动的距离在什么范围内
        let scrollIndex = 0; // 初始值为在第0区
        for (let index = 0; index < distance.length; index++) {
          if (Y >= distance[index] && Y < distance[index + 1]) {
            scrollIndex = index;
          } else if (Y >= distance[distance.length - 1]) {
            // 最后的边界
            scrollIndex = distance.length - 1;
          }
        }
        // 根据下标，进行换字母
        this.selFindex = this.quickData[scrollIndex];
      });
    }
  },
  computed: {
    // 快速入口数据和歌手数据做关联
    quickData() {
      return this.singers.map(item => {
        return item.Findex;
      });
    }
  },
  created() {
    // 初始化数据 把移动距离挂载到this 对象下
    this.touch = { y: 0 };
    Indicator.open();
    getSingersData().then(res => {
      // console.log(res.data.list)
      // 对数据作二次处理
      let data = normalData(res.data.list);
      this.singers = data;
      Indicator.close();
      // 请求到数据 并更新页面后才初始化better-scroll
      this.$nextTick(() => {
        this.initBs();
      });
    });
  }
};
</script>
<style lang="less" scoped>
@import "../../style/index.less";
.singers {
  position: fixed;
  top: 88px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  .quicklist {
    position: fixed;
    top: 50%;
    right: 0px;
    transform:translateY(-50%);
    padding: 20px 0;
    font-size: @fs-xs;
    color: @fs-color5;
    border-radius: 10px;
    text-align: center;
    background: rgba(0, 0, 0, 0.3);
    width: 20px;
    li {
      height: 18px;
    }
    .sel {
      color: @yellow;
    }
  }
  .wrapper {
    height: 100%;
    overflow: hidden;
    .content {
      li {
        .w(375);
        padding-bottom: 30px;
        h3 {
          .w(375);
          height: 30px;
          padding-left: 20px;
          color: @fs-color5;
          font-size: @fs-xs;
          background: #333;
          line-height: 30px;
        }
        ol {
          li {
            .w(375);
            height: 70px;
            padding: 20px 0 0 30px;
            display: flex;
            align-items: center;
            img {
              width: 50px;
              height: 50px;
              border-radius: 50%;
            }
            span {
              margin-left: 20px;
              font-size: @fs-s;
              color: @fs-color5;
            }
          }
        }
      }
    }
  }
}
</style>