<template>
  <div class="search">
    <!-- 搜索框 -->
    <div class="search-box-wrapper">
      <div class="search-box">
        <span class="iconfont icon-chaxun"></span>
        <input type="text" placeholder="搜索歌曲、歌手" v-model="word" />
        <span class="iconfont" @click="removeInputVal" v-show="this.word!=''?true:false">&#xe62f;</span>
      </div>
    </div>
    <div class="wrapper" ref="wrapper">
      <div class="content">
        <!-- 热门搜索以及搜索历史 -->
        <div class="shortcut-wrapper" v-if="keyword">
          <div class="hot-key">
            <h3>热门搜索</h3>
            <ul>
              <li
                class="item"
                v-for="(item,index) in list"
                :key="index"
                @click="goSearch(item.k)"
              >{{item.k}}</li>
            </ul>
          </div>
          <div class="search-history" v-if="this.searchList.length">
            <h1>
              <span>搜索历史</span>
              <span class="iconfont" @click="delAllHistory">&#xe73d;</span>
            </h1>
            <div class="search-history-list">
              <ul>
                <li v-for="(item,index) in searchList" :key="index">
                  <span class="text" @click="goSearch(item)">{{item}}</span>
                  <span class="iconfont del" @click="delHistory(index)">&#xe658;</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- 搜索结果列表 -->
        <div class="search-result" v-else>
          <ul>
            <li v-if="isSinger" @click="jumpToSinger">
              <i class="iconfont">&#xe638;</i>
              {{word}}
            </li>
            <li v-for="(item,index) in keywordList" :key="index" @click.self="openPlayer(item)">
              <i class="iconfont">&#xe687;</i>
              {{item.songname}}-{{item.singer.map(ele=>{return ele.name}).join('/')}}
            </li>
          </ul>
        </div>
      </div>
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
import { Indicator, MessageBox } from "mint-ui";
import { getHotKeyData, getSearchListData, getSongUrlByMid } from "api/api.js";
import { normalSearchListData } from "./normalSearchListData";
import { mapMutations, mapState } from "vuex";
export default {
  data() {
    return {
      list: [],
      keywordList: [],
      word: "",
      keyword: true,
      page: 2,
      isSinger: false,
      singerID: null,
      detailName: null,
      detailImgSrc: null,
      searchList: []
    };
  },
  computed: {
    ...mapState(["localStorageSearchList"])
  },
  methods: {
    ...mapMutations([
      "changeScreen",
      "appendSongList",
      "changeCurrentIndex",
      "addLocalStorageSearchList",
      "removeLocalStorageSearchSongList",
      "clearAllSearchHistory"
    ]),
    // 清空搜索历史
    delAllHistory() {
      MessageBox.confirm("是否清空所有搜索历史?").then(action => {
        localStorage.removeItem("__search__");
        this.clearAllSearchHistory();
        this.searchList = [];
      });
    },
    // 删除单条搜索历史
    delHistory(index) {
      this.removeLocalStorageSearchSongList(index);
      let searchList = JSON.parse(localStorage.getItem("__search__"));
      searchList.splice(index, 1);
      localStorage.setItem("__search__", JSON.stringify(searchList));
    },
    // 跳转到歌手页
    jumpToSinger() {
      this.$router.push(`/search/${this.singerID}`);
      this.detailName = this.word;
      this.detailImgSrc = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${this.singerID}.jpg?max_age=2592000`;
      this.addSearchList();
    },
    removeInputVal() {
      this.word = "";
    },
    goSearch(val) {
      this.word = val;
    },
    async getSongList(val, page = 1) {
      Indicator.open();
      let data = await getSearchListData(val, page);
      // 搜索内容是否是歌手
      if (data.data.zhida.type == 2) {
        this.isSinger = true;
        this.singerID = data.data.zhida.singermid;
      } else {
        this.isSinger = false;
      }
      let { result, mids } = normalSearchListData(data.data.song.list);
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
      // 第一页赋值， 第二页就合并
      if (page == 1) {
        this.keywordList = freePlay;
      } else {
        this.keywordList = this.keywordList.concat(freePlay);
      }
      Indicator.close();
    },
    initBs() {
      let wrapper = this.$refs.wrapper;
      this.Bs = new Bs(wrapper, {
        click: true,
        // 开启上拉加载
        pullUpLoad: {
          threshold: 50
        }
      });
      this.Bs.on("pullingUp", () => {
        if (this.word) {
          this.getSongList(this.word, this.page);
          this.page++;
          // 上一次上拉加载已经结束可以开启下一次
          this.Bs.finishPullUp();
        } else {
          this.Bs.finishPullUp();
        }
      });
    },
    openPlayer(item) {
      this.appendSongList(item); // 显示播放器，添加播放列表
      this.changeScreen(true); // 打开大的播放页面
      this.changeCurrentIndex(0); // 确定点击的是哪首歌
      this.addSearchList();
    },
    // 添加搜索历史
    addSearchList() {
      let searchList = JSON.parse(localStorage.getItem("__search__"));
      if (searchList) {
        let checkIndex = searchList.indexOf(this.word.trim());
        if (checkIndex != -1) {
          searchList.splice(checkIndex, 1); // 已存在，先删除，再添加到头部
          this.removeLocalStorageSearchSongList(checkIndex);
        }
        searchList.unshift(this.word.trim());
        localStorage.setItem("__search__", JSON.stringify(searchList));
        this.addLocalStorageSearchList(this.word.trim());
      } else {
        let searchList = [this.word.trim()];
        localStorage.setItem("__search__", JSON.stringify(searchList));
        this.addLocalStorageSearchList(this.word.trim());
      }
    }
  },
  watch: {
    word(val) {
      if (val != "") {
        this.keyword = false;
        this.getSongList(val);
        // this.$nextTick(() => {
        //   if (!this.Bs) {
        //     this.initBs();
        //   }
        // });
        this.page = 2;
      } else {
        this.keyword = true;
      }
    },
    localStorageSearchList() {
      this.searchList = this.localStorageSearchList;
    }
  },

  created() {
    getHotKeyData().then(res => {
      this.list = res.data.hotkey.slice(0, 10);
    });
    this.searchList = JSON.parse(localStorage.getItem("__search__")) || [];
  },
  mounted() {
    this.initBs();
  }
};
</script>
<style lang="less" scoped>
@import "~style/index.less";
.search {
  .search-box-wrapper {
    height: 40px;
    margin: 20px;
    .search-box {
      height: 40px;
      background: #333;
      padding: 0 6px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      span {
        color: rgba(255, 255, 255, 0.3);
      }
      input {
        width: 100%;
        margin: 0 5px;
        background: #333;
        color: #fff;
      }
    }
  }
  .wrapper {
    position: fixed;
    top: 178px;
    bottom: 60px;
    left: 0px;
    right: 0px;
    overflow: hidden;
    .shortcut-wrapper {
      .hot-key {
        margin: 0 20px 20px 20px;
        font-size: @fs-s;
        h3 {
          color: @fs-color5;
          margin-bottom: 20px;
        }
        ul {
          overflow: hidden;
          .item {
            height: 24px;
            margin: 0px 20px 10px 0px;
            padding: 5px 10px;
            color: rgba(255, 255, 255, 0.3);
            background: #333;
            float: left;
            line-height: 1;
            border-radius: 6px;
          }
        }
      }
      .search-history {
        margin: 0 20px;
        color: rgba(255, 255, 255, 0.5);
        font-size: @fs-s;
        h1 {
          height: 40px;
          line-height: 40px;
          display: flex;
          justify-content: space-between;
        }
        .search-history-list {
          li {
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: @fs-m;
            line-height: 1;
            .text {
              height: 16px;
              flex: 1;
            }
            .del {
              width: 12px;
              height: 12px;
              font-size: @fs-xs;
            }
          }
        }
      }
    }
    .search-result {
      ul {
        padding: 0 30px;
        li {
          height: 36px;
          padding-bottom: 20px;
          font-size: @fs-s;
          color: rgba(255, 255, 255, 0.3);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          i {
            width: 30px;
            display: inline-block;
          }
        }
      }
    }
  }
}
</style>