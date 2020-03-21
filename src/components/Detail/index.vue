<template>
  <div class="detail">
    <!-- 头部 -->
    <div class="top">
      <span @click="back" class="iconfont">&#xe742;</span>
      <h3>{{detailName}}</h3>
    </div>
    <!-- 背景图 -->
    <div
      class="photo"
      :style="{'background-image':`url(${detailImgSrc?detailImgSrc:imgSrc})`}"
      ref="bgPhoto"
    >
      <div class="mask"></div>
    </div>
    <!-- 歌曲列表 -->
    <div class="wrapper" ref="wrapper">
      <ul class="content">
        <li v-for="(item, index) in list" :key="index" @click="openPlayer(index)">
          <div class="rank" v-show="show">
            <span>{{index+1}}</span>
          </div>
          <div class="desc">
            <p>{{item.songname}}</p>
            <p class="singer">{{item.singer.map(item=>item.name).join('/')}}·{{item.albumname}}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { Indicator } from "mint-ui";
import { getDetailData, getSongUrlByMid } from "api/api.js";
import Bs from "better-scroll";
import { mapMutations } from "vuex";
import { normalDetailData } from "./normal";
export default {
  props: {
    detailImgSrc: { type: String, default: "" },
    detailName: { type: String, default: "" },
    show: { type: Boolean, default: false }
  },
  data() {
    return {
      list: [],
      imgSrc: null
    };
  },
  methods: {
    ...mapMutations(["changeScreen", "addSongList", "changeCurrentIndex"]),
    openPlayer(index) {
      this.addSongList(this.list); // 显示播放器，添加播放列表
      this.changeScreen(true); // 打开大的播放页面
      this.changeCurrentIndex(index); // 确定点击的是哪首歌
    },
    back() {
      this.$router.go(-1);
    },
    initBs() {
      let wrapper = this.$refs.wrapper;
      this.Bs = new Bs(wrapper, { probeType: 3, click: true });
      let bgPhoto = this.$refs.bgPhoto;
      let bgPhotoH = bgPhoto.clientHeight;
      // 监听滑动
      this.Bs.on("scroll", ({ y }) => {
        if (y >= 0) {
          // 下拉 放大背景图片
          let precent = 1 + y / bgPhotoH;
          bgPhoto.style.transform = `scale(${precent})`;
          bgPhoto.style.zIndex = 1;
        } else {
          // 上滑 隐藏背景图片，但要保留顶部
          if (Math.abs(y) >= bgPhotoH - 40) {
            bgPhoto.style.zIndex = 1;
            bgPhoto.style.paddingTop = 0;
            bgPhoto.style.height = "40px";
          } else {
            bgPhoto.style.zIndex = -1;
            bgPhoto.style.paddingTop = "70%";
            bgPhoto.style.height = 0;
          }
        }
      });
    }
  },
  async created() {
    Indicator.open();
    let mark = this.$route.name;
    let url = "";
    let method = "";
    let id = this.$route.params[mark];
    switch (mark) {
      case "recdetail":
        url = `/gdou/music/api/getCdInfo?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&disstid=${id}&type=1&json=1&utf8=1&onlysong=0&platform=yqq&hostUin=0&needNewCode=0`;
        method = "axios";
        break;
      case "searchdetail":
      case "singerdetail":
        url = `https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&hostUin=0&needNewCode=0&platform=yqq&order=listen&begin=0&num=80&songstatus=1&singermid=${id}`;
        method = "jsonp";
        break;
      case "rankdetail":
        url = `https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&topid=${id}&needNewCode=1&uin=0&tpl=3&page=detail&type=top&platform=h5`;
        method = "jsonp";
        break;
      default:
        break;
    }
    let data = await getDetailData(url, method);
    let { result, mids } = normalDetailData(data, mark);
    if (mark == "rankdetail") {
      this.imgSrc = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${result[0].albummid}.jpg?max_age=2592000`;
    }
    let { urls } = await getSongUrlByMid(mids);
    // 可以免费播放的列表
    let freePlay = [];
    for (let index = 0; index < result.length; index++) {
      result[index].audioUrl = urls[index];
      // 能获取到地址就放进数组
      if (urls[index]) {
        freePlay.push(result[index]);
      }
    }
    this.list = freePlay;
    Indicator.close();
  },
  mounted() {
    this.initBs();
  }
};
</script>
<style lang="less">
@import "~style/index.less";
.detail {
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  background: @bg;
  .top {
    position: relative;
    z-index: 2;
    span {
      width: 42px;
      height: 42px;
      padding: 10px;
      font-size: @fs-xl;
      color: @yellow;
      position: fixed;
      top: 0px;
      left: 0;
      font-weight: 900;
    }
    h3 {
      font-size: @fs-l;
      color: white;
      text-align: center;
      height: 40px;
      line-height: 40px;
    }
  }
  .photo {
    .w(375);
    padding-top: 70%;
    background-size: cover;
    position: absolute;
    top: 0px;
    z-index: -1;
    transform-origin: top;
    .mask {
      position: absolute;
      top: 0;
      background: rgba(7, 17, 27, 0.4);
      width: 100%;
      height: 100%;
    }
  }
  .wrapper {
    position: fixed;
    .top(270);
    bottom: 0px;
    left: 0px;
    right: 0px;
    ul {
      .w(375);
      padding: 20px 30px;
      background: @bg;
      li {
        font-size: @fs-s;
        color: #fff;
        height: 64px;
        display: flex;
        overflow: hidden;
        .rank {
          width: 25px;
          margin-right: 30px;
          text-align: center;
          line-height: 64px;
          color: #ffcd32;
          font-size: @fs-l;
          span {
            display: inline-block;
            width: 25px;
          }
        }
        .desc {
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          .singer {
            color: rgba(255, 255, 255, 0.3);
            margin-top: 4px;
          }
        }
      }
    }
  }
}
</style>