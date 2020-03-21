<template>
  <div class="mine">
    <span @click="back" class="iconfont">&#xe742;</span>
    <div class="switches-wrapper">
      <ul>
        <li
          v-for="(item,index) in title"
          :key="index"
          @click="choose(index)"
          :class="sel==index?'sel':''"
        >{{item}}</li>
      </ul>
    </div>
    <div class="list-wrapper" ref="wrapper">
      <ul class="content">
        <li v-for="(item,index) in list" :key="index" @click="openPlayer(item,index)">
          <h2 class="name">{{item.songname}}</h2>
          <p class="desc">{{item.singer.map(ele=>ele.name).join('/')}}·{{item.albumname}}</p>
        </li>
      </ul>
    </div>
    <div class="no-result-wrapper" v-show="show">
      <div class="no-result">
        <div class="no-result-icon"></div>
        <p>{{desc[sel]}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Bs from "better-scroll";
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      title: ["我喜欢的", "最近听的"],
      desc: ["暂无收藏歌曲", "你还没有听过歌曲"],
      sel: 0,
      show: true,
      list: []
    };
  },
  methods: {
    ...mapMutations([
      "changeScreen",
      "appendSongList",
      "changeCurrentIndex",
      "addSongList"
    ]),
    openPlayer(item, index) {
      // 最近播放列表，只添加点击的歌曲
      if (this.sel) {
        this.appendSongList(item); // 显示播放器，添加播放列表
        this.changeCurrentIndex(0); // 确定点击的是哪首歌
      }
      // 喜爱列表，添加整个歌曲列表
      else {
        this.addSongList(this.list);
        this.changeCurrentIndex(index);
      }
      this.changeScreen(true); // 打开大的播放页面
    },
    // 切换数据   喜爱或者最近播放
    choose(index) {
      this.sel = index;
      if (index == 0) {
        this.list = this.localStorageFavSongList;
      } else if (index == 1) {
        this.list = this.localStorageRecentSongList;
      }
    },
    // 返回
    back() {
      this.$router.go(-1);
    },
    // 初始化 better-scroll 方法
    initBs() {
      let wrapper = this.$refs.wrapper;
      this.Bs = new Bs(wrapper, {
        click: true
      });
    }
  },
  computed: {
    ...mapState(["localStorageFavSongList", "localStorageRecentSongList"])
  },
  created() {
    this.list = JSON.parse(localStorage.getItem("__favourite__")) || [];
    if (this.list.length != 0) {
      this.show = false;
    }
  },
  // 观察喜爱音乐和最近播放数据的变化
  watch: {
    localStorageFavSongList() {
      if (this.sel == 1) return false; // 在最近播放页面上，不对list进行更改
      this.list = this.localStorageFavSongList;
    },
    localStorageRecentSongList() {
      if (this.sel == 0) return false; // 在喜爱页面上，不对list进行更改
      this.list = this.localStorageRecentSongList;
    },
    // 看列表中是否存在音乐
    list() {
      if (this.list.length == 0) {
        this.show = true;
      } else {
        this.show = false;
        if (!this.Bs) {
          this.initBs();
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "~style/index.less";
.mine {
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  background: #222;
  z-index: 10;
  .iconfont {
    font-size: @fs-xl;
    color: @yellow;
    font-weight: 900;
    position: fixed;
    left: 6px;
    top: 0px;
    display: inline-block;
    width: 42px;
    height: 42px;
    text-align: center;
    line-height: 42px;
  }
  .switches-wrapper {
    .w(375);
    height: 32px;
    margin: 10px 0 32px 0;
    ul {
      .w(240);
      margin: 0 auto;
      display: flex;
      font-size: @fs-s;
      color: rgba(255, 255, 255, 0.3);
      border: 1px solid #333;
      border-radius: 5px;
      li {
        flex: 1;
        padding: 8px;
        line-height: 1;
        text-align: center;
      }
      .sel {
        background: #333;
        color: white;
      }
    }
  }
  .list-wrapper {
    position: fixed;
    top: 74px;
    bottom: 60px;
    left: 0px;
    right: 0px;
    overflow: hidden;
    ul {
      .w(375);
      padding: 0 30px;
      li {
        width: 100%;
        height: 64px;
        font-size: @fs-s;
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        p {
          margin-top: 4px;
          color: rgba(255, 255, 255, 0.3);
        }
      }
    }
  }
  .no-result-wrapper {
    height: 100%;
    .no-result {
      .w(375);
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
    .no-result-icon {
      margin: 0 auto;
      width: 72px;
      height: 72px;
      background: url("/mine-icon.png") no-repeat;
    }
    p {
      font-size: @fs-s;
      color: rgba(255, 255, 255, 0.3);
      margin: 20px auto;
      text-align: center;
    }
  }
}
</style>
