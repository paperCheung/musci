<template>
  <div class="player" v-if="songList.length">
    <!-- 大屏 -->
    <transition enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown">
      <div class="normal-player" v-show="fullScreen">
        <!-- 背景 -->
        <div class="bg">
          <img :src="currentSong.albumUrl" alt />
        </div>
        <!-- 头部 -->
        <div class="top">
          <span @click="changeScreen(false)" class="iconfont">&#xe766;</span>
          <h1>{{currentSong.songname}}</h1>
          <!-- 歌手 -->
          <h2>{{currentSong.singer.map(item=>item.name).join('/')}}</h2>
        </div>
        <!-- 专辑图片 -->
        <div class="albumImg">
          <img :class="move" :src="currentSong.albumUrl" alt />
        </div>
        <!-- 歌词 -->
        <lyric :play="play" :seekTime="seekTime"></lyric>
        <!-- 进度条 -->
        <Progress :startTime="startTime" :endTime="endTime" @seekPro="seek"></Progress>
        <!-- 播放 -->
        <div class="play">
          <button @click="changeLoop">
            <i :class="'iconfont'+ ' ' +loops[loop]"></i>
          </button>
          <button @click="prev" class="iconfont">&#xe60a;</button>
          <button @click="togglePlay" class="playState">
            <i class="iconfont" :class="play?'icon-bofang':'icon-zanting'"></i>
          </button>
          <button @click="next" class="iconfont">&#xe60e;</button>
          <button
            @click="addLikeSong"
            class="iconfont"
            :class="likeState?'icon-xihuan1':'icon-xihuan2'"
          ></button>
        </div>
        <!-- 播放器 -->
        <audio
          ref="audio"
          :src="currentSong.audioUrl"
          @canplay="canplay"
          @ended="ended"
          @timeupdate="timeupdate"
        ></audio>
      </div>
    </transition>
    <!-- 小屏 -->
    <transition enter-active-class="animated fadeIn">
      <div class="mini-player" v-show="!fullScreen" @click="changeMini">
        <!-- 专辑图片 -->
        <div class="albumImg">
          <img :class="move" :src="currentSong.albumUrl" alt />
        </div>
        <div class="text">
          <h2>{{currentSong.songname}}</h2>
          <p class="singer">{{currentSong.singer.map(item=>item.name).join('/')}}</p>
        </div>
        <div class="control">
          <span @click="togglePlay" class="playState">
            <i class="iconfont" :class="play?'icon-bofang':'icon-zanting'"></i>
          </span>
          <span class="songList" @click="getSongList">
            <i class="iconfont icon-liebiao"></i>
          </span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";
