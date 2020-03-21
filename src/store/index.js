import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    songList: [], // 要播放的歌曲列表
    fullScreen: true, // 大屏小屏
    currentIndex: -1, // 当前正在播放的那首歌
    loop: 0, // 默认值为0顺序播放  1随机  2单曲
    localStorageFavSongList: JSON.parse(localStorage.getItem("__favourite__")) || [],
    localStorageRecentSongList: JSON.parse(localStorage.getItem("__play__")) || [],
    localStorageSearchList: JSON.parse(localStorage.getItem('__search__')) || []
  },
  mutations: {
    // 追加到播放列表
    appendSongList(state, params) {
      state.songList.unshift(params)
    },
    // 添加播放列表
    addSongList(state, params) {
      state.songList = JSON.parse(JSON.stringify(params))
    },
    // 切换大/小播放器
    changeScreen(state, screenState) {
      state.fullScreen = screenState
    },
    // 修改正在播放的歌曲
    changeCurrentIndex(state, index) {
      state.currentIndex = index
    },
    // 下一曲
    nextCurrentIndex(state) {
      if (state.currentIndex == state.songList.length - 1) {
        state.currentIndex = 0;
      } else {
        state.currentIndex++;
      }
    },
    // 上一曲
    prevCurrentIndex(state) {
      if (state.currentIndex == 0) {
        state.currentIndex = state.songList.length - 1;
      } else {
        state.currentIndex--;
      }
    },
    // 修改播放模式
    changeLoop(state) {
      state.loop == 2 ? state.loop = 0 : state.loop++
    },
    // 添加喜爱的音乐
    addLocalStorageFavSongList(state, params) {
      state.localStorageFavSongList.unshift(params)
    },
    // 删除喜爱的音乐
    removeLocalStorageFavSongList(state, index) {
      state.localStorageFavSongList.splice(index, 1)
    },
    // 添加最近播放的音乐
    addLocalStorageRecentSongList(state, params) {
      state.localStorageRecentSongList.unshift(params)
    },
    // 删除最近播放的音乐
    removeLocalStorageRecentSongList(state,index){
      state.localStorageRecentSongList.splice(index,1)
    },
    // 添加搜索历史
    addLocalStorageSearchList(state, params) {
      state.localStorageSearchList.unshift(params)
    },
    // 删除搜索历史
    removeLocalStorageSearchSongList(state,index){
      state.localStorageSearchList.splice(index,1)
    },
    // 清空搜索历史
    clearAllSearchHistory(state){
      state.localStorageSearchList.length = 0
    }
  },
  getters: {
    // 返回当前正在播放的那首歌
    currentSong(state) {
      return state.songList[state.currentIndex] || null
    }
  }
})

export default store