import Progress from "components/Progress";
import Lyric from "components/Lyric";
import { Toast } from "mint-ui";
export default {
  components: { Progress, Lyric },
  data() {
    return {
      play: false,
      loops: ["icon-liebiaoxunhuan", "icon-suiji", "icon-danquxunhuan"],
      startTime: 0,
      endTime: 0,
      seekTime: 0,
      likeState: false
    };
  },
  computed: {
    ...mapState([
      "songList",
      "fullScreen",
      "loop",
      "currentIndex",
      "localStorageFavSongList",
      "localStorageRecentSongList"
    ]),
    ...mapGetters(["currentSong"]),
    move() {
      return this.play ? "move" : "move paused";
    }
  },
  methods: {
    ...mapMutations([
      "changeScreen",
      "nextCurrentIndex",
      "prevCurrentIndex",
      "changeLoop",
      "changeCurrentIndex",
      "addLocalStorageFavSongList",
      "removeLocalStorageFavSongList",
      "addLocalStorageRecentSongList",
      "removeLocalStorageRecentSongList"
    ]),
    addLikeSong() {
      let list = JSON.parse(localStorage.getItem("__favourite__"));
      if (list) {
        let check = 1;
        for (let index = 0; index < list.length; index++) {
          if (list[index].songid == this.currentSong.songid) {
            // 是否已经存过改歌曲
            check = 0;
            this.likeState = false;
            list.splice(index, 1); // 再次点击移除喜爱
            this.removeLocalStorageFavSongList(index);
            localStorage.setItem("__favourite__", JSON.stringify(list));
            break;
          }
        }
        if (check) {
          list.unshift(this.currentSong);
          localStorage.setItem("__favourite__", JSON.stringify(list));
          this.addLocalStorageFavSongList(this.currentSong);
          this.likeState = true;
        }
      } else {
        let list = [this.currentSong];
        localStorage.setItem("__favourite__", JSON.stringify(list));
        this.addLocalStorageFavSongList(this.currentSong);
        this.likeState = true;
      }
    },
    getSongList() {
      Toast({
        message: "该功能暂未开放",
        duration: 3000
      });
      console.log("歌曲列表");
    },
    changeMini(e) {
      if (e.target.tagName == "I") return false; // 除了点击两个i标签不切换大屏
      this.changeScreen(true);
    },
    seek(time) {
      if (!this.audio) {
        return false;
      }
      this.audio.currentTime = time; // 更改播放时间
      this.seekTime = time; // 更改歌词时间
    },
    timeupdate(e) {
      this.startTime = e.target.currentTime; // 随着播放更新时间
    },
    togglePlay() {
      if (!this.audio) {
        return false;
      }
      this.play = !this.play;
    },
    canplay() {
      // 歌曲可以播放就触发该函数
      this.audio = this.$refs.audio;
      this.play = true;
      this.audio.play(); // 准备好了，自动播放
      this.endTime = this.audio.duration; // 获取歌曲时间长度

      // 加入最近播放队列
      let recentList = JSON.parse(localStorage.getItem("__play__"));
      if (recentList) {
        for (let index = 0; index < recentList.length; index++) {
          if (recentList[index].songid == this.currentSong.songid) {
            // 是否已经存过该歌曲 存在？先删除，后加入最近播放顶部
            recentList.splice(index, 1);
            this.removeLocalStorageRecentSongList(index);
            break;
          }
        }
        recentList.unshift(this.currentSong);
        localStorage.setItem("__play__", JSON.stringify(recentList));
        this.addLocalStorageRecentSongList(this.currentSong);
      } else {
        let recentList = [this.currentSong];
        localStorage.setItem("__play__", JSON.stringify(recentList));
        this.addLocalStorageRecentSongList(this.currentSong);
      }
    },
    prev() {
      this.prevCurrentIndex();
    },
    next() {
      switch (this.loop) {
        case 0:
          // 顺序播放 相当于下一曲
          this.nextCurrentIndex();
          break;
        case 1:
          // 随机播放
          let count = this.songList.length;
          let index = parseInt(Math.random() * count);
          // 随机数是随到本首歌，就播放下一首
          if (index == this.currentIndex) {
            this.nextCurrentIndex();
          } else {
            this.changeCurrentIndex(index);
          }
          break;
        case 2:
          this.nextCurrentIndex();
          break;
        default:
          break;
      }
    },
    ended() {
      // 该函数监听播放完毕后触发
      this.play = false; // 歌曲结束后，停掉专辑转动
      this.startTime = 0; // 播放完毕后读条归0
      switch (this.loop) {
        case 0:
          // 顺序播放 相当于下一曲
          this.nextCurrentIndex();
          break;
        case 1:
          // 随机播放
          let count = this.songList.length;
          let index = parseInt(Math.random() * count);
          // 随机数是随到本首歌，就播放下一首
          if (index == this.currentIndex) {
            this.nextCurrentIndex();
          } else {
            this.changeCurrentIndex(index);
          }
          break;
        case 2:
          // 单曲循环
          this.audio.play();
          this.play = true;
          this.seekTime = 0;
          break;
        default:
          break;
      }
    }
  },
  watch: {
    play(newVal) {
      if (!this.audio) return false;
      if (newVal) {
        this.audio.play();
      } else {
        this.audio.pause();
      }
    },
    currentSong(n, o) {
      this.likeState = false;
      this.startTime = 0;
      this.play = false
      // 解决移动端不能自动播放
      setTimeout(() => {
        this.$refs.audio.play();
      },200);
      for (
        let index = 0;
        index < this.localStorageFavSongList.length;
        index++
      ) {
        if (this.localStorageFavSongList[index].songid == n.songid) {
          // 是否在喜欢歌曲列表中
          this.likeState = true;
          break;
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "~style/index.less";
.player {
  user-select: none;
  .normal-player {
    position: fixed;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    background: #222;
    z-index: 10;
    .bg {
      position: absolute;
      z-index: -10;
      top: 0px;
      width: 100%;
      height: 100%;
      filter: blur(20px);
      opacity: 0.6;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .top {
      height: 60px;
      .w(375);
      margin-bottom: 25px;
      text-align: center;
      span {
        font-weight: 900;
        font-size: @fs-xl;
        position: fixed;
        top: 10px;
        left: 20px;
        color: @yellow;
      }
      h1 {
        color: #fff;
        font-size: @fs-l;
        margin: 0 56.25px;
        height: 40px;
        line-height: 40px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      h2 {
        color: #fff;
        font-size: @fs-s;
        height: 20px;
        line-height: 20px;
        padding: 0 70px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .albumImg {
      .w(375);
      .h(300);
      text-align: center;
      img {
        .w(300);
        .h(300);
        border-radius: 50%;
        border: 10px solid hsla(0, 0%, 100%, 0.1);
      }
      & .move {
        animation: rotate 20s linear infinite;
      }
      & .paused {
        animation-play-state: paused;
      }
    }
    .play {
      .w(375);
      height: 40px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      position: absolute;
      bottom: 30px;
      button {
        width: 30px;
        height: 30px;
        text-align: center;
        line-height: 26px;
        border-radius: 50%;
        font-size: 30px;
        background: rgba(255, 255, 255, 0);
        color: @yellow;
        i {
          font-size: 30px;
        }
      }
      .icon-xihuan1 {
        font-size: 28px;
        color: #d93f30;
      }
      .playState {
        width: 40px;
        height: 40px;
        font-size: 40px;
        i {
          font-size: 40px;
        }
      }
    }
  }
  .mini-player {
    position: fixed;
    bottom: 0px;
    height: 60px;
    z-index: 11;
    .w(375);
    background: #333;
    display: flex;
    align-items: center;
    .albumImg {
      width: 70px;
      height: 40px;
      padding: 0 10px 0 20px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        vertical-align: top;
      }
      & .move {
        animation: rotate 20s linear infinite;
      }
      & .paused {
        animation-play-state: paused;
      }
    }
    .text {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      h2 {
        color: #fff;
        font-size: @fs-s;
        margin-bottom: 2px;
        height: 20px;
      }
      p {
        color: rgba(255, 255, 255, 0.3);
        font-size: @fs-xs;
        height: 20px;
      }
    }
    .control {
      width: 100px;
      padding: 5px 10px;
      display: flex;
      justify-content: space-around;
      .playState {
        display: inline-block;
        width: 30px;
        height: 30px;
        color: @yellow;
        i {
          font-size: 30px;
          float: left;
        }
      }
      .songList {
        display: inline-block;
        width: 30px;
        height: 30px;
        color: @yellow;
        i {
          font-size: 24px;
          float: left;
        }
      }
    }
  }
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>